import { Box, Heading, HStack, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import B7Card from "./B7Card";
import { useLanguage } from "../../componentes/LanguageContext";
import { useState } from "react";

const PesquisadoresB7 = () => {
    const { language } = useLanguage();
    const [startIndex, setStartIndex] = useState(0);

    const texts = {
        pt: {
        titulo: 'Pesquisadores',
        },
        en: {
        titulo: 'Researchers',
        }
    };

    const pesquisadores = [
        {
            image: 'images/b7/larissa.JPG',
            lattes: 'http://lattes.cnpq.br/1129701706757946',
            linkedin: 'https://www.linkedin.com/in/larissa-martins-brito-e-silva-2b93671a8/',
            orcid: '',
            nome: 'Larissa Martins Brito e Silva',
            pt: {
            desc: "Graduada em Ciências Biológicas pela Universidade do Estado do Rio Grande do Norte (UERN), com experiência em pesquisa sobre estresse salino no Laboratório de Bioquímica e Fisiologia de Plantas (PIBITI/UERN). Atuou em projetos de extensão como Educação Ambiental na Construção do Conhecimento e Evolução nas Escolas. Foi monitora de Sistemática Biológica e Introdução à Bioinformática, além de bolsista do Programa de Residência Pedagógica em Biologia. Tem interesse em genética, bioestatística, bioinformática e evolução. Atualmente, é mestranda em Bioinformática (UFRN), desenvolvendo pesquisas em montagem de genomas mitocondriais de peixes.",
            },
            en: {
            desc: "Graduated in Biological Sciences from the State University of Rio Grande do Norte (UERN), with research experience on salt stress in the Plant Biochemistry and Physiology Laboratory (PIBITI/UERN). Participated in extension projects such as Environmental Education in the Construction of Knowledge and Evolution in Schools. Worked as a teaching assistant in Biological Systematics and Introduction to Bioinformatics, and was also a scholarship holder in the Pedagogical Residency Program in Biology. Has interests in genetics, biostatistics, bioinformatics, and evolution. Currently, she is a master's student in Bioinformatics (UFRN), conducting research on the assembly of mitochondrial genomes of fish.",
            },
        },
        {
            image: 'images/b7/gleison.jpg',
            lattes: 'http://lattes.cnpq.br/3943323611794371',
            linkedin: 'https://www.linkedin.com/in/gleison-azevedo-504380353/',
            orcid: '',
            nome: 'Gleison Medeiros de Azevedo',
            pt: {
            desc: "Mestrando em Bioinformática pela Universidade Federal do Rio Grande do Norte (UFRN) e graduado em Biomedicina pela mesma instituição. Minha trajetória acadêmica é voltada para a análise de dados ômicos, com ênfase em Single Cell, RNA-seq, Metagenômica e Evolução de Sistemas Biológicos. Desde 2021, faço parte da equipe BioME, onde aplico abordagens computacionais para investigar padrões evolutivos e redes de interação proteica, contribuindo para uma compreensão mais profunda da complexidade molecular e dos mecanismos biológicos em larga escala.",
            },
            en: {
            desc: "Masters student in Bioinformatics at the Federal University of Rio Grande do Norte (UFRN) and a graduate in Biomedicine from the same institution. My academic journey is focused on omics data analysis, with an emphasis on Single Cell, RNA-seq, Metagenomics, and the Evolution of Biological Systems. Since 2021, I have been part of the BioME team, where I apply computational approaches to investigate evolutionary patterns and protein interaction networks, contributing to a deeper understanding of molecular complexity and large-scale biological mechanisms.",
            },
        },
        {
            image: 'images/b7/julio.jpg',
            lattes: 'http://lattes.cnpq.br/9012323031302904',
            linkedin: 'https://www.linkedin.com/in/julio-csilva/',
            orcid: '',
            nome: 'Júlio César da Silva Filho',
            pt: {
            desc: "Formado em Tecnologia da Informação com ênfase em Bioinformática e Redes pela Universidade Federal do Rio Grande do Norte (UFRN-2018). Além da minha formação acadêmica, também possuo conhecimentos em eletrônica, tendo obtido formação técnica em Tecnologia da Informação com especialização em Eletrônica pelo Instituto Metrópole Digital (IMD-2021). Minha trajetória profissional inclui experiência nas áreas de Eletrônica, Programação, Bioinformática, DevOps, infraestrutura e redes, adquirida durante meu tempo de atuação no Biome. Lá, pude aprimorar minhas habilidades em gerenciamento de sistemas, automação de processos, monitoramento de serviços e implementação de soluções de infraestrutura robustas e escaláveis.",
            },
            en: {
            desc: "Graduated in Information Technology with an emphasis on Bioinformatics and Networks from the Federal University of Rio Grande do Norte (UFRN – 2018). In addition to my academic background, I also have knowledge in electronics, having completed a technical degree in Information Technology with a specialization in Electronics at the Digital Metropolis Institute (IMD – 2021). My professional background includes experience in Electronics, Programming, Bioinformatics, DevOps, Infrastructure, and Networking, acquired during my time at BioME. There, I was able to enhance my skills in system management, process automation, service monitoring, and the implementation of robust and scalable infrastructure solutions.",
            },
        },
        {
            image: 'images/b7/savio.png',
            lattes: 'http://lattes.cnpq.br/8492497146775504',
            linkedin: '',
            orcid: 'https://orcid.org/0000-0002-3812-5541',
            nome: 'Sávio Lucas de Matos Guerreiro',
            pt: {
            desc: "Graduado em Engenharia de Pesca, mestrado em Aquicultura e Recursos Aquáticos Tropicais realizados na Universidade Federal Rural da Amazônia (2017 e 2019, respectivamente), Doutorado em Genética e Biologia Molecular na Universidade Federal do Pará(2019-2023), Pós- Doutorado em andamento na Universidade Federal Rural da Amazônia (2024-2026). Atualmente é servidor efetivo da Secretaria Estadual de Meio Ambiente e Sustentabilidade(SEMAS/PA), professor substituto no curso de Engenharia de Pesca da Universidade Federal Rural da Amazônia, pesquisador voluntário- Laboratório de Genética Aplicada - UFRA e no Laboratório de Genética Humana e Médica na Universidade Federal do Pará, desenvolvendo pesquisa de conservação de organismos aquáticos utilizando ferramentas genômicas para a criação de marcadores genéticos utilizados na fiscalização ambiental, coopera na descrição de novas espécies de microparasitos por meio de biologia molecular. Além disso, atua na linha de pesquisa de sistemas integrados de carcinicultura e piscicultura na aquaponia. Tem experiência na área de Recursos Pesqueiros e Engenharia de Pesca, com ênfase em biologia molecular, genética e genômica de populações de peixes nativos, identificação de microparasitos de peixes, estudos com Sequenciamento de Nova Geração (Illumina e PacBio), habilidades em bioinformática, expertise com larvicultura de espécies nativas e exóticas, sistemas integrados de aquaponia.",
            },
            en: {
            desc: "Graduated in Fisheries Engineering, with a Master's degree in Aquaculture and Tropical Aquatic Resources from the Federal Rural University of the Amazon (UFRA) in 2017 and 2019, respectively. He completed a Ph.D. in Genetics and Molecular Biology at the Federal University of Pará (UFPA) from 2019 to 2023 and is currently pursuing a Postdoctoral Fellowship at UFRA (2024–2026). Currently, he is a permanent employee of the State Secretariat for the Environment and Sustainability (SEMAS/PA), a substitute professor in the Fisheries Engineering program at UFRA, and a volunteer researcher at both the Laboratory of Applied Genetics at UFRA and the Laboratory of Human and Medical Genetics at UFPA. His research focuses on the conservation of aquatic organisms using genomic tools to develop genetic markers for environmental monitoring, as well as the molecular identification of new microparasite species. In addition, he conducts research on integrated systems for shrimp and fish farming in aquaponics. He has experience in Fisheries Resources and Fisheries Engineering, with an emphasis on molecular biology, genetics and genomics of native fish populations, identification of fish microparasites, and studies involving Next-Generation Sequencing (Illumina and PacBio). He also has skills in bioinformatics, expertise in the larviculture of native and exotic species, and integrated aquaponics systems.",
            },
        },
        {
            image: 'images/b7/daniel.png',
            lattes: 'http://lattes.cnpq.br/1320517156166163',
            linkedin: 'https://www.linkedin.com/in/daniel-h-502b62b5/',
            orcid: '',
            nome: 'Daniel Henrique Ferreira Gomes',
            pt: {
            desc: "Possui ensino-fundamental-primeiro-grau pelo Colégio e Curso Gênesis (2012) . Fez o curso técnico médio integrado de informatica no IFRN - Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte - Campus Parnamirim (2016). É bacharel em tecnologia da Informação pela Universidade Federal do Rio Grande do Norte. Atualmente faz a graduação em Ciência da Computação na Universidade Federal do Rio Grande do Norte. Fez curso de inglês por dois anos na atual idiomas. Participou do projeto de pesquisa: Nível de atividade física dos alunos do ensino médio integrado do IFRN Campus Parnamirim e a influência no rendimento escolar. Participou também da pesquisa: Desenvolvimento de softwares aplicados à bioinformática: formação de recursos humanos para pesquisa e mercado de trabalho. Atualmente faz parte do grupo PET(Programa de Educação Tutorial) pela UFRN.",
            },
            en: {
            desc: "Completed elementary education at Colégio e Curso Gênesis (2012). Completed the integrated technical high school course in Informatics at IFRN – Federal Institute of Education, Science and Technology of Rio Grande do Norte – Parnamirim Campus (2016). Holds a Bachelor's degree in Information Technology from the Federal University of Rio Grande do Norte (UFRN). Currently pursuing a degree in Computer Science at UFRN. Studied English for two years at Atual Idiomas. Participated in the research project: Physical activity level of integrated high school students at IFRN Parnamirim Campus and its influence on academic performance. Also took part in the research project: Development of software applied to bioinformatics: training human resources for research and the job market. Currently a member of the PET (Tutorial Education Program) group at UFRN.",
            },
        },
        {
            image: 'images/b7/jorge.jpeg',
            lattes: 'http://lattes.cnpq.br/8058577659019910',
            linkedin: '',
            orcid: 'https://orcid.org/0000-0003-2347-042X',
            nome: 'Jorge Estefano Santana de Souza',
            pt: {
            desc: "Possui graduação em Ciência da Computação pela Universidade de Santo Amaro (2001). Doutorado em Bioinformática pela Universidade de São Paulo (2008). Atuou na área de Bioinformática no Ludwig Institute for Cancer Research (2001-2012). Atualmente é professor adjunto no Instituto Metrópole Digital (IMD/UFRN), Tem experiência na área de Genética com ênfase em Bioinformática e Genômica, atuando principalmente nos seguintes temas: Câncer, Biologia Molecular, Genômica e Transcriptômica.",
            },
            en: {
            desc: "Holds a Bachelor's degree in Computer Science from the University of Santo Amaro (2001) and a Ph.D. in Bioinformatics from the University of São Paulo (2008). Worked in the field of Bioinformatics at the Ludwig Institute for Cancer Research (2001–2012). Currently, he is an Associate Professor at the Digital Metropolis Institute (IMD/UFRN). Has experience in Genetics with an emphasis on Bioinformatics and Genomics, mainly focusing on the following topics: Cancer, Molecular Biology, Genomics, and Transcriptomics.",
            },
        },
        {
            image: 'images/b7/rodrigo.png',
            lattes: 'http://lattes.cnpq.br/4065178015615979',
            linkedin: 'https://www.linkedin.com/in/rodrigo-dalmolin-ab709b81/',
            orcid: 'https://orcid.org/0000-0002-1688-6155',
            nome: 'Rodrigo Juliani Siqueira Dalmolin',
            pt: {
            desc: "Possui graduação em Ciências Biológicas com ênfase em Biologia Molecular, Celular e Funcional (2005), Mestrado em Ciências Biológicas: Bioquímica (2008) e Doutorado em Ciências Biológicas: Bioquímica (2012) pela Universidade Federal do Rio Grande do Sul. Possui experiência em Estresse Oxidativo, Bioinformática, Biologia de Sistemas e Evolução de Sistemas Bioquímicos. É Professor Associado do Departamento de Bioquímica da Universidade Federal do Rio Grande do Norte. Desenvolve suas atividades de pesquisa junto ao Bioinformatics Multidisciplinary Environment (BioME - IMD, UFRN). É o atual coordenador do Programa de Pós-graduação em Bioinformática da UFRN e membro permanente do Programa de Pós-graduação em Bioinformática da mesma Universidade. É membro da diretoria da Sociedade Brasileira de Genética e editor da área de bioinformática da Editora da Sociedade Brasileira de Bioinformática. É membro do conselho científico e tecnológico do Núcleo de Processamento de Alta Desempenho da UFRN. Seus projetos de pesquisa atuais envolvem a avaliação de redes biológicas, com ênfase em redes de interação proteína-proteína e redes regulatórias, evolução de sistemas bioquímicos e produção de ferramentas de bioinformática para análise de sistemas biológicos.",
            },
            en: {
            desc: "Holds a Bachelor's degree in Biological Sciences with an emphasis on Molecular, Cellular, and Functional Biology (2005), a Master's degree in Biological Sciences: Biochemistry (2008), and a Ph.D. in Biological Sciences: Biochemistry (2012) from the Federal University of Rio Grande do Sul (UFRGS). Has experience in Oxidative Stress, Bioinformatics, Systems Biology, and the Evolution of Biochemical Systems. He is an Associate Professor in the Department of Biochemistry at the Federal University of Rio Grande do Norte (UFRN). Develops his research activities at the Bioinformatics Multidisciplinary Environment (BioME – IMD, UFRN). He is the current coordinator of the Graduate Program in Bioinformatics at UFRN and a permanent member of the same program. He serves on the board of the Brazilian Society of Genetics and is the Bioinformatics area editor for the Brazilian Society of Bioinformatics' publishing house. He is also a member of the Scientific and Technological Council of UFRN’s High-Performance Computing Center. His current research projects focus on the analysis of biological networks, with an emphasis on protein–protein interaction and regulatory networks, the evolution of biochemical systems, and the development of bioinformatics tools for the analysis of biological systems.",
            },
        },
        {
            image: 'images/b7/iruziky.png',
            lattes: 'http://lattes.cnpq.br/5304082867680074',
            linkedin: 'https://www.linkedin.com/in/iruziky/',
            orcid: '',
            nome: 'Iruziky Araújo de Medeiros',
            pt: {
            desc: "Possui ensino-fundamental-primeiro-graupela Escola Estadual Monsenhor Walfredo Gurgel(2018) e ensino-medio-segundo-grau pelo Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte(2023).",
            },
            en: {
            desc: "Completed elementary school at Escola Estadual Monsenhor Walfredo Gurgel (2018) and high school at the Federal Institute of Education, Science and Technology of Rio Grande do Norte (2023).",
            },
        },
    ];

    const visibleCards = pesquisadores.slice(startIndex, startIndex + 4);

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(prev - 1, 0));
    };
        
    const handleNext = () => {
        if (startIndex + 4 < pesquisadores.length) {
            setStartIndex((prev) => prev + 1);
        }
    };
    

    return (
        <Box as="section" p="5rem" display="flex" flexDirection="column" gap="2rem">
        <Heading color="#f7f7f7" fontSize="3rem" fontWeight="bold" textAlign="center" 
        p="2rem 0 3rem 0"
        >
            
            {texts[language].titulo}
        </Heading>

        <HStack spacing="5rem" alignItems="center" justifyContent="center" p={"0 0 10rem 0"}>
            <IconButton
            icon={<ArrowBackIcon />}
            onClick={handlePrev}
            isDisabled={startIndex === 0}
            aria-label="Anterior"
            />
            {visibleCards.map((p, index) => (
                <B7Card
                key={index}
                image={p.image}
                titulo={p.nome}
                desc={p[language].desc}
                lattes={p.lattes}
                linkedin={p.linkedin}
                orcid={p.orcid}
                texts={texts[language]}
                />
            ))}
            <IconButton
            icon={<ArrowForwardIcon />}
            onClick={handleNext}
            isDisabled={startIndex + 4 >= pesquisadores.length}
            aria-label="Próximo"
            />
        </HStack>
        </Box>
    );
};

export default PesquisadoresB7;
