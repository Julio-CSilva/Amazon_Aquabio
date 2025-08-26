import {
    Box,
    Heading,
    HStack,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Image,
    useDisclosure,
    Divider,
    Link,
} from "@chakra-ui/react";
import { useState } from "react";
import B5Card from "./B5Card";
import { useLanguage } from "../../componentes/LanguageContext";


const MetodologiaB5 = () => {
    const { language } = useLanguage();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [etapaSelecionada, setEtapaSelecionada] = useState(null);

    const texts = {
        pt: {
        titulo: "Metodologia",
        etapas: [
            {
            titulo: "Seleção da amostra",
            resumo: "Espécies selecionadas com base em critérios ecológicos, genômicos e de disponibilidade de dados públicos.",
            desc: (
                <>
                    As espécies amazônicas foram selecionadas considerando sua endemicidade, relevância econômica e evolutiva, e baixa representatividade mitogenômica no NCBI. Foram priorizadas amostras com ao menos três conjuntos de dados (rdSRAs) de diferentes indivíduos e projetos, oriundos de sequenciamento de genoma completo (WGS) com tecnologia Illumina paired-end. A amostragem resultou em 100 mitogenomas de 34 espécies, com predominância da família <Box as="i" display="inline">Cichlidae</Box>. Os dados principais foram obtidos do projeto PRJEB48774 (Sanger Institute), com cobertura média de ~17x usando NovaSeq 150bp PE.
                </>
            ),
            image: "icons/b5/dice.png",
            highlight: { top: "40%", left: "1%", width: "21%", height: "17%" },
            },

            {
            titulo: "Montagem dos Mitogenomas",
            resumo: "Montagem automatizada com validação manual, utilizando pipelines especializados e comparação entre ferramentas.",
            desc: (
                <>
                Para cada espécie, três amostras de indivíduos distintos foram utilizadas, totalizando 100 mitogenomas montados. O pipeline <Link href="https://github.com/gleisonm/mitomine" color="blue.500" isExternal fontWeight="bold">Mitomine</Link> foi utilizado para automatizar e padronizar o processo. As montagens foram feitas com o NOVOPlasty v4.3, usando como semente o mitogenoma de <Box as="i" display="inline">Pygocentrus nattereri</Box> (NC_015840.1). Quando necessário, genes mitocondriais de espécies próximas foram usados para circularizar o contig manualmente. Adicionalmente, o Unicycler v0.5.0 foi usado em conjunto com BWA v0.7.12 para mapear as leituras às montagens, e bamTofastq v2.30 para reconverter os alinhamentos em FASTQ. As montagens foram comparadas utilizando BLAST v2.16, avaliando consistência e qualidade entre os métodos.
                </>
            ),
            image: "icons/b5/assembly.png",
            highlight: { top: "5%", left: "1%", width: "70%", height: "58%" },
            },

            {
            titulo: "Anotação Genômica",
            resumo:"Anotação dupla dos mitogenomas com ferramentas complementares para maior precisão.",
            desc: (
                <>
                    A anotação dos genomas mitocondriais foi realizada com duas ferramentas independentes, visando maior confiabilidade. Inicialmente, utilizou-se o MitoAnnotator, implementado no MitoFish v4.03, com parâmetros padrão. Para validar e refinar a anotação de genes codificadores de proteínas (PCGs), rRNAs e tRNAs, uma segunda anotação foi feita com MITOS2 v2.1.9, utilizando os seguintes parâmetros: código genético de vertebrados (2), base de referência RefSeq63 Metazoa, sequência tratada como circular, e saída nos formatos BED para as feições de interesse (PCGs, tRNAs e rRNAs).
                </>
            ),
            image: "icons/b5/mapping.png",
            highlight: { top: "41%", left: "42%", width: "22%", height: "23%"},
            },

            {
            titulo: "Análises e Região Reguladora",
            resumo: "Avaliação estrutural e funcional dos genes mitocondriais e da região D-loop.",
            desc: (
                <>
                    Foram analisados os genes codificadores de proteínas (PCGs), tRNAs, rRNAs e a região D-loop. Avaliou-se o comprimento dos genes, a presença de códons de parada internos e a conformidade com os códons iniciadores/finais típicos de peixes. A divergência gênica entre espécies foi estimada por alinhamentos com MAFFT v7. As estruturas secundárias de tRNAs foram previstas com tRNAscan-SE v2.0 e visualizadas com R2DT v24. A análise de repetições na região D-loop foi realizada com Tandem Repeats Finder v4.10.0.
                </>
            ),
            image: "icons/b5/analysis.png",
            highlight: { top: "45%", left: "52%", width: "45%", height: "50%"},
            },

            {
            titulo: "Validação e Avaliação da Qualidade",
            resumo: "Verificação da integridade dos genomas mitocondriais e identificação de pseudogenes e heteroplasmia.",
            desc: (
                <>
                    A detecção de heteroplasmia mitocondrial e pseudogenes mitocondriais (NUMTs) foi realizada com NOVOPlasty v4.3.1, adotando um limiar de frequência do alelo maior que 2%. A composição de bases e o uso relativo de códons sinônimos (RSCU) foram analisados com CaiCal v1.4 e scripts em Python v3.12.5. A qualidade das montagens foi avaliada pela presença dos 37 genes esperados: 13 PCGs, 22 tRNAs e 2 rRNAs. <br/>
                    A assimetria de fitas foi medida com a fórmula ATskew = (A - T) / (A + T). Também foi realizada análise de correlação entre o tamanho do genoma e da região de controle usando o método de Spearman, via R v4.4.1.
                    Análises de sintenia e colinearidade foram realizadas para comparar a organização e conservação gênica entre espécies. Alinhamentos com MAFFT v7 e anotações refinadas com MITOS2 v2.1.9 forneceram os dados base. As visualizações foram geradas com scripts em Python v3.12.5.
                </>
            ),
            image: "icons/b5/validation.png",
            highlight: { top: "23%", left: "67%", width: "13.5%", height: "25%"},
            },
        ],
        },
        en: {
        titulo: "Methodology",
        etapas: [
            {
            titulo: "Sample selection",
            resumo: "Species were selected based on ecological relevance, genomic availability, and public dataset accessibility.",
            desc: (
                <>
                    Amazonian fish species were chosen based on their endemic status, economic and evolutionary importance, and low mitochondrial representation in NCBI. Priority was given to species with at least three raw data sets (rdSRAs) from different individuals and projects, derived from whole genome sequencing (WGS) using Illumina paired-end technology. The final dataset included 100 mitogenomes from 34 species, mostly from the <Box as="i" display="inline">Cichlidae</Box> family. Key data were obtained from project PRJEB48774 (Sanger Institute), sequenced at ~17x coverage using NovaSeq 150bp PE.
                </>
            ),
            image: "icons/b5/dice.png",
            highlight: { top: "40%", left: "1%", width: "21%", height: "17%" },
            },
            
            {
            titulo: "Mitochondrial Genome Assembly",
            resumo: "Automated and manual assembly using specialized tools and comparative validation.",
            desc: (
                <>
                Three distinct samples per species were used, resulting in 100 assembled mitogenomes. The process was automated using <Link href="https://github.com/gleisonm/mitomine" color="blue.500" isExternal fontWeight="bold">Mitomine</Link>, with assemblies generated by NOVOPlasty v4.3 using the <Box as="i" display="inline">Pygocentrus nattereri</Box> mitogenome (NC_015840.1) as the seed. If circularization failed, conserved mitochondrial genes from related species were used to manually complete the contigs.
                Additionally, Unicycler v0.5.0 was employed, mapping assemblies to raw reads with BWA v0.7.12, and converting alignments with bamTofastq v2.30. Final assemblies were compared using BLAST v2.16 to assess accuracy and consistency across tools.
                </>
            ),
            image: "icons/b5/assembly.png",
            highlight: { top: "5%", left: "1%", width: "70%", height: "58%" },
            },

            {
            titulo: "Genome Annotation",
            resumo: "Dual annotation using complementary tools to ensure high accuracy and reliability.",
            desc: (
                <>
                    Mitochondrial genome annotation was carried out using two independent tools to increase annotation confidence. The initial annotation was performed with MitoAnnotator in MitoFish v4.03, using default parameters. To validate and refine the identification of protein-coding genes (PCGs), rRNAs, and tRNAs, a second round was conducted using MITOS2 v2.1.9 with the following parameters: Genetic code = vertebrate (2), Reference = RefSeq63 Metazoa, Treat sequence as circular, Output = BED format, and Feature types = PCGs, tRNAs, and rRNAs.
                </>
            ),
            image: "icons/b5/mapping.png",
            highlight: { top: "41%", left: "42%", width: "22%", height: "23%"},
            },

            {
            titulo: "Analysis and D-loop Region",
            resumo: "Structural and functional assessment of mitochondrial genes and the D-loop using specialized tools.",
            desc: (
                <>
                    Protein-coding genes (PCGs), tRNAs, rRNAs, and the D-loop region were analyzed for gene length, internal stop codons, and conformity to typical fish mitochondrial start/stop codons. Gene divergence across species was assessed using alignments performed with MAFFT v7. Secondary structures of tRNAs were predicted with tRNAscan-SE v2.0 and visualized using R2DT v24. Tandem repeats in the D-loop region were identified using Tandem Repeats Finder v4.10.0.
                </>
            ),
            image: "icons/b5/analysis.png",
            highlight: { top: "45%", left: "52%", width: "45%", height: "50%"},
            },

            {
            titulo: "Validation and Quality Assessment",
            resumo: "Assessment of mitochondrial genome integrity, detection of pseudogenes and heteroplasmy.",
            desc: (
                <>
                    Mitochondrial heteroplasmy and nuclear mitochondrial pseudogenes (NUMTs) were detected using NOVOPlasty v4.3.1, with a major allele frequency (MAF) threshold above 2%. Base composition and relative synonymous codon usage (RSCU) were assessed via CaiCal v1.4 and Python v3.12.5 scripts. Quality control was based on the presence of all 37 expected mitochondrial genes: 13 PCGs, 22 tRNAs, and 2 rRNAs.
                    Strand asymmetry was measured using ATskew = (A - T) / (A + T). A Spearman correlation (non-parametric) was used to evaluate the relationship between mitogenome size and control region size, implemented in R v4.4.1.
                    Synteny and collinearity analyses were performed to evaluate the conservation of gene order and alignment with an evolutionary reference. Alignments were done with MAFFT v7, annotation with MITOS2 v2.1.9, and all visualizations were created using Python v3.12.5.
                </>
            ),
            image: "icons/b5/validation.png",
            highlight: { top: "23%", left: "67%", width: "13.5%", height: "25%"},
            },
        ],
        },
    };
    const images = {
        pt: "images/b5/methodology_pt.png",
        en: "images/b5/methodology_en.png",
    };

    const etapas = texts[language].etapas;
    const handleCardClick = (etapa) => {
        setEtapaSelecionada(etapa);
        onOpen();
    };

    return (
        <Box
        as="section"
        color="#365B6D"
        fontSize="3.125rem"
        fontWeight="bold"
        display="flex"
        flexDirection="column"
        p="6rem 2rem 12rem"
        h="100%"
        alignItems="center"
        textAlign="right"
        >
        <Heading
            background="#ffffff"
            p="0.1rem .75rem"
            borderRadius="25px"
            mb="6rem"
            fontSize="3rem"
        >
        {texts[language].titulo}
        </Heading>

        <HStack gap="5rem" flexWrap="wrap" justify="center">
            {etapas.map((etapa, index) => (
            <B5Card
                key={index}
                image={etapa.image}
                titulo={etapa.titulo}
                desc={etapa.resumo}
                language={language}
                onOpen={() => handleCardClick(etapa)}
            />
            ))}
        </HStack>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
            <ModalOverlay />
            <ModalContent
                maxW={{ base: "90vw", md: "70vw" }}
                maxH={{ base: "80vh", md: "80vh" }}
                overflowY="auto"
                bg="white"
                borderRadius="2xl"
                boxShadow="2xl"
                p={{ base: 4, md: 6 }}
            >
                <ModalHeader
                fontSize="2xl"
                fontWeight="bold"
                color="gray.700"
                borderBottom="1px solid"
                borderColor="gray.200"
                pb={4}
                >
                {etapaSelecionada?.titulo}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody pt={6}>
                <VStack spacing={6} align="center">
                    {/* Imagem com destaque */}
                    <Box position="relative" w="100%" maxW="1000px">
                    <Image
                        src={images[language]}
                        w="100%"
                        h="auto"
                        objectFit="contain"
                        borderRadius="md"
                        boxShadow="md"
                    />
                    {etapaSelecionada?.highlight && (
                        <Box
                        position="absolute"
                        top={etapaSelecionada.highlight.top}
                        left={etapaSelecionada.highlight.left}
                        width={etapaSelecionada.highlight.width}
                        height={etapaSelecionada.highlight.height}
                        border="3px solid red"
                        borderRadius="md"
                        pointerEvents="none"
                        boxShadow="0 0 8px rgba(255, 0, 0, 0.6)"
                        />
                    )}
                    </Box>

                    {/* Texto descritivo */}
                    <Box
                    fontSize="md"
                    color="gray.700"
                    textAlign="justify"
                    lineHeight="1.7"
                    px={4}
                    p={"0.6rem"}
                    >
                    <Divider borderColor="gray.400" mb={5}/>
                        {etapaSelecionada?.desc}
                    </Box>
                </VStack>
                </ModalBody>
            </ModalContent>
            </Modal>

        </Box>
    );
};

export default MetodologiaB5;
