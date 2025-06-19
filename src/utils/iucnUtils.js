/**
 * Retorna uma string de CSS linear-gradient com base no status da IUCN.
 * @param {string} status - O código do status da IUCN (ex: 'LC', 'VU', 'CR').
 * @returns {string} Uma string CSS para a propriedade 'background'.
 */
export const getIucnGradient = (status) => {
    const gradients = {
        // Pouca Informação (Cinza Neutro)
        'NE': 'linear-gradient(to right, #cbd5e1, #94a3b8)',
        'DD': 'linear-gradient(to right, #cbd5e1, #94a3b8)',

        // Início da escala de ameaça (Verde Vibrante)
        'LC': 'linear-gradient(to right, #86efac, #16a34a)',

        // Níveis intermediários (Transição de Amarelo para Vermelho)
        'NT': 'linear-gradient(to right, #fde047, #f59e0b)',
        'VU': 'linear-gradient(to right, #fb923c, #f97316)',
        'EN': 'linear-gradient(to right, #f87171, #ef4444)',

        // Nível máximo de ameaça (Vermelho Intenso)
        'CR': 'linear-gradient(to right, #dc2626, #b91c1c)',

        // Extinção (Cinza Escuro / Quase Preto para indicar finalidade)
        'EW': 'linear-gradient(to right, #3f3f46, #18181b)',
        'EX': 'linear-gradient(to right, #3f3f46, #18181b)',
    };
    return gradients[status] || 'linear-gradient(to right, #a0aec0, #718096)';
};