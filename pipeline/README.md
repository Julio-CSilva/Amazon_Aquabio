# pipeline — dos dados brutos aos JSON das análises

Até a versão 1.6, as análises chegavam ao site como **PNG pronto**: a figura era
gerada fora, copiada para `public/images/b8/` e exibida como imagem. Comparar
duas amostras era comparar dois desenhos.

Estes scripts trocam a imagem pelo **dado**. Eles leem as anotações que o site
já publica, calculam a análise e gravam um JSON em `public/data/`, que o site
desenha em tempo real (`src/analises/`).

```bash
python3 pipeline/build_all.py            # gera os três JSON
python3 pipeline/build_all.py --validar  # e confere o RSCU contra o artigo
```

Só biblioteca padrão do Python 3.10+. Sem venv, sem instalar nada — o
repositório tem DOI, e um dado que só se reproduz com o ambiente certo não se
reproduz.

## O que cada build faz

| Script | Entrada | Saída | Unidade |
| --- | --- | --- | --- |
| `build_sintenia.py` | `public/docs/b8/gens_fasta/*_genes.fa` | `public/data/sintenia.json` | amostra (100) |
| `build_rscu.py` | `public/docs/b8/gens_fasta/*_genes.fa` | `public/data/rscu.json` | amostra (100) |
| `build_tandem_repeats.py` | `dados_entrada/tsv_tr/*.tsv` | `public/data/tandem_repeats.json` | **espécie (32)** |

Sintenia e RSCU saem do dado que o próprio site distribui: quem baixar o
`_genes.fa` de uma amostra e rodar o script chega ao mesmo número que a tela
mostra. As repetições em tandem são a exceção — a região controle não está
anotada nos `_genes.fa`, então as coordenadas vêm do TRF, já consolidadas por
`tandem_repeats.py` (repositório `AABIO_analysis`) e copiadas para
`dados_entrada/tsv_tr/`.

## Três coisas que o site precisa respeitar

**1. Tandem repeats é por espécie.** São 32 indivíduos para 100 amostras. Duas
espécies do dataset (*Acaronia nassa* e *Biotodoma cupido*) não têm dado, e
`tr_qualidade.tsv` registra o motivo. O JSON leva `sra_para_especie` e
`especies_sem_dado` para a interface dizer "sem dado" em vez de desenhar uma
região controle vazia.

**2. As ressalvas de qualidade viajam com o dado.** `tr_qualidade.tsv` marca
casos graves — comprimento que diverge da anotação, conjunto de loci idêntico
entre duas espécies. Eles vão para o JSON e aparecem na tela junto da figura.

**3. As 100 amostras têm uma ordem gênica só.** O build confirma isso a cada
execução (`n_ordens` no `meta` do `sintenia.json`). Como não há rearranjo, a
comparação de sintenia no site é sobre **posição e comprimento**, não sobre
ordem — um painel de "quem está fora de ordem" estaria sempre vazio.

## RSCU: a convenção, e uma divergência

Código genético **mitocondrial de vertebrados** (`transl_table=2`): `ATA` = Met,
`TGA` = Trp, `AGA`/`AGG` são parada. Sobram 60 códons sensíveis. O RSCU é
normalizado por **família completa** — Ser (UCN + AGY) e Leu (CUN + UUR) somam
6 cada.

`build_rscu.py --validar` compara a média das 100 amostras com
`Consenso_dos_100_mitogenomas.tsv`, o consenso publicado. **Os dois não batem**:

```
diferença máxima:  1,206 (CGA: calculado 2,358 vs artigo 1,152)
diferença média:   0,302
```

O padrão é sistemático: o valor calculado aqui mostra viés forte na terceira
base (A 1,52 · C 1,41 · T 0,75 · G 0,30) e o do artigo está achatado em torno de
1 (A 1,18 · C 1,19 · T 1,00 · G 0,61). Contando os mesmos FASTA **fora de
quadro** — todos os 3-mers sobrepostos, em vez de códon a códon — a diferença
máxima cai de 1,206 para 0,177 e a média de 0,302 para 0,057, o que aponta erro
de quadro de leitura no pipeline que gerou os TSVs originais.

A conferência que sustenta o valor daqui: em `ERR10768189`, Arg tem
CGA 50 · CGC 14 · CGG 8 · CGT 4 de 76 códons, ou seja RSCU(CGA) = 4 × 50/76 =
2,63 — dominância de CGA típica de mtDNA de vertebrado. Os 13 PCGs são lidos a
partir do início anotado; os seis genes cujo comprimento não é múltiplo de 3
(COXII, ATPase6, COXIII, ND3, ND4, Cytb) são os de **códon de parada incompleto**,
biologia esperada, e o resto do códon é descartado.

Vale reconferir os TSVs do artigo antes da próxima submissão.

## Ser e Leu em uma coluna só

O `rscu_plot_from_tsv.py` (versão HTML antiga) dividia Ser e Leu em
`Ser1`/`Ser2` e `Leu1`/`Leu2`, como se fossem aminoácidos distintos. Numa barra
empilhada isso está errado: cada metade exibe só parte da soma e a altura deixa
de ser comparável com as outras famílias. O `rscu_plot.py` (PNG) já tinha
corrigido, fundindo cada aminoácido em uma coluna. **O site segue a versão
corrigida**, com as caixas de códons contíguas na pilha.

## `vendor/`

`sintenia_io.py` e `sintenia_theme.py` são cópias de
`AABIO_analysis/AnalysisPlot_sintenia/`, para o repositório do site ser
autocontido. São a fonte do vocabulário canônico de genes, da ordem consenso e
da paleta — trocar a cor de um gene lá muda a figura do site.

Ao atualizar o original, copie de novo:

```bash
cp ../../AABIO_analysis/AnalysisPlot_sintenia/sintenia_{io,theme}.py pipeline/vendor/
python3 pipeline/build_all.py
```

## Saída

`public/data/*.json`, ~170 KB somados (contra os 14 MB de PNG que
substituíram). Cada arquivo carrega em `meta` a data, o commit e a origem do
dado. O site busca sob demanda: só quem abre uma análise baixa o JSON dela.
