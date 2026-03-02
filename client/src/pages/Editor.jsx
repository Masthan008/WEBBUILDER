import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { ArrowLeft, Check, CheckCircle, Copy, Download, Github, Grid3x3, Info, MessageSquare, Monitor, Palette, Pencil, Plug, Redo, Rocket, RotateCcw, Send, Smartphone, Sparkles, Tablet, Undo, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { themes, applyThemeToCode } from '../data/themes'
import ComponentLibrary from '../components/ComponentLibrary'
import AnimationLibrary from '../components/AnimationLibrary'
import IntegrationsHub from '../components/IntegrationsHub'

function WebsiteEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showChat, setShowChat] = useState(false)
    const [editingTitle, setEditingTitle] = useState(false)
    const [title, setTitle] = useState("")
    const [codeCopied, setCodeCopied] = useState(false)
    const [showThemes, setShowThemes] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [previewMode, setPreviewMode] = useState('desktop')
    const [previewOrientation, setPreviewOrientation] = useState('portrait')
    const [codeHistory, setCodeHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [showGithubExport, setShowGithubExport] = useState(false)
    const [showComponents, setShowComponents] = useState(false)
    const [showAnimations, setShowAnimations] = useState(false)
    const [showIntegrations, setShowIntegrations] = useState(false)
    
    const thinkingSteps = [
        "Understanding your request…",
        "Planning layout changes…",
        "Improving responsiveness…",
        "Applying animations…",
        "Finalizing update…",
    ]

    const handleUpdate = async () => {
        if (!prompt) return
        setUpdateLoading(true)
        const text = prompt
        setPrompt("")
        setMessages((m) => [...m, { role: "user", content: prompt }])
        try {
            const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true })
            setUpdateLoading(false)
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            addToHistory(result.data.code)
            setCode(result.data.code)
            setWebsite(prev => ({ ...prev, updatedAt: new Date().toISOString() }))
            toast.success('Website updated successfully!')
        } catch (error) {
            setUpdateLoading(false)
            console.log(error)
            toast.error('Failed to update website')
        }
    }

    const handleDeploy = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            toast.success('Website deployed successfully!')
        } catch (error) {
            console.log(error)
            toast.error('Failed to deploy website')
        }
    }

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(code)
        setCodeCopied(true)
        toast.success('Code copied to clipboard!')
        setTimeout(() => setCodeCopied(false), 2000)
    }

    const handleUpdateTitle = async () => {
        if (!title.trim() || title === website.title) {
            setEditingTitle(false)
            setTitle(website.title)
            return
        }
        try {
            await axios.patch(`${serverUrl}/api/website/update-title/${id}`, { title: title.trim() }, { withCredentials: true })
            setWebsite(prev => ({ ...prev, title: title.trim() }))
            setEditingTitle(false)
            toast.success('Title updated!')
        } catch (error) {
            console.log(error)
            toast.error('Failed to update title')
            setTitle(website.title)
            setEditingTitle(false)
        }
    }

    const handleApplyTheme = (theme) => {
        const themedCode = applyThemeToCode(code, theme)
        setCode(themedCode)
        setSelectedTheme(theme)
        setShowThemes(false)
        toast.success(`${theme.name} theme applied!`)
    }

    const getPreviewDimensions = () => {
        const dimensions = {
            desktop: { width: '100%', height: '100%' },
            tablet: previewOrientation === 'portrait' ? { width: '768px', height: '1024px' } : { width: '1024px', height: '768px' },
            mobile: previewOrientation === 'portrait' ? { width: '375px', height: '667px' } : { width: '667px', height: '375px' }
        }
        return dimensions[previewMode]
    }

    const toggleOrientation = () => {
        if (previewMode === 'desktop') return
        setPreviewOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')
    }

    const addToHistory = (newCode) => {
        const newHistory = codeHistory.slice(0, historyIndex + 1)
        newHistory.push(newCode)
        if (newHistory.length > 20) {
            newHistory.shift()
        } else {
            setHistoryIndex(prev => prev + 1)
        }
        setCodeHistory(newHistory)
    }

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setCode(codeHistory[newIndex])
            toast.success('Undone')
        }
    }

    const handleRedo = () => {
        if (historyIndex < codeHistory.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setCode(codeHistory[newIndex])
            toast.success('Redone')
        }
    }

    const canUndo = historyIndex > 0
    const canRedo = historyIndex < codeHistory.length - 1

    const handleGithubExport = () => {
        setShowGithubExport(true)
    }

    const generateGithubFiles = () => {
        const repoName = website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
        const readme = `# ${website.title}\n\nGenerated with StackStudio - AI Website Builder\n\n## Quick Start\n\n1. Clone this repository\n2. Open \`index.html\` in your browser\n3. That's it! No build process needed.\n\n## Deploy to GitHub Pages\n\n1. Go to your repository settings\n2. Navigate to "Pages" section\n3. Select "main" branch as source\n4. Click "Save"\n5. Your site will be live at: \`https://[username].github.io/${repoName}\`\n\n---\n\nMade with StackStudio`
        const gitignore = `.DS_Store\nThumbs.db\n*.log\nnode_modules/\n.env`
        return { 'index.html': code, 'README.md': readme, '.gitignore': gitignore }
    }

    const copyGithubCommands = () => {
        const repoName = website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
        const commands = `git init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/${repoName}.git\ngit push -u origin main`
        navigator.clipboard.writeText(commands)
        toast.success('Commands copied to clipboard!')
    }

    const handleAddComponent = (component) => {
        setShowComponents(false)
        setPrompt(component.prompt)
        setShowChat(true)
        toast.success(`${component.name} component loaded!`)
    }

    const handleAddAnimation = (animation) => {
        setShowAnimations(false)
        setPrompt(animation.prompt)
        setShowChat(true)
        toast.success(`${animation.name} animation loaded!`)
    }

    const handleAddIntegration = (integration) => {
        setShowIntegrations(false)
        setPrompt(integration.prompt)
        setShowChat(true)
        toast.success(`${integration.name} integration loaded!`)
    }

    useEffect(() => {
        if (!updateLoading) return;
        const i = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)
        return () => clearInterval(i)
    }, [updateLoading])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
                setTitle(result.data.title)
                setCodeHistory([result.data.latestCode])
                setHistoryIndex(0)
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                handleUndo()
            }
            if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
                e.preventDefault()
                handleRedo()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [historyIndex, codeHistory])

    if (error) {
        return <div className='h-screen flex items-center justify-center bg-black text-red-400'>{error}</div>
    }
    if (!website) {
        return <div className='h-screen flex items-center justify-center bg-black text-white'>Loading...</div>
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white'>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Top Header Bar */}
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='sticky top-0 z-40 backdrop-blur-2xl bg-black/40 border-b border-white/10'>
                <div className='h-16 px-6 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/dashboard')} className='p-2 hover:bg-white/10 rounded-xl transition' title='Back to Dashboard'>
                            <ArrowLeft size={18} />
                        </motion.button>
                        {editingTitle ? (
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={handleUpdateTitle} onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateTitle(); if (e.key === 'Escape') { setEditingTitle(false); setTitle(website.title) } }} autoFocus className='font-semibold bg-white/5 border border-white/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50' />
                        ) : (
                            <div className='flex items-center gap-2'>
                                <span className='font-semibold text-lg'>{website.title}</span>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingTitle(true)} className='p-1.5 hover:bg-white/10 rounded-lg transition' title='Edit title'><Pencil size={14} /></motion.button>
                            </div>
                        )}
                        {website.updatedAt && <span className='text-xs text-zinc-500 hidden md:block'>Saved {formatDistanceToNow(new Date(website.updatedAt), { addSuffix: true })}</span>}
                    </div>

                    <div className='flex items-center gap-2'>
                        <div className='hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/5 border border-white/10'>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleUndo} disabled={!canUndo} className={`p-1.5 rounded-lg transition ${canUndo ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`} title="Undo (Ctrl+Z)"><Undo size={16} /></motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleRedo} disabled={!canRedo} className={`p-1.5 rounded-lg transition ${canRedo ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`} title="Redo (Ctrl+Y)"><Redo size={16} /></motion.button>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={() => setShowThemes(true)} title="Themes"><Palette size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={() => setShowComponents(true)} title="Components"><Grid3x3 size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={() => setShowAnimations(true)} title="Animations"><Sparkles size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={() => setShowIntegrations(true)} title="Integrations"><Plug size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={handleCopyCode} title="Copy Code">{codeCopied ? <Check size={18} className='text-green-500' /> : <Copy size={18} />}</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={() => { const blob = new Blob([code], { type: 'text/html' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${website.title || 'website'}.html`; a.click(); URL.revokeObjectURL(url); toast.success('Code downloaded!') }} title="Download"><Download size={18} /></motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='p-2.5 hover:bg-white/10 rounded-xl transition' onClick={handleGithubExport} title="Export to GitHub"><Github size={18} /></motion.button>
                        {website.deployed ? "" : <motion.button whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)" }} whileTap={{ scale: 0.95 }} className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold shadow-lg shadow-indigo-500/25' onClick={handleDeploy}><Rocket size={16} /> Deploy</motion.button>}
                    </div>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className='relative flex flex-col lg:flex-row h-[calc(100vh-4rem)]'>
                {/* Preview Area */}
                <div className='flex-1 flex flex-col'>
                    {/* Preview Controls */}
                    <div className='h-12 px-6 flex items-center justify-between border-b border-white/10 bg-black/20'>
                        <div className='flex items-center gap-3'>
                            <span className='text-sm text-zinc-400'>Preview</span>
                            <div className='flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10'>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded transition ${previewMode === 'desktop' ? 'bg-white/20' : 'hover:bg-white/10'}`} title="Desktop"><Monitor size={14} /></motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded transition ${previewMode === 'tablet' ? 'bg-white/20' : 'hover:bg-white/10'}`} title="Tablet"><Tablet size={14} /></motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded transition ${previewMode === 'mobile' ? 'bg-white/20' : 'hover:bg-white/10'}`} title="Mobile"><Smartphone size={14} /></motion.button>
                                {previewMode !== 'desktop' && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleOrientation} className='p-1.5 rounded hover:bg-white/10 transition ml-1 border-l border-white/10' title='Rotate'><RotateCcw size={14} /></motion.button>}
                            </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${showChat ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`} onClick={() => setShowChat(!showChat)} title='Toggle AI Chat'><MessageSquare size={16} /><span className='text-sm font-medium'>AI Chat</span></motion.button>
                    </div>
                    {/* Preview */}
                    <div className='flex-1 flex items-center justify-center overflow-auto p-6 bg-zinc-900/50'>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className='transition-all duration-300 bg-white rounded-xl overflow-hidden' style={{ width: getPreviewDimensions().width, height: getPreviewDimensions().height, maxWidth: '100%', maxHeight: '100%', boxShadow: previewMode !== 'desktop' ? '0 20px 60px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.3)' }}>
                            <iframe ref={iframeRef} sandbox='allow-scripts allow-same-origin allow-forms' className='w-full h-full' />
                        </motion.div>
                    </div>
                </div>

                {/* AI Chat Panel */}
                <AnimatePresence>
                    {showChat && (
                        <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className='absolute lg:relative right-0 top-0 bottom-0 w-full lg:w-[450px] flex flex-col bg-gradient-to-br from-zinc-900/95 to-black/95 backdrop-blur-xl border-l border-white/10 z-30'>
                            <div className='h-12 px-6 flex items-center justify-between border-b border-white/10 bg-black/30'>
                                <div className='flex items-center gap-2'><Sparkles size={16} className='text-indigo-400' /><span className='text-sm font-semibold'>AI Assistant</span></div>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowChat(false)} className='p-1.5 hover:bg-white/10 rounded-lg transition'><X size={16} /></motion.button>
                            </div>
                            <div className='flex-1 overflow-y-auto px-6 py-6 space-y-4'>
                                {messages.length === 0 && (
                                    <div className='text-center py-12'>
                                        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4'><Sparkles size={32} className='text-indigo-400' /></div>
                                        <h3 className='text-lg font-semibold mb-2'>AI-Powered Editing</h3>
                                        <p className='text-sm text-zinc-400 max-w-xs mx-auto'>Describe the changes you want, and I'll update your website instantly</p>
                                    </div>
                                )}
                                {messages.map((m, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-white/5 border border-white/10 text-zinc-200"}`}>{m.content}</div>
                                    </motion.div>
                                ))}
                                {updateLoading && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='max-w-[85%] mr-auto'>
                                        <div className='px-4 py-3 rounded-2xl text-sm bg-white/5 border border-white/10 text-zinc-400 italic flex items-center gap-2'>
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className='w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full' />
                                            {thinkingSteps[thinkingIndex]}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <div className='p-4 border-t border-white/10 bg-black/30'>
                                <div className='flex gap-2'>
                                    <input placeholder='Describe your changes...' className='flex-1 resize-none rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition placeholder:text-zinc-500' onChange={(e) => setPrompt(e.target.value)} value={prompt} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUpdate() } }} disabled={updateLoading} />
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed' disabled={updateLoading || !prompt.trim()} onClick={handleUpdate}><Send size={16} /></motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Theme Picker Modal */}
            <AnimatePresence>
                {showThemes && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={() => setShowThemes(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowThemes(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"><X size={18} /></button>
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2"><Palette size={24} /><h2 className="text-2xl font-bold">Choose a Theme</h2></div>
                                <p className="text-zinc-400 text-sm">Apply professional color schemes to your website instantly</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {themes.map((theme) => (
                                    <motion.div key={theme.id} whileHover={{ y: -4 }} onClick={() => handleApplyTheme(theme)} className={`cursor-pointer rounded-xl overflow-hidden bg-white/5 border hover:border-white/30 transition group ${selectedTheme?.id === theme.id ? 'border-white/50 ring-2 ring-white/20' : 'border-white/10'}`}>
                                        <div className="h-24 flex">{theme.preview.map((color, i) => <div key={i} className="flex-1" style={{ backgroundColor: color }} />)}</div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold">{theme.name}</h3>
                                                {selectedTheme?.id === theme.id && <Check size={16} className="text-green-500" />}
                                            </div>
                                            <p className="text-xs text-zinc-400">{theme.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                                <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-300"><strong>Tip:</strong> Themes apply CSS variables to your code. You can further customize colors by chatting with AI.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GitHub Export Modal */}
            <AnimatePresence>
                {showGithubExport && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" onClick={() => setShowGithubExport(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setShowGithubExport(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"><X size={18} /></button>
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2"><Github size={24} /><h2 className="text-2xl font-bold">Export to GitHub</h2></div>
                                <p className="text-zinc-400 text-sm">Push your website to GitHub and deploy with GitHub Pages</p>
                            </div>
                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">1</div><h3 className="font-semibold">Download Project Files</h3></div>
                                    <p className="text-sm text-zinc-400 mb-3">Download your website files including index.html, README.md, and .gitignore</p>
                                    <button onClick={() => { const files = generateGithubFiles(); const repoName = website.title.toLowerCase().replace(/[^a-z0-9]/g, '-'); let allContent = `=== ${repoName} ===\n\n`; Object.entries(files).forEach(([filename, content]) => { allContent += `\n\n=== ${filename} ===\n${content}\n` }); const blob = new Blob([allContent], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${repoName}-github-export.txt`; a.click(); URL.revokeObjectURL(url); toast.success('Files downloaded!') }} className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"><Download size={16} className="inline mr-2" />Download Project Files</button>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">2</div><h3 className="font-semibold">Create GitHub Repository</h3></div>
                                    <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                                        <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/new</a></li>
                                        <li>Name your repository: <code className="px-2 py-0.5 rounded bg-black/50">{website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}</code></li>
                                        <li>Keep it public (for GitHub Pages)</li>
                                        <li>Don't initialize with README</li>
                                        <li>Click "Create repository"</li>
                                    </ol>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">3</div><h3 className="font-semibold">Push to GitHub</h3></div>
                                    <p className="text-sm text-zinc-400 mb-3">Run these commands in your project folder:</p>
                                    <div className="relative">
                                        <pre className="p-3 rounded-lg bg-black/50 text-xs overflow-x-auto">{`git init\ngit add .\ngit commit -m "Initial commit"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/${website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.git\ngit push -u origin main`}</pre>
                                        <button onClick={copyGithubCommands} className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition" title="Copy commands"><Copy size={14} /></button>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">4</div><h3 className="font-semibold">Enable GitHub Pages</h3></div>
                                    <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                                        <li>Go to your repository settings</li>
                                        <li>Click "Pages" in the sidebar</li>
                                        <li>Select "main" branch as source</li>
                                        <li>Click "Save"</li>
                                        <li>Your site will be live in a few minutes!</li>
                                    </ol>
                                </div>
                            </div>
                            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-green-300"><strong>Pro Tip:</strong> Your site will be available at https://[username].github.io/{website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Component Library */}
            <AnimatePresence>
                <ComponentLibrary isOpen={showComponents} onClose={() => setShowComponents(false)} onSelectComponent={handleAddComponent} />
            </AnimatePresence>

            {/* Animation Library */}
            <AnimatePresence>
                <AnimationLibrary isOpen={showAnimations} onClose={() => setShowAnimations(false)} onSelectAnimation={handleAddAnimation} />
            </AnimatePresence>

            {/* Integrations Hub */}
            <AnimatePresence>
                <IntegrationsHub isOpen={showIntegrations} onClose={() => setShowIntegrations(false)} onSelectIntegration={handleAddIntegration} />
            </AnimatePresence>
        </div>
    )
}

export default WebsiteEditor
