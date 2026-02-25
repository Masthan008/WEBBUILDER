import { motion } from 'motion/react'
import { Grid3x3, Search, X } from 'lucide-react'
import { useState } from 'react'
import { componentCategories, getComponentsByCategory, searchComponents } from '../data/components'

function ComponentLibrary({ isOpen, onClose, onSelectComponent }) {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const getFilteredComponents = () => {
        if (searchQuery.trim()) {
            return searchComponents(searchQuery)
        }
        return getComponentsByCategory(selectedCategory)
    }

    const filteredComponents = getFilteredComponents()

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
                        <Grid3x3 size={24} />
                        <h2 className="text-2xl font-bold">Component Library</h2>
                    </div>
                    <p className="text-zinc-400 text-sm">
                        Add pre-built components to your website with AI
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition"
                        />
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    {componentCategories.map((cat) => (
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

                {/* Components Grid */}
                {filteredComponents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredComponents.map((component) => (
                            <motion.div
                                key={component.id}
                                whileHover={{ y: -4 }}
                                onClick={() => onSelectComponent(component)}
                                className="cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition group"
                            >
                                <div className="h-40 overflow-hidden bg-black">
                                    <img
                                        src={component.thumbnail}
                                        alt={component.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold mb-1">{component.name}</h3>
                                    <p className="text-xs text-zinc-400 line-clamp-2">
                                        {component.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Grid3x3 size={48} className="mx-auto mb-4 text-zinc-600" />
                        <p className="text-zinc-400">No components found</p>
                        <p className="text-sm text-zinc-500 mt-2">
                            Try a different search term or category
                        </p>
                    </div>
                )}

                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-blue-300">
                        💡 <strong>Tip:</strong> Click any component to load its prompt. AI will add it to your website while preserving existing content.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ComponentLibrary
