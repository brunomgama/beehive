export const getCardGradient = (type: string) => {
    const gradients = {
        CURRENT: 'from-red-300 to-orange-400',
        SAVINGS: 'from-green-300 to-blue-400',
        INVESTMENTS: 'from-blue-300 to-indigo-400',
        CLOSED: 'from-gray-500 to-slate-600',
    }
    return gradients[type as keyof typeof gradients] || 'from-purple-500 to-pink-600'
}