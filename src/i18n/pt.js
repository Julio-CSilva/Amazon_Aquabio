/**
 * Texto da interface em português.
 *
 * Consolida os ~15 objetos `texts = { pt, en }` que viviam dentro de cada
 * componente. A duplicação custava caro de duas formas: qualquer ajuste de
 * redação exigia caçar o componente certo, e as duas línguas saíam de sincronia
 * sem que nada acusasse — foi assim que os rótulos de status da IUCN ficaram só
 * em inglês na barra de filtros, em qualquer idioma.
 *
 * `en.js` espelha esta estrutura chave a chave. `provider.jsx` avisa no console,
 * em desenvolvimento, quando uma chave falta em um dos dois.
 *
 * NÃO entra aqui:
 *  - Descrições da metodologia: são JSX (itálico de táxon, link externo) e vivem
 *    em `data/metodologia.jsx`.
 *  - Biografias dos pesquisadores: prosa longa por pessoa, em `data/pesquisadores.js`.
 *  - Rótulos dos gráficos Plotly: acoplados ao código da figura, ficam em
 *    `features/analises/`.
 *  - Nomes de espécie e descrições: vêm dos dados (`especies.json`), não da UI.
 */

export default {
    site: {
        nome: "Amazon Aquabio",
        descricao:
            "Plataforma de exploração da diversidade mitogenômica de peixes amazônicos: 100 mitogenomas de 34 espécies.",
    },

    nav: {
        inicio: "Início",
        sobre: "Sobre",
        mapa: "Mapa",
        metodologia: "Metodologia",
        amostras: "Amostras",
        comparador: "Comparador",
        pesquisadores: "Pesquisadores",
        contato: "Contato",
        menu: "Menu",
        abrirMenu: "Abrir menu de navegação",
        fecharMenu: "Fechar menu",
        irParaConteudo: "Ir para o conteúdo",
        idioma: "Idioma",
        tema: "Tema",
        temaClaro: "Tema claro",
        temaEscuro: "Tema escuro",
    },

    hero: {
        etiqueta: "Mitogenômica da Amazônia",
        titulo: "Explore a diversidade mitogenômica da Amazônia",
        corpo: "Por meio de data mining em bancos públicos de dados do NCBI, reconstruímos 100 mitogenomas de 34 espécies de peixes amazônicos. Este conjunto de dados oferece uma base sólida para investigações sobre a diversidade genética da região, permitindo estudos de estrutura populacional, conservação sustentável e muito mais. Descubra como essas informações podem revelar relações evolutivas e contribuir para políticas ambientais mais eficazes.",
        verAmostras: "Ver as amostras",
        verMetodologia: "Como foi feito",
        altLogo: "Logo do Amazon Aquabio: uma fita de DNA ao lado do nome do site",
        altPeixes: "Ilustração de um cardume de peixes amazônicos",

        // Rótulos curtos da telemetria. Separados de `stats.*`, que são frases
        // inteiras ("mitogenomas montados"): aqui precisam caber numa coluna
        // estreita em versalete.
        rotulos: {
            mitogenomas: "MITOGENOMAS",
            especies: "ESPÉCIES",
            ineditos: "INÉDITOS",
        },
    },

    mitogenoma: {
        etiqueta: "O ponto de partida",
        titulo: "O que é o genoma mitocondrial?",
        corpo1: "O genoma mitocondrial de vertebrados é uma molécula pequena, circular, com cerca de 16 a 18 mil pares de bases. Ele abriga 13 genes essenciais que codificam proteínas, além de 22 RNAs de transferência (tRNAs), 2 RNAs ribossômicos (rRNAs) e uma região de controle responsável pela regulação da replicação e transcrição.",
        corpo2: "Apesar de evoluir mais rapidamente que o genoma nuclear, o DNA mitocondrial é amplamente utilizado na identificação de espécies e em estudos evolutivos. Sua análise pode fornecer insights valiosos sobre a taxonomia e a história evolutiva das espécies — especialmente na biodiversidade aquática da América do Sul.",

        // O mapa circular desenhado a partir de `public/data/sintenia.json`.
        legenda: "Mapa do mitogenoma de {especie} — {bp} pb, {genes} genes.",
        escolherEspecie: "Espécie",
        fitaPesada: "Fita pesada (+)",
        fitaLeve: "Fita leve (−)",
        classes: {
            pcg: "Genes codificadores (PCG)",
            rrna: "RNA ribossômico",
            trna: "RNA transportador",
            control: "Região controle",
            outro: "Não identificado",
        },
        tooltip: {
            posicao: "{inicio}–{fim} pb",
            tamanho: "{bp} pb",
            fita: "fita {fita}",
        },
        dicaDloop: "A região controle (D-loop) é onde ficam as repetições em tandem analisadas mais adiante.",
    },

    stats: {
        titulo: "Mitogenomas amazônicos em números",
        montados: "mitogenomas montados",
        ineditos: "mitogenomas inéditos",
        especies: "espécies de peixes analisadas",
        legendaCarrossel: "Espécies do acervo",

        roleta: {
            rotulo: "Roleta das espécies do acervo",
            pausar: "Pausar a roleta",
            retomar: "Retomar a roleta",
            anterior: "Espécie anterior",
            proxima: "Próxima espécie",
            dica: "Arraste, use as setas do teclado ou os botões",
            emFoco: "Em foco: {especie}",
        },
    },

    mapa: {
        etiqueta: "Distribuição",
        titulo: "Localização das espécies na bacia amazônica",
        corpo1: "A América do Sul concentra cerca de 27% das espécies conhecidas de peixes, com mais de 9.100 espécies distribuídas entre águas doces e zonas costeiras. A região amazônica é o principal destaque, especialmente a Bacia Amazônica, que abriga a maior diversidade de peixes de água doce do mundo, com aproximadamente 2.400 espécies descritas. Essa riqueza biológica, no entanto, vem sendo ameaçada pelo impacto crescente das atividades humanas sobre os ecossistemas aquáticos.",
        corpo2: "O mapa ao lado mostra as regiões da bacia amazônica onde as 34 espécies de peixes analisadas neste estudo já foram registradas. Essa visualização espacial contribui para compreender a distribuição das espécies e suas possíveis relações com fatores ecológicos e evolutivos.",
        titulo_acessivel: "Mapa de ocorrências na Bacia Amazônica",
        todasEspecies: "Todas as espécies",
        ocorrencias: "{n} ocorrências",
        ocorrencia: "1 ocorrência",
        carregando: "Carregando o mapa…",
        erro: "Não foi possível carregar os pontos de ocorrência.",
    },

    metodologia: {
        etiqueta: "Do dado bruto ao mitogenoma",
        titulo: "Metodologia",
        verMais: "Ver mais",
        etapa: "Etapa {n} de {total}",
        rolarDica: "Role para percorrer as etapas",
        diagramaAlt: "Fluxograma da metodologia, com a etapa “{etapa}” em destaque",
        trilho: "Etapas da metodologia",
    },

    galeria: {
        etiqueta: "Acervo",
        titulo: "Amostras",
        filtros: "Filtros",
        pesquisar: "Buscar por nome, espécie ou SRA…",
        limparBusca: "Limpar busca",
        status: "Status na IUCN",
        todosValores: "Todos os status",
        resultados: "{n} espécies",
        resultado: "1 espécie",
        nenhumResultado: "Nenhuma espécie corresponde a esses filtros.",
        limparFiltros: "Limpar filtros",
        expandir: "Ver detalhes de {especie}",
    },

    especie: {
        amostra: "Amostra",
        statusIucn: "Status na Lista Vermelha da IUCN",
        desconhecido: "Desconhecido",
        nomePopular: "Nome popular",
        semNomePopular: "Sem nome popular",
        fechar: "Fechar",
        verNoSra: "Ver {sra} no NCBI SRA",
        baixarFasta: "Mito FASTA",
        baixarNcbi: "NCBI",
        baixarGens: "Genes FASTA",
        indisponivel: "Arquivo indisponível",
        atribuicao: "Imagem por {autor}, sob licença CC BY-NC-SA",
        verLicenca: "Ver a atribuição original",
        descricaoBiologica: "Descrição biológica",
        semAmostras: "Nenhuma amostra genômica vinculada a esta espécie no momento.",
    },

    comparador: {
        etiqueta: "Lado a lado",
        titulo: "Comparador",
        info: "Selecione as amostras (SRAs) que deseja comparar.",
        gerar: "Gerar",
        verOpcoes: "Ver opções",
        recolher: "Recolher",
        selecionadas: "{n} amostras selecionadas",
        selecionada: "1 amostra selecionada",
        nenhumaSelecionada: "Nenhuma amostra selecionada",
        limpar: "Limpar seleção",
        selecionarTodasDa: "Selecionar todas as amostras de {especie}",
    },

    visualizador: {
        titulo: "Comparação das análises",
        nenhuma: "Nenhuma amostra selecionada. Volte ao comparador e escolha ao menos uma.",
        voltar: "Voltar ao comparador",
        amostras: "amostras",
        amostra: "amostra",
        especies: "espécies",
        especie: "espécie",
        interativo: "interativo",
        imagem: "imagem",
        subSintenia: "Todas as amostras no mesmo eixo, alinhadas gene a gene.",
        subRscu: "Uso de códons sinônimos das amostras selecionadas, lado a lado.",
        subDloop: "Região controle em escala. A análise é por espécie, então amostras da mesma espécie aparecem uma vez só.",
        subImagem: "Figuras geradas fora do site, uma por amostra.",
        anterior: "Anterior",
        proximo: "Próxima",
    },

    abas: {
        circular: "Mitogenoma",
        trna: "tRNA",
        sintenia: "Sintenia",
        rscu: "RSCU",
        dloop: "D-loop (repetições)",
    },

    analise: {
        carregandoGrafico: "Carregando gráfico…",
        carregandoAnalise: "Carregando análise…",
        erroTitulo: "Não foi possível carregar os dados da análise.",
    },

    pesquisadores: {
        etiqueta: "Quem faz",
        titulo: "Pesquisadores",
        subtitulo: "Conheça a equipe multidisciplinar de pesquisadores, bioinformatas e desenvolvedores por trás do Amazon Aquabio.",
        lattes: "Lattes",
        linkedin: "LinkedIn",
        orcid: "ORCID",
        anterior: "Pesquisador anterior",
        proximo: "Próximo pesquisador",
        verPerfil: "Ver perfil completo",
        biografiaCompleta: "Biografia acadêmica",
        areasAtuacao: "Áreas de atuação",
        afiliacao: "Instituição & Afiliação",
        fechar: "Fechar",
        fonteLattes: "Currículo Lattes / CNPq",
        contagem: "{total} pesquisadores",
        contagemFiltrada: "{filtrado} de {total} pesquisadores",
        filtros: {
            todos: "Todos",
            docentes: "Docência & Coordenação",
            posGraduacao: "Pós-Graduação",
            pesquisa: "Pesquisa & Genômica",
            ti: "TI & Bioinformática",
        },
        buscar: "Buscar pesquisador, área ou instituição…",
        nenhumEncontrado: "Nenhum pesquisador encontrado para esta busca.",
        limparBusca: "Limpar busca",
    },

    contato: {
        titulo: "Nos envie sua mensagem!",
        nome: "Nome",
        email: "Endereço de e-mail",
        instituicao: "Instituição",
        instituicaoOpcional: "Instituição (opcional)",
        mensagem: "Digite sua mensagem",
        enviar: "Enviar",
        enviando: "Enviando…",
        sucesso: "Mensagem enviada com sucesso!",
        erro: "Erro ao enviar a mensagem. Tente novamente.",
        naoConfigurado: "O envio de mensagens não está configurado neste ambiente.",
        autor: "Jorge Estefano Santana de Souza",
        funcao: "(autor correspondente)",
        rotuloAfiliacao: "Afiliação",
        afiliacao: "Bioinformatics Multidisciplinary Environment (BioME), Digital Metropolis Institute, Universidade Federal do Rio Grande do Norte (UFRN), Rio Grande do Norte, Brasil.",
        rotuloEmails: "E-mails",
        emails: ["jorge@imd.ufrn.br"],
        rotuloEnderecoInstitucional: "Endereço institucional",
        enderecoInstitucional: "Universidade Federal do Rio Grande do Norte, Instituto Metrópole Digital",
        endereco: [
            "Avenida Odilon Gomes de Lima, 1722",
            "Capim Macio",
            "59078-400 - Natal, RN - Brasil",
        ],
        rotuloTelefone: "Telefone",
        telefone: "(84) 99708-5398",
        mapaTitulo: "Localização do IMD/UFRN no Google Maps",
    },

    rodape: {
        apoio: "Apoio Institucional",
        apoioDesc: "Instituições e centros de pesquisa que viabilizam e integram o projeto",
        criadores: "Desenvolvedores",
        direitos: "Todos os Direitos Reservados",
        ultimaAtualizacao: "Última atualização dos dados",
        versao: "Versão",
    },

    erro: {
        titulo: "Ops!",
        corpo: "Desculpe, ocorreu um erro inesperado.",
        naoEncontrado: "Página não encontrada.",
        voltar: "Voltar ao início",
    },

    /** Nomes por extenso das categorias da IUCN. Os códigos vêm de `lib/iucn.js`. */
    iucn: {
        NE: "Não Avaliada",
        DD: "Dados Insuficientes",
        LC: "Pouco Preocupante",
        NT: "Quase Ameaçada",
        VU: "Vulnerável",
        EN: "Em Perigo",
        CR: "Criticamente em Perigo",
        EW: "Extinta na Natureza",
        EX: "Extinta",
    },
};
