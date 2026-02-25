import { motion } from 'motion/react'
import { Search, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { animationCategories, getAnimationsByCategory, searchAnimations, getAnimationComplexity } from '../data/animations'

function AnimationLibrary({ isOpen, onClose, onSelectAnimation }) {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const getFilteredAnimations = () => {
        if (searchQuery.trim()) {
            return searchAnimations(searchQuery)
        }
        return getAnimationsByCategory(selectedCategory)
    }

    const filteredAnimations = getFilteredAnimations()

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-6xl w-full max-h-[85vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
                >
                    <X size={18} />
                </button>

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={24} />
                        <h2 className="text-2xl font-bold">Animation Library</h2>
                    </div>
                    <p className="text-zinc-400 text-sm">
                        Add professional animations to bring your website to life
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search animations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition"
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    {animationCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.id)
                                setSearchQuery('')
                            }}
                            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition flex items-center gap-2 ${
                                selectedCategory === cat.id
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>

                {/* Animations Grid */}
                {filteredAnimations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAnimations.map((animation) => {
                            const complexity = getAnimationComplexity(animation.id)
                            return (
                                <motion.div
                                    key={animation.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => onSelectAnimation(animation)}
                                    className="cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition group"
                                >
                                    <div className="h-40 overflow-hidden bg-black relative">
                                        <img
                                            src={animation.preview}
                                            alt={animation.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                complexity.color === 'green' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                complexity.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                                {complexity.level}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold mb-1">{animation.name}</h3>
                                        <p className="text-xs text-zinc-400 line-clamp-2">
                                            {animation.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Sparkles size={48} className="mx-auto mb-4 text-zinc-600" />
                        <p className="text-zinc-400">No animations found</p>
                        <p className="text-sm text-zinc-500 mt-2">
                            Try a different search term or category
                        </p>
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs text-blue-300">
                            💡 <strong>Tip:</strong> Click any animation to load its prompt. AI will add the animation code while preserving your existing design.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500"></span>
                            <span>Simple - Easy to implement</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500"></span>
                            <span>Medium - Moderate complexity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500"></span>
                            <span>Advanced - Complex effects</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default AnimationLibrary
