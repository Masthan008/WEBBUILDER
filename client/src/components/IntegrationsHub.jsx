import { motion } from 'motion/react'
import { Search, Plug, X, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { integrationCategories, getIntegrationsByCategory, searchIntegrations, getDifficultyColor } from '../data/integrations'

function IntegrationsHub({ isOpen, onClose, onSelectIntegration }) {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIntegration, setSelectedIntegration] = useState(null)

    const getFilteredIntegrations = () => {
        if (searchQuery.trim()) {
            return searchIntegrations(searchQuery)
        }
        return getIntegrationsByCategory(selectedCategory)
    }

    const filteredIntegrations = getFilteredIntegrations()

    const handleSelectIntegration = (integration) => {
        setSelectedIntegration(integration)
    }

    const handleAddIntegration = () => {
        if (selectedIntegration) {
            onSelectIntegration(selectedIntegration)
            setSelectedIntegration(null)
        }
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={() => {
                setSelectedIntegration(null)
                onClose()
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-6xl w-full max-h-[85vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => {
                        setSelectedIntegration(null)
                        onClose()
                    }}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
                >
                    <X size={18} />
                </button>

                {!selectedIntegration ? (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Plug size={24} />
                                <h2 className="text-2xl font-bold">Integrations Hub</h2>
                            </div>
                            <p className="text-zinc-400 text-sm">
                                Connect external services to enhance your website
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search integrations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition"
                                />
                            </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                            {integrationCategories.map((cat) => (
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

                        {/* Integrations Grid */}
                        {filteredIntegrations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredIntegrations.map((integration) => {
                                    const difficultyColor = getDifficultyColor(integration.difficulty)
                                    return (
                                        <motion.div
                                            key={integration.id}
                                            whileHover={{ y: -4 }}
                                            onClick={() => handleSelectIntegration(integration)}
                                            className="cursor-pointer rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition group"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                                        <Plug size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold mb-1">{integration.name}</h3>
                                                        <p className="text-xs text-zinc-400 line-clamp-2">
                                                            {integration.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className={`px-2 py-1 rounded-full ${
                                                        difficultyColor === 'green' ? 'bg-green-500/20 text-green-300' :
                                                        difficultyColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-red-500/20 text-red-300'
                                                    }`}>
                                                        {integration.difficulty}
                                                    </span>
                                                    <span className="text-zinc-500">⏱️ {integration.setupTime}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Plug size={48} className="mx-auto mb-4 text-zinc-600" />
                                <p className="text-zinc-400">No integrations found</p>
                                <p className="text-sm text-zinc-500 mt-2">
                                    Try a different search term or category
                                </p>
                            </div>
                        )}

                        <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-300">
                                💡 <strong>Tip:</strong> Click any integration to see setup instructions. AI will add the integration code to your website.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Integration Details */}
                        <div className="mb-6">
                            <button
                                onClick={() => setSelectedIntegration(null)}
                                className="text-sm text-zinc-400 hover:text-white mb-4 flex items-center gap-2"
                            >
                                ← Back to integrations
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Plug size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedIntegration.name}</h2>
                                    <p className="text-zinc-400 text-sm">{selectedIntegration.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Setup Instructions */}
                        <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                📋 Setup Instructions
                            </h3>
                            <ol className="space-y-3">
                                {selectedIntegration.setupInstructions.map((instruction, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-zinc-300">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                            {index + 1}
                                        </span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Requirements */}
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs text-zinc-400 mb-1">Difficulty</div>
                                <div className={`text-sm font-medium capitalize ${
                                    getDifficultyColor(selectedIntegration.difficulty) === 'green' ? 'text-green-400' :
                                    getDifficultyColor(selectedIntegration.difficulty) === 'yellow' ? 'text-yellow-400' :
                                    'text-red-400'
                                }`}>
                                    {selectedIntegration.difficulty}
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs text-zinc-400 mb-1">Setup Time</div>
                                <div className="text-sm font-medium">{selectedIntegration.setupTime}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs text-zinc-400 mb-1">API Key</div>
                                <div className="text-sm font-medium">
                                    {selectedIntegration.requiresApiKey ? 'Required' : 'Not needed'}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAddIntegration}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition"
                        >
                            Add {selectedIntegration.name} to Website
                        </button>

                        <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-xs text-yellow-300">
                                ⚠️ <strong>Note:</strong> You'll need to provide your {selectedIntegration.apiKeyLabel || 'API credentials'} when AI adds this integration.
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    )
}

export default IntegrationsHub
