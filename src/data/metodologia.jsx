/**
 * As cinco etapas da metodologia.
 *
 * Fica num arquivo de dados, e não em `i18n/pt.js`, porque as descrições são
 * JSX: trazem itálico de táxon (*Cichlidae*, *Pygocentrus nattereri*), acessões
 * em monoespaçado e links externos. Nomes científicos em itálico são convenção
 * taxonômica, não estilo — achatá-los para texto puro perderia informação.
 *
 * O conteúdo acompanha a seção 4 da dissertação (4.1 Seleção de Amostra a 4.5
 * Análises Bioinformáticas), na mesma ordem e com os mesmos números de versão. Ao
 * atualizar a dissertação, atualize aqui: é a única cópia desses parâmetros que
 * o site publica.
 *
 * ── Sobre as imagens ──
 *
 * A versão anterior tinha UM fluxograma e desenhava por cima um `<svg>` com o
 * retângulo da etapa. Funcionava enquanto cada etapa era um retângulo — mas o
 * fluxograma atual destaca polígonos recortados (a etapa de análises é um "L"
 * que contorna a coluna de visualizações, a de primers tem um degrau), e
 * descrever isso em coordenadas seria reconstruir o desenho no código.
 *
 * Agora cada etapa tem a PRÓPRIA exportação, com o destaque já desenhado no
 * draw.io. As cinco compartilham o mesmo enquadramento — quem garante isso é
 * `scripts/fluxograma-metodologia.mjs`, que alinha os exports por correlação
 * antes de recortar — então a troca entre elas move só a moldura vermelha.
 */

/** O enquadramento comum das cinco imagens. Fixa o `aspect-ratio` do palco. */
export const DIAGRAMA = { largura: 1920, altura: 1114 };

const MITOMINE = "https://github.com/gleisonm/mitomine";
const PRIMER_BLAST = "https://www.ncbi.nlm.nih.gov/tools/primer-blast/";

