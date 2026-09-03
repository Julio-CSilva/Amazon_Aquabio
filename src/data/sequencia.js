/**
 * Um trecho REAL do mitogenoma semente do estudo.
 *
 * São as primeiras 720 bases de `SRR25740028_Pygocentrus_nattereri.fa` — a
 * amostra de *Pygocentrus nattereri*, a espécie cujo mitogenoma (NC_015840.1)
 * serviu de semente para todas as 100 montagens do NOVOPlasty.
 *
 * A faixa que percorre o topo do site poderia ser ACGT sorteado, e ninguém
 * notaria. Mas o site inteiro é sobre estes dados: usar a sequência de verdade
 * custa o mesmo e transforma um ornamento em uma amostra do objeto de estudo.
 * Começa em `trnF`, o primeiro gene da ordem consenso — é literalmente o começo
 * do genoma.
 *
 * Gerado a partir do FASTA. Para refazer, leia as primeiras 720 bases do
 * arquivo acima.
 */
export const SEQUENCIA_SEMENTE = "GCTAGTGTAGCTTAAACAAAGCATAACACTGAAGATGTTAAGATGAACCCTAGAAAGTTCCACGGGCACAAAGGCCTGGTCCTGACTTTACTATCAGCTTTAGCCCAACTTATACATGCAAGTATCCGCACCCCTGTGAGAATGCCCTCAATCCCCCGCCCGGGGACGAGGAGCTGGCATCAGGCGCAACATACCCCGCCCAAGACGCCTTGCTTACGCCACACCCCCAAGGGAATTCAGCAGTAATAAACATTAAGCCATAAGTGAAAACTTGACTTAGCAAGGGCTAAGAGGGTCGGTAAAACTCGTGCCAGCCACCGCGGTTATACGAGAGACTCCAGTTGATAGCTACGGCGTAAAGAGTGGTTTGGGGCCCCACCCAAAATAAAGCCAAAGACCTCCCAAGCCGTCAAACGCACCCCGGAGGCACGAAGTCCTAACGCGAAAGCAACTTTACCTCCCCCGACGCCACGAAAGCTAAGAAACAAACTGGGATTAGATACCCCACTATGCTTAGCCCTAAACTCAGATGTGAGAACATACAAATACATCCGCCAGGGTACTACAAGCGCTAGCTTAAAACCCAAAGGACTTGACGGTGTCTCAGACCCACCTAGAGGAGCCTGTTCTAGAACCGATAATCCCCGTTAAACCTCACCATCCCTTGTCTTTTCCCGCCTATATACCGCCGTCGCAAGCTTACCCTGTGAAGGGTTTACA";

/** Cor de cada base, para a faixa não ser um bloco cinza de texto. */
export const COR_DA_BASE = {
    A: "var(--color-river-300)",
    C: "var(--color-scale-300)",
    G: "var(--color-discus-300)",
    T: "var(--glow)",
};
