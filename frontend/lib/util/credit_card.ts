export const getCardGradient = (type: string) => {
    const gradients = {
        CURRENT: 'from-red-400 via-orange-400 to-pink-400',
        SAVINGS: 'from-emerald-400 via-teal-400 to-cyan-400',
        INVESTMENTS: 'from-blue-400 via-indigo-400 to-purple-400',
        CLOSED: 'from-gray-400 to-slate-500',
    }
    return gradients[type as keyof typeof gradients] || 'from-purple-500 via-pink-500 to-rose-500'
}