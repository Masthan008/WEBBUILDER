import { ArrowLeft, ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "motion/react"
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
];

const CODE_SNIPPETS = [
    "<!DOCTYPE html>\n<html lang=\"en\">",
    "<head>\n  <meta charset=\"UTF-8\">",
    "<style>\n  body { margin: 0; }",
    ".container {\n  max-width: 1200px;",
    "<script>\n  document.addEventListener(",
    "const animate = () => {",
    "transition: all 0.3s ease;",
    "background: linear-gradient(",
];

const AI_MODELS = [
    { id: "openrouter", name: "OpenRouter", model: "DeepSeek Chat", recommended: true },
    { id: "gemini", name: "Google Gemini", model: "Gemini 2.5 Flash" },
    { id: "groq", name: "Groq", model: "Llama 3.3 70B" },
    { id: "nvidia", name: "NVIDIA DeepSeek", model: "DeepSeek v3.1 Terminus" }
]

function Generate() {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error,setError]=useState("")
    const [selectedModel, setSelectedModel] = useState("openrouter")
    const [showModelDropdown, setShowModelDropdown] = useState(false)
    const [codeSnippet, setCodeSnippet] = useState("")
    
    const handleGenerateWebsite = async () => {
        setLoading(true)
        setError("")
        
        try {
            const result = await axios.post(`${serverUrl}/api/website/generate`, { 
                prompt, 
                provider: selectedModel 
            }, { withCredentials: true })
            
            console.log('Generation successful:', result.data)
            setProgress(100)
            setLoading(false)
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setProgress(0)
            
            console.error('Generation error:', error)
            
            // Handle different error types
            if (error.response) {
                // Server responded with error status
                const status = error.response.status
                const message = error.response.data?.message || error.response.data
                
                if (status === 404) {
                    setError("API endpoint not found. Please check if the backend server is running correctly.")
                } else if (status === 401) {
                    setError("Authentication failed. Please log in again.")
                } else if (status === 400) {
                    setError(message || "Invalid request. Please check your input.")
                } else if (status === 500) {
                    setError(message || "Server error. Please try again or use a different AI model.")
                } else {
                    setError(message || `Error ${status}: Something went wrong`)
                }
            } else if (error.request) {
                // Request made but no response received
                setError("Cannot reach the server. Please check your internet connection and ensure the backend is running.")
            } else {
                // Something else happened
                setError(error.message || "An unexpected error occurred")
            }
        }
    }

    useEffect(() => {
        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            setCodeSnippet("")
            return
        }

        let value = 0
        let phase = 0
        let snippetIndex = 0

        const interval = setInterval(() => {
            const increment = value < 20
                ? Math.random() * 1.5
                : value < 60
                    ? Math.random() * 1.2
                    : Math.random() * 0.6;
            value += increment

            if (value >= 93) value = 93;

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length), PHASES.length - 1
            )

            // Update code snippet
            snippetIndex = Math.floor((value / 100) * CODE_SNIPPETS.length)
            if (snippetIndex < CODE_SNIPPETS.length) {
                setCodeSnippet(CODE_SNIPPETS[snippetIndex])
            }

            setProgress(Math.floor(value))
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    const selectedModelData = AI_MODELS.find(m => m.id === selectedModel)

    return (
        <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate("/")}><ArrowLeft size={16} /></button>
                        <h1 className='text-lg font-semibold'>Genweb<span className='text-zinc-400'>.ai</span></h1>
                    </div>

                </div>
            </div>

            <div className='max-w-6xl mx-auto px-6 py-16'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
                        Build Websites with
                        <span className='block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent'>Real AI Power</span>
                    </h1>
                    <p className='text-zinc-400 max-w-2xl mx-auto'>
                        This process may take several minutes.
                        genweb.ai focuses on quality, not shortcuts.
                    </p>

                </motion.div>
                
                {/* AI Model Selector */}
                <div className='mb-6'>
                    <label className='text-sm text-zinc-400 mb-2 block'>AI Model</label>
                    <div className='relative'>
                        <button
                            onClick={() => setShowModelDropdown(!showModelDropdown)}
                            className='w-full md:w-auto px-6 py-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-4 hover:border-white/20 transition'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='w-2 h-2 rounded-full bg-green-400'></div>
                                <div className='text-left'>
                                    <div className='text-sm font-medium'>{selectedModelData.name}</div>
                                    <div className='text-xs text-zinc-500'>{selectedModelData.model}</div>
                                </div>
                                {selectedModelData.recommended && (
                                    <span className='px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs'>Recommended</span>
                                )}
                            </div>
                            <ChevronDown size={16} className='text-zinc-400' />
                        </button>

                        <AnimatePresence>
                            {showModelDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className='absolute top-full mt-2 w-full md:w-96 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50'
                                >
                                    {AI_MODELS.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => {
                                                setSelectedModel(model.id)
                                                setShowModelDropdown(false)
                                            }}
                                            className={`w-full px-6 py-4 flex items-center gap-3 hover:bg-white/5 transition ${
                                                selectedModel === model.id ? 'bg-white/10' : ''
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${
                                                selectedModel === model.id ? 'bg-green-400' : 'bg-zinc-600'
                                            }`}></div>
                                            <div className='flex-1 text-left'>
                                                <div className='text-sm font-medium flex items-center gap-2'>
                                                    {model.name}
                                                    {model.recommended && (
                                                        <span className='px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs'>Recommended</span>
                                                    )}
                                                </div>
                                                <div className='text-xs text-zinc-500'>{model.model}</div>
                                            </div>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className='mb-14'>
                    <h1 className='text-xl font-semibold mb-2'>Describe your website</h1>
                    <div className='relative'>
                        <textarea
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            placeholder='Describe your website in detail...'
                            className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20'></textarea>
                    </div>
                    

                    {error && <p className='mt-4 text-sm text-red-400'>{error}</p>}

                </div>
                <div className='flex justify-center'>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleGenerateWebsite}
                        disabled={!prompt.trim() && loading}
                        className={`px-14 py-4 rounded-2xl font-semibold text-lg ${prompt.trim() && !loading
                            ? "bg-white text-black"
                            : "bg-white/20 text-zinc-400 cursor-not-allowed"
                            }`}
                    >
                        Generate Website
                    </motion.button>
                </div>


                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-xl mx-auto mt-12"
                    >
                        <div className='flex justify-between mb-2 text-xs text-zinc-400'>
                            <span >{PHASES[phaseIndex]}</span>
                            <span >{progress}%</span>
                        </div>

                        <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                            <motion.div
                                className="h-full bg-linear-to-r from-white to-zinc-300"
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                            />
                        </div>

                        {/* Code Processing Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-6 p-4 rounded-xl bg-black/60 border border-white/10'
                        >
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='flex gap-1.5'>
                                    <div className='w-3 h-3 rounded-full bg-red-500'></div>
                                    <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                                    <div className='w-3 h-3 rounded-full bg-green-500'></div>
                                </div>
                                <span className='text-xs text-zinc-500'>Generating code...</span>
                            </div>
                            <pre className='text-xs text-green-400 font-mono overflow-hidden'>
                                <motion.code
                                    key={codeSnippet}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {codeSnippet}
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className='inline-block w-2 h-4 bg-green-400 ml-1'
                                    />
                                </motion.code>
                            </pre>
                        </motion.div>

                        <div className='text-center text-xs text-zinc-400 mt-4'>
                            Estimated time remaining:{" "}
                            <span className="text-white font-medium">
                                ~8–12 minutes
                            </span>
                        </div>

                    </motion.div>
                )}


            </div>
        </div>
    )
}

export default Generate