export const ETAPAS = [
    {
        id: "selecao",
        icone: "icons/b5/dice.png",
        imagem: "images/b5/fluxo-selecao.png",
        pt: {
            titulo: "Seleção da amostra",
            resumo: "Mineração automatizada do NCBI: 100 mitogenomas de 34 espécies amazônicas, filtrados por plataforma, biblioteca e lacuna no GenBank.",
            descricao: (
                <>
                    <p>
                        As espécies foram obtidas dos repositórios do NCBI por scripts que cruzam
                        os bancos de taxonomia, nucleotídeo e <i>Sequence Read Archive</i> (SRA)
                        através das E-utilities (API Entrez). A triagem não foi manual: uma rotina
                        em Bash e Python varre a árvore taxonômica das famílias de interesse,
                        recupera os TaxIDs amazônicos, consulta o banco Nucleotide em busca de
                        lacunas (<code>{'"mitochondrion" AND "complete genome"'}</code>) e só então
                        filtra o SRA por <code>Platform=ILLUMINA</code>,{" "}
                        <code>LibraryLayout=PAIRED</code> e <code>LibraryStrategy=WGS</code>.
                    </p>
                    <p>
                        Foram priorizadas espécies com menos de três mitogenomas completos
                        depositados e alta relevância econômica ou evolutiva, preferencialmente com
                        três conjuntos de dados brutos de indivíduos ou bioprojetos distintos — a
                        redundância que permite avaliar a reprodutibilidade do pipeline em
                        condições diferentes de sequenciamento. Abriu-se exceção para{" "}
                        <i>Pygocentrus nattereri</i>, cujas amostras vêm do mesmo indivíduo, e para
                        duas espécies de ciclídeos com apenas dois SRA.
                    </p>
                    <p>
                        Os dados foram acessados entre novembro de 2023 e maio de 2024, totalizando
                        100 mitogenomas de 34 espécies: 30 de <i>Cichlidae</i>, 2 de{" "}
                        <i>Serrasalmidae</i> e 2 de <i>Osteoglossidae</i>. Os ciclídeos vieram do
                        projeto PRJEB48774, do Instituto Sanger, que sequenciou 288 ciclídeos
                        brasileiros a ~17× em Illumina NovaSeq 150 bp PE. A filtragem termina num
                        arquivo <code>.csv</code>, que é a entrada do pipeline de montagem.
                    </p>
                </>
            ),
        },
        en: {
            titulo: "Sample selection",
            resumo: "Automated NCBI mining: 100 mitogenomes from 34 Amazonian species, filtered by platform, library, and GenBank gap.",
            descricao: (
                <>
                    <p>
                        Species were retrieved from NCBI repositories by scripts that cross-query
                        the Taxonomy, Nucleotide, and <i>Sequence Read Archive</i> (SRA) databases
                        through the E-utilities (Entrez API). Screening was not manual: a Bash and
                        Python routine walks the taxonomic tree of the target families, collects
                        the Amazonian TaxIDs, queries Nucleotide for gaps (
                        <code>{'"mitochondrion" AND "complete genome"'}</code>), and only then filters
                        SRA for <code>Platform=ILLUMINA</code>, <code>LibraryLayout=PAIRED</code>,
                        and <code>LibraryStrategy=WGS</code>.
                    </p>
                    <p>
                        Priority went to species with fewer than three complete mitogenomes on
                        record and high economic or evolutionary relevance, preferably with three
                        raw datasets from different individuals or bioprojects — the redundancy
                        that makes it possible to assess pipeline reproducibility across
                        sequencing conditions. Exceptions were made for{" "}
                        <i>Pygocentrus nattereri</i>, whose samples come from a single individual,
                        and for two cichlid species with only two SRA runs.
                    </p>
                    <p>
                        Data were accessed between November 2023 and May 2024, totalling 100
                        mitogenomes from 34 species: 30 <i>Cichlidae</i>, 2 <i>Serrasalmidae</i>,
                        and 2 <i>Osteoglossidae</i>. The cichlids came from project PRJEB48774, run
                        by the Sanger Institute, which sequenced 288 Brazilian cichlids at ~17×
                        coverage on Illumina NovaSeq 150 bp PE. Filtering ends in a{" "}
                        <code>.csv</code> file, the input to the assembly pipeline.
                    </p>
                </>
            ),
        },
    },

    {
        id: "montagem",
        icone: "icons/b5/assembly.png",
        imagem: "images/b5/fluxo-montagem.png",
        pt: {
            titulo: "Montagem dos mitogenomas",
            resumo: "Pipeline Mitomine em Nextflow: NOVOPlasty com semente universal, validação cruzada com Unicycler e chamada de heteroplasmia.",
            descricao: (
                <>
                    <p>
                        A montagem roda no pipeline{" "}
                        <a href={MITOMINE} target="_blank" rel="noreferrer">
                            Mitomine
                        </a>
                        , construído sobre o gerenciador de fluxo Nextflow e desenvolvido em
                        colaboração com outros pesquisadores. As amostras são processadas em
                        paralelo, cada ferramenta num contêiner isolado (Docker/Singularity). A
                        entrada é o <code>.csv</code> de accessions da etapa anterior: o SRA Toolkit
                        v3.0 baixa os arquivos com <code>prefetch</code> e os converte em FASTQ com{" "}
                        <code>fastq-dump --split-files</code>, preservando o emparelhamento das
                        leituras <i>forward</i> e <i>reverse</i>.
                    </p>
                    <p>
                        A montagem <i>de novo</i> usa o NOVOPlasty v4.3, de estratégia{" "}
                        <i>seed-and-extend</i>, com o mitogenoma de <i>Pygocentrus nattereri</i>{" "}
                        (GenBank <code>NC_015840.1</code>) como semente universal — a conservação de
                        genes como <i>cox1</i> e <i>cytb</i> garante identidade suficiente para
                        ancorar as leituras mesmo em espécies distantes. O pipeline persiste em
                        disco a tabela hash da biblioteca em vez de descartá-la: medido em 100
                        amostras na mesma máquina (48 CPUs, 236 GB de RAM, Debian 12), reaproveitar
                        o índice reduziu o tempo de execução por amostra em 53% em média.
                    </p>
                    <p>
                        A validação cruzada usa um segundo montador: o BWA-MEM alinha as leituras
                        originais contra o contig do NOVOPlasty, o <code>bamToFastq</code> (Bedtools
                        v2.30) devolve FASTQ limpos e o Unicycler os remonta por grafos de De
                        Bruijn — lógica matemática distinta. Alta identidade entre os dois contigs
                        confere confiança ao resultado, e nas discrepâncias o Unicycler costumou
                        resolver as regiões repetitivas que impediram a circularização. Tudo foi
                        ainda comparado ao banco NCBI-NR com BLAST v2.16.
                    </p>
                    <p>
                        Em paralelo, o módulo <i>Heteroplasmy Caller</i> realinha as leituras contra
                        o mitogenoma circularizado e calcula a frequência de cada base por posição.
                        Três filtros separam ruído de heteroplasmia real: MAF acima do limiar,
                        cobertura superior a 300× para reportar variantes abaixo de 3% e exclusão de
                        bases com Phred inferior a 20.
                    </p>
                </>
            ),
        },
        en: {
            titulo: "Mitogenome assembly",
            resumo: "Mitomine pipeline on Nextflow: NOVOPlasty with a universal seed, cross-validation against Unicycler, and heteroplasmy calling.",
            descricao: (
                <>
                    <p>
                        Assembly runs on the{" "}
                        <a href={MITOMINE} target="_blank" rel="noreferrer">
                            Mitomine
                        </a>{" "}
                        pipeline, built on the Nextflow workflow manager and developed with other
                        researchers. Samples are processed in parallel, each tool in its own
                        isolated container (Docker/Singularity). The input is the accession{" "}
                        <code>.csv</code> from the previous step: SRA Toolkit v3.0 fetches the runs
                        with <code>prefetch</code> and converts them to FASTQ with{" "}
                        <code>fastq-dump --split-files</code>, preserving the pairing between{" "}
                        <i>forward</i> and <i>reverse</i> reads.
                    </p>
                    <p>
                        <i>De novo</i> assembly uses NOVOPlasty v4.3 and its{" "}
                        <i>seed-and-extend</i> strategy, with the <i>Pygocentrus nattereri</i>{" "}
                        mitogenome (GenBank <code>NC_015840.1</code>) as the universal seed — the
                        conservation of genes such as <i>cox1</i> and <i>cytb</i> gives enough
                        sequence identity to anchor reads even in distant species. The pipeline
                        keeps the library hash table on disk instead of discarding it: measured
                        across 100 samples on the same machine (48 CPUs, 236 GB RAM, Debian 12),
                        reusing the index cut per-sample runtime by 53% on average.
                    </p>
                    <p>
                        Cross-validation brings in a second assembler: BWA-MEM aligns the original
                        reads back to the NOVOPlasty contig, <code>bamToFastq</code> (Bedtools
                        v2.30) returns clean FASTQ files, and Unicycler reassembles them through De
                        Bruijn graphs — a distinct mathematical approach. High identity between the
                        two contigs gives confidence in the result, and where they disagreed
                        Unicycler usually resolved the repetitive regions that had blocked
                        circularization. Everything was also compared against NCBI-NR with BLAST
                        v2.16.
                    </p>
                    <p>
                        In parallel, the <i>Heteroplasmy Caller</i> module realigns the reads
                        against the circularized mitogenome and computes per-position base
                        frequencies. Three filters separate noise from real heteroplasmy: MAF above
                        threshold, coverage above 300× before reporting variants below 3%, and
                        exclusion of bases with Phred below 20.
                    </p>
                </>
            ),
        },
    },

    {
        id: "anotacao",
        icone: "icons/b5/mapping.png",
        imagem: "images/b5/fluxo-anotacao.png",
        pt: {
            titulo: "Anotação funcional",
            resumo: "Anotação dupla — MitoAnnotator e MITOS2 — para os 37 genes e a região controle, com motores de predição independentes.",
            descricao: (
                <>
                    <p>
                        Validada a circularidade, os mitogenomas passam pela anotação dos 37 genes
                        esperados — 13 codificadores de proteínas (PCGs), 22 tRNAs e 2 rRNAs — e da
                        região controle (D-loop). A primeira passagem é do MitoAnnotator, integrado
                        ao MitoFish v4.03, escolhido por ser especializado em peixes. Antes de
                        anotar, ele reorienta a sequência circular: localiza o tRNA-Phe e rotaciona
                        o genoma para que ele ocupe a primeira posição, logo após o D-loop,
                        conforme a convenção para vertebrados. Essa padronização é o que torna as
                        figuras de sintenia comparáveis entre amostras.
                    </p>
                    <p>
                        As fronteiras dos PCGs saem de uma árvore de decisão. Para o códon de
                        parada, o algoritmo estende as regiões de similaridade do BLASTX até um
                        stop canônico, tolerando sobreposição de leitura em genes conhecidos por
                        ela (<i>ATP8</i>, <i>COX1</i>, <i>ND4L</i>, <i>ND5</i> e <i>ND6</i>); sem
                        stop completo, trunca o gene na posição anterior ao elemento seguinte e
                        registra um stop incompleto (<code>T--</code> ou <code>TA-</code>). Para o
                        códon de início, prioriza <code>ATG</code> ou <code>GTG</code> e, na
                        ausência deles, tolera 1 pb de sobreposição em <i>ND1</i>, <i>ND2</i>,{" "}
                        <i>ND3</i>, <i>ND5</i>, <i>ATP6</i> e <i>ND4</i>, ou até 20 pb em{" "}
                        <i>ND1</i>, <i>ND3</i>, <i>ATP6</i> e <i>COX2</i>; persistindo a
                        ambiguidade, busca iniciadores alternativos (<code>CTG</code> para{" "}
                        <i>ATP6</i>, <code>TTG</code> para <i>ND1</i>, <code>ATA</code>/
                        <code>ATT</code> para <i>ND3</i>) e, por fim, decide pelo intervalo de
                        tamanho esperado do gene.
                    </p>
                    <p>
                        Como algumas amostras apresentaram start e stop codons prematuros, uma
                        segunda anotação foi feita com o MITOS2 v2.1.9, executado via servidor
                        Galaxy, para distinguir variação real de erro de montagem. Os dois motores
                        divergem por construção: o MitoAnnotator busca similaridade direta (BLASTX
                        com regras empíricas de extensão) contra um banco de peixes, e o MITOS2 usa
                        HMM e modelos de covariância (Infernal) generalistas para Metazoa. Cabe a
                        ressalva de que ambos usam o MiTFi para tRNAs: a verificação é independente
                        apenas para PCGs e rRNAs.
                    </p>
                </>
            ),
        },
        en: {
            titulo: "Functional annotation",
            resumo: "Dual annotation — MitoAnnotator and MITOS2 — covering the 37 genes and the control region, with independent prediction engines.",
            descricao: (
                <>
                    <p>
                        Once circularity is validated, the mitogenomes are annotated for the 37
                        expected genes — 13 protein-coding genes (PCGs), 22 tRNAs, and 2 rRNAs —
                        plus the control region (D-loop). The first pass uses MitoAnnotator, built
                        into MitoFish v4.03 and chosen because it specializes in fish. Before
                        annotating, it reorients the circular sequence: it locates tRNA-Phe and
                        rotates the genome so that gene comes first, right after the D-loop, per
                        the vertebrate convention. That standardization is what makes the synteny
                        figures comparable across samples.
                    </p>
                    <p>
                        PCG boundaries come out of a decision tree. For the stop codon, the
                        algorithm extends the BLASTX similarity regions until it finds a canonical
                        stop, allowing read-through in genes known to overlap (<i>ATP8</i>,{" "}
                        <i>COX1</i>, <i>ND4L</i>, <i>ND5</i>, and <i>ND6</i>); with no complete
                        stop, it truncates the gene just before the next element and records an
                        incomplete stop (<code>T--</code> or <code>TA-</code>). For the start
                        codon, it prefers <code>ATG</code> or <code>GTG</code> and, failing those,
                        tolerates 1 bp of overlap in <i>ND1</i>, <i>ND2</i>, <i>ND3</i>,{" "}
                        <i>ND5</i>, <i>ATP6</i>, and <i>ND4</i>, or up to 20 bp in <i>ND1</i>,{" "}
                        <i>ND3</i>, <i>ATP6</i>, and <i>COX2</i>; if ambiguity persists, it looks
                        for alternative starts (<code>CTG</code> for <i>ATP6</i>, <code>TTG</code>{" "}
                        for <i>ND1</i>, <code>ATA</code>/<code>ATT</code> for <i>ND3</i>) and
                        finally decides by the gene’s expected length range.
                    </p>
                    <p>
                        Because some samples showed premature start and stop codons, a second
                        annotation was run with MITOS2 v2.1.9 on a Galaxy server, to tell real
                        variation from assembly error. The two engines differ by design:
                        MitoAnnotator searches for direct similarity (BLASTX with empirical
                        extension rules) against a fish database, while MITOS2 uses HMMs and
                        covariance models (Infernal) generalized for Metazoa. One caveat: both rely
                        on MiTFi for tRNAs, so the check is genuinely independent only for PCGs and
                        rRNAs.
                    </p>
                </>
            ),
        },
    },

    {
        id: "primers",
        icone: "icons/b5/validation.png",
        imagem: "images/b5/fluxo-primers.png",
        pt: {
            titulo: "Geração de primers",
            resumo: "Primers espécie a espécie no Primer-BLAST e primers de família a partir de sequências de consenso.",
            descricao: (
                <>
                    <p>
                        Os primers foram desenhados no{" "}
                        <a href={PRIMER_BLAST} target="_blank" rel="noreferrer">
                            Primer-BLAST
                        </a>
                        , que combina o kit de ferramentas C++ do NCBI com a interface de
                        programação do Primer3, na mesma parametrização adotada por Silva (2025).
                    </p>
                    <p>
                        O produto de PCR foi restringido a um mínimo de 70 pb e um máximo de 250 pb.
                        A temperatura de fusão (Tm) vai de 57,0 °C a 63,0 °C, com ideal em 60,0 °C.
                        Cada primer projetado foi atribuído a um organismo específico.
                    </p>
                    <p>
                        Para os primers de família, o caminho é outro: as sequências são alinhadas
                        com MAFFT v7 e reduzidas a uma sequência de consenso pelo EMBOSS Cons
                        v6.5.7, e é sobre esse consenso que o desenho é feito — o que produz primers
                        capazes de amplificar o grupo inteiro, e não uma espécie só.
                    </p>
                </>
            ),
        },
        en: {
            titulo: "Primer design",
            resumo: "Species-level primers in Primer-BLAST, and family-level primers built from consensus sequences.",
            descricao: (
                <>
                    <p>
                        Primers were designed in{" "}
                        <a href={PRIMER_BLAST} target="_blank" rel="noreferrer">
                            Primer-BLAST
                        </a>
                        , which pairs the NCBI C++ toolkit with the Primer3 programming interface,
                        using the same parameter set adopted by Silva (2025).
                    </p>
                    <p>
                        PCR product size was constrained to a minimum of 70 bp and a maximum of
                        250 bp. Melting temperature (Tm) ranges from 57.0 °C to 63.0 °C, with an
                        optimum of 60.0 °C. Every designed primer was assigned to a specific
                        organism.
                    </p>
                    <p>
                        Family-level primers take a different route: sequences are aligned with
                        MAFFT v7 and reduced to a consensus with EMBOSS Cons v6.5.7, and the design
                        is done on that consensus — which yields primers able to amplify the whole
                        group rather than a single species.
                    </p>
                </>
            ),
        },
    },

    {
        id: "analises",
        icone: "icons/b5/analysis.png",
        imagem: "images/b5/fluxo-analises.png",
        pt: {
            titulo: "Análises bioinformáticas",
            resumo: "Da filogenia por máxima verossimilhança à composição, cobertura e sintenia — oito eixos sobre os mesmos 100 genomas.",
            descricao: (
                <>
                    <p>
                        A etapa se divide em dois módulos. Na reconstrução filogenética, o conjunto
                        concatenado dos 13 PCGs de cada indivíduo é alinhado com MAFFT v7; o MEGA
                        11.0.13 determina o modelo de substituição pelo Critério de Informação de
                        Akaike, que retornou GTR + G + I como o melhor para este conjunto; o IQ-TREE
                        v2.3.6 infere a árvore por máxima verossimilhança com <i>ultrafast
                        bootstrap</i> de 10.000 repetições; e o arquivo Newick resultante é
                        renderizado no iTOL v6.9.1.
                    </p>
                    <p>
                        O segundo módulo é uma suíte de scripts em Python v3.12.5 que itera sobre os
                        100 genomas e produz relatórios padronizados:
                    </p>
                    <ul>
                        <li>
                            <b>Uso de códons (RSCU)</b> — o CaiCal calcula as frequências e o script
                            gera um gráfico de barras por indivíduo, destacando a preferência de
                            códon de cada aminoácido.
                        </li>
                        <li>
                            <b>Região controle</b> — o Tandem Repeats Finder v4.10.0 localiza as
                            repetições em tandem do D-loop; o script extrai tamanho da unidade e
                            número de cópias.
                        </li>
                        <li>
                            <b>Sintenia</b> — das coordenadas <code>.bed</code> da anotação saem os
                            diagramas lineares de ordem gênica.
                        </li>
                        <li>
                            <b>Heteroplasmia</b> — as variantes com MAF acima de 2% viram gráficos
                            circulares no CIRCOS, mapeando cobertura e sítios polimórficos.
                        </li>
                        <li>
                            <b>Assimetria composicional</b> — AT-skew = (A − T)/(A + T) e GC-skew =
                            (G − C)/(G + C) nas 38 features. Como o skew depende da fita, as duas
                            convenções são gravadas lado a lado: tudo na fita majoritária da
                            montagem (o padrão) e cada feature na própria fita codificadora, em
                            colunas <code>_cod</code>, que preservam o sentido biológico em{" "}
                            <i>ND6</i> e nos oito tRNAs da fita minoritária.
                        </li>
                        <li>
                            <b>Cobertura</b> — o SAMtools v1.24 ordena e indexa alinhamento e
                            referência, e o gráfico de profundidade por posição distingue uma
                            montagem uniformemente sustentada de outra com trechos frágeis.
                        </li>
                        <li>
                            <b>Sobreposições e regiões intergênicas</b> — <code>diff</code> = (início
                            de B − fim de A) − 1 para cada par vizinho: negativo é sobreposição, zero
                            é contiguidade, positivo é espaçador. O círculo se fecha entre a última e
                            a primeira feature.
                        </li>
                    </ul>
                </>
            ),
        },
        en: {
            titulo: "Bioinformatic analyses",
            resumo: "From maximum-likelihood phylogeny to composition, coverage, and synteny — eight axes over the same 100 genomes.",
            descricao: (
                <>
                    <p>
                        The step splits into two modules. For phylogenetic reconstruction, the
                        concatenated set of each individual’s 13 PCGs is aligned with MAFFT v7; MEGA
                        11.0.13 picks the substitution model by the Akaike Information Criterion,
                        which returned GTR + G + I as the best fit for this dataset; IQ-TREE v2.3.6
                        infers the tree by maximum likelihood with 10,000 <i>ultrafast bootstrap</i>{" "}
                        replicates; and the resulting Newick file is rendered in iTOL v6.9.1.
                    </p>
                    <p>
                        The second module is a suite of Python v3.12.5 scripts that iterate over
                        the 100 genomes and emit standardized reports:
                    </p>
                    <ul>
                        <li>
                            <b>Codon usage (RSCU)</b> — CaiCal computes the frequencies and the
                            script draws a bar chart per individual, highlighting each amino acid’s
                            codon preference.
                        </li>
                        <li>
                            <b>Control region</b> — Tandem Repeats Finder v4.10.0 locates the tandem
                            repeats in the D-loop; the script extracts repeat unit size and copy
                            number.
                        </li>
                        <li>
                            <b>Synteny</b> — the <code>.bed</code> coordinates from annotation feed
                            the linear gene-order diagrams.
                        </li>
                        <li>
                            <b>Heteroplasmy</b> — variants above 2% MAF become circular CIRCOS
                            plots, mapping coverage against polymorphic sites.
                        </li>
                        <li>
                            <b>Compositional skew</b> — AT-skew = (A − T)/(A + T) and GC-skew =
                            (G − C)/(G + C) across the 38 features. Because skew is
                            strand-dependent, both conventions are written side by side: everything
                            on the assembly’s major strand (the default) and each feature on its own
                            coding strand, in <code>_cod</code> columns that preserve the biological
                            meaning for <i>ND6</i> and the eight minor-strand tRNAs.
                        </li>
                        <li>
                            <b>Coverage</b> — SAMtools v1.24 sorts and indexes alignment and
                            reference, and the depth-per-position plot separates a uniformly
                            supported assembly from one with fragile stretches.
                        </li>
                        <li>
                            <b>Overlaps and intergenic regions</b> — <code>diff</code> = (start of B
                            − end of A) − 1 for each neighbouring pair: negative is an overlap, zero
                            is contiguity, positive is a spacer. The circle closes between the last
                            and first features.
                        </li>
                    </ul>
                </>
            ),
        },
    },
];
