import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { useState } from 'react'
import { ArrowLeft, AlertCircle, Check, CheckCircle, Code, Code2, Copy, Download, Github, Grid3x3, Info, Lock, MessageCircle, MessageSquare, Monitor, Palette, Pencil, Plug, Redo, Rocket, RotateCcw, Search, Send, Smartphone, Sparkles, Tablet, Undo, X } from 'lucide-react'
import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { themes, applyThemeToCode } from '../data/themes'
import { analyzeSEO, generateSEOPrompt } from '../utils/seoAnalyzer'
import ComponentLibrary from '../components/ComponentLibrary'
import AnimationLibrary from '../components/AnimationLibrary'
import IntegrationsHub from '../components/IntegrationsHub'

import Editor from '@monaco-editor/react';
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
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [editingTitle, setEditingTitle] = useState(false)
    const [title, setTitle] = useState("")
    const [codeCopied, setCodeCopied] = useState(false)
    const [showThemes, setShowThemes] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(null)
    const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile
    const [previewOrientation, setPreviewOrientation] = useState('portrait') // portrait, landscape
    const [codeHistory, setCodeHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [showGithubExport, setShowGithubExport] = useState(false)
    const [showSEO, setShowSEO] = useState(false)
    const [seoAnalysis, setSeoAnalysis] = useState(null)
    const [showComponents, setShowComponents] = useState(false)
    const [showAnimations, setShowAnimations] = useState(false)
    const [showIntegrations, setShowIntegrations] = useState(false)
    
    const isPro = userData?.plan === "pro" || userData?.plan === "enterprise"
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
            console.log(result)
            setUpdateLoading(false)
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            
            // Add to history before updating code
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
        if (!isPro) {
            setShowUpgradeModal(true)
            return
        }
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
            await axios.patch(`${serverUrl}/api/website/update-title/${id}`, 
                { title: title.trim() }, 
                { withCredentials: true }
            )
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
            tablet: previewOrientation === 'portrait' 
                ? { width: '768px', height: '1024px' }
                : { width: '1024px', height: '768px' },
            mobile: previewOrientation === 'portrait'
                ? { width: '375px', height: '667px' }
                : { width: '667px', height: '375px' }
        }
        return dimensions[previewMode]
    }

    const toggleOrientation = () => {
        if (previewMode === 'desktop') return
        setPreviewOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')
    }

    const addToHistory = (newCode) => {
        // Remove any future history if we're not at the end
        const newHistory = codeHistory.slice(0, historyIndex + 1)
        newHistory.push(newCode)
        
        // Keep only last 20 versions to prevent memory issues
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
        if (!isPro) {
            setShowUpgradeModal(true)
            return
        }
        setShowGithubExport(true)
    }

    const generateGithubFiles = () => {
        const repoName = website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
        
        const readme = `# ${website.title}

Generated with StackStudio - AI Website Builder

## 🚀 Quick Start

1. Clone this repository
2. Open \`index.html\` in your browser
3. That's it! No build process needed.

## 📁 Project Structure

\`\`\`
${repoName}/
├── index.html          # Main website file
└── README.md          # This file
\`\`\`

## 🌐 Deploy to GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "main" branch as source
4. Click "Save"
5. Your site will be live at: \`https://[username].github.io/${repoName}\`

## 📝 Customization

This is a static HTML website. You can:
- Edit the HTML directly in \`index.html\`
- Modify styles in the \`<style>\` tag
- Add JavaScript in the \`<script>\` tag

## 🛠️ Built With

- HTML5
- CSS3
- Vanilla JavaScript
- StackStudio AI

## 📄 License

MIT License - Feel free to use this project however you'd like!

---

Made with ❤️ using [StackStudio](https://stackstudio.com)
`

        const gitignore = `.DS_Store
Thumbs.db
*.log
node_modules/
.env
`

        return {
            'index.html': code,
            'README.md': readme,
            '.gitignore': gitignore
        }
    }

    const copyGithubCommands = () => {
        const repoName = website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
        const commands = `# Create a new repository on GitHub, then run:

git init
git add .
git commit -m "Initial commit - Generated with StackStudio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/${repoName}.git
git push -u origin main

# Enable GitHub Pages:
# Go to Settings > Pages > Select 'main' branch > Save`

        navigator.clipboard.writeText(commands)
        toast.success('Commands copied to clipboard!')
    }

    const handleSEOAnalysis = () => {
        const analysis = analyzeSEO(code)
        setSeoAnalysis(analysis)
        setShowSEO(true)
    }

    const handleFixSEO = async () => {
        if (!seoAnalysis) return
        
        const prompt = generateSEOPrompt(seoAnalysis)
        setShowSEO(false)
        setPrompt(prompt)
        
        // Trigger update
        setTimeout(() => {
            handleUpdate()
        }, 100)
    }

    const handleAddComponent = (component) => {
        setShowComponents(false)
        setPrompt(component.prompt)
        toast.success(`${component.name} component loaded!`)
    }

    const handleAddAnimation = (animation) => {
        setShowAnimations(false)
        setPrompt(animation.prompt)
        toast.success(`${animation.name} animation loaded!`)
    }

    const handleAddIntegration = (integration) => {
        setShowIntegrations(false)
        setPrompt(integration.prompt)
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
                
                // Initialize history with current code
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

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+Z or Cmd+Z for undo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                handleUndo()
            }
            // Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y for redo
            if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
                (e.ctrlKey && e.key === 'y')) {
                e.preventDefault()
                handleRedo()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [historyIndex, codeHistory])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>
                Loading...
            </div>
        )
    }



    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80'>
                <Header />
                <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"
                                    }`}
                            >

                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                        ? "bg-white text-black"
                                        : "bg-white/5 border border-white/10 text-zinc-200"
                                        }`}
                                >

                                    {m.content}

                                </div>

                            </div>
                        ))}

                        {updateLoading &&

                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                            </div>}




                    </div>
                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate}><Send size={14} /></button>
                        </div>
                    </div>

                </>
            </aside>

            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <div className='flex items-center gap-3'>
                        <span className='text-xs text-zinc-400'>Live Preview</span>
                        
                        {/* Device Preview Selector */}
                        <div className='hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10'>
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`p-1.5 rounded transition ${previewMode === 'desktop' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                title="Desktop View"
                            >
                                <Monitor size={14} />
                            </button>
                            <button
                                onClick={() => setPreviewMode('tablet')}
                                className={`p-1.5 rounded transition ${previewMode === 'tablet' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                title="Tablet View"
                            >
                                <Tablet size={14} />
                            </button>
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`p-1.5 rounded transition ${previewMode === 'mobile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                title="Mobile View"
                            >
                                <Smartphone size={14} />
                            </button>
                            {previewMode !== 'desktop' && (
                                <button
                                    onClick={toggleOrientation}
                                    className='p-1.5 rounded hover:bg-white/10 transition ml-1 border-l border-white/10'
                                    title={`Rotate to ${previewOrientation === 'portrait' ? 'Landscape' : 'Portrait'}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                        <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
                                        <polyline points="7.5 19.79 7.5 14.6 3 12"/>
                                        <polyline points="21 12 16.5 14.6 16.5 19.79"/>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                                    </svg>
                                </button>
                            )}
                        </div>

                        {website.updatedAt && (
                            <span className='text-xs text-zinc-500'>
                                Last saved: {formatDistanceToNow(new Date(website.updatedAt), { addSuffix: true })}
                            </span>
                        )}
                    </div>
                    <div className='flex gap-2'>
                        {website.deployed ?"": <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'
                        onClick={handleDeploy}
                        ><Rocket size={14} /> Deploy</button>}
                       
                        <button 
                            className='p-2 hover:bg-white/10 rounded-lg transition' 
                            onClick={() => setShowThemes(true)}
                            title="Change Theme"
                        >
                            <Palette size={18} />
                        </button>

                        <button 
                            className='p-2 hover:bg-white/10 rounded-lg transition' 
                            onClick={handleSEOAnalysis}
                            title="SEO Analyzer"
                        >
                            <Search size={18} />
                        </button>

                        <button 
                            className='p-2 hover:bg-white/10 rounded-lg transition' 
                            onClick={() => setShowComponents(true)}
                            title="Component Library"
                        >
                            <Grid3x3 size={18} />
                        </button>

                        <button 
                            className='p-2 hover:bg-white/10 rounded-lg transition' 
                            onClick={() => setShowAnimations(true)}
                            title="Animation Library"
                        >
                            <Sparkles size={18} />
                        </button>

                        <button 
                            className='p-2 hover:bg-white/10 rounded-lg transition' 
                            onClick={() => setShowIntegrations(true)}
                            title="Integrations Hub"
                        >
                            <Plug size={18} />
                        </button>

                        {/* Undo/Redo Buttons */}
                        <div className='hidden md:flex items-center gap-1 px-1 py-1 rounded-lg bg-white/5 border border-white/10'>
                            <button
                                onClick={handleUndo}
                                disabled={!canUndo}
                                className={`p-1.5 rounded transition ${canUndo ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`}
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo size={14} />
                            </button>
                            <button
                                onClick={handleRedo}
                                disabled={!canRedo}
                                className={`p-1.5 rounded transition ${canRedo ? 'hover:bg-white/10' : 'opacity-30 cursor-not-allowed'}`}
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo size={14} />
                            </button>
                        </div>

                        <button className='p-2 lg:hidden' onClick={() => setShowChat(true)}><MessageSquare size={18} /></button>

                        <button 
                            className='p-2' 
                            onClick={() => isPro ? setShowCode(true) : setShowUpgradeModal(true)}
                            title={isPro ? "View Code" : "Pro feature"}
                        >
                            {isPro ? <Code2 size={18} /> : <Lock size={18} className='text-yellow-500' />}
                        </button>
                        
                        <button 
                            className='p-2'
                            onClick={handleCopyCode}
                            title={isPro ? "Copy Code" : "Pro feature"}
                        >
                            {codeCopied ? <Check size={18} className='text-green-500' /> : isPro ? <Copy size={18} /> : <Lock size={18} className='text-yellow-500' />}
                        </button>
                        
                        <button 
                            className='p-2'
                            onClick={() => {
                                if (!isPro) {
                                    setShowUpgradeModal(true)
                                    return
                                }
                                const blob = new Blob([code], { type: 'text/html' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `${website.title || 'website'}.html`
                                a.click()
                                URL.revokeObjectURL(url)
                                toast.success('Code downloaded!')
                            }}
                            title={isPro ? "Download Code" : "Pro feature"}
                        >
                            {isPro ? <Download size={18} /> : <Lock size={18} className='text-yellow-500' />}
                        </button>
                        
                        <button 
                            className='p-2'
                            onClick={handleGithubExport}
                            title={isPro ? "Export to GitHub" : "Pro feature"}
                        >
                            {isPro ? <Github size={18} /> : <Lock size={18} className='text-yellow-500' />}
                        </button>

                        <button className='p-2' onClick={() => setShowFullPreview(true)}><Monitor size={18} /></button>
                    </div>

                </div>

                <div className='flex-1 flex items-center justify-center bg-zinc-900 overflow-auto'>
                    <div 
                        className='transition-all duration-300 bg-white'
                        style={{
                            width: getPreviewDimensions().width,
                            height: getPreviewDimensions().height,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            boxShadow: previewMode !== 'desktop' ? '0 20px 60px rgba(0,0,0,0.5)' : 'none',
                            borderRadius: previewMode !== 'desktop' ? '12px' : '0'
                        }}
                    >
                        <iframe 
                            ref={iframeRef} 
                            sandbox='allow-scripts allow-same-origin allow-forms' 
                            className='w-full h-full'
                            style={{ borderRadius: previewMode !== 'desktop' ? '12px' : '0' }}
                        />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col"
                    >
                   <Header onclose={()=>setShowChat(false)}/>
                   <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"
                                    }`}
                            >

                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                        ? "bg-white text-black"
                                        : "bg-white/5 border border-white/10 text-zinc-200"
                                        }`}
                                >

                                    {m.content}

                                </div>

                            </div>
                        ))}

                        {updateLoading &&

                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                            </div>}




                    </div>
                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate}><Send size={14} /></button>
                        </div>
                    </div>

                </>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col"
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={() => setShowCode(false)}><X size={18} /></button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            value={code}
                            language='html'
                            onChange={(v) => isPro ? setCode(v) : null}
                            options={{
                                readOnly: !isPro,
                                minimap: { enabled: isPro }
                            }}
                        />

                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black"
                    >
                        <iframe className='w-full h-full bg-white' srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms'/>
                        <button onClick={() => setShowFullPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg'><X /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upgrade Modal */}
            <AnimatePresence>
                {showUpgradeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                        onClick={() => setShowUpgradeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-md w-full p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                    <Lock size={28} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
                                <p className="text-zinc-400 text-sm">
                                    Code editing and downloading are available in Pro and Enterprise plans
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <span>View and edit source code</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                                    <span>Download HTML files</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>
                    <span>More credits for generation</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/pricing')}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition"
                            >
                                View Plans
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Theme Picker Modal */}
            <AnimatePresence>
                {showThemes && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                        onClick={() => setShowThemes(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowThemes(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Palette size={24} />
                                    <h2 className="text-2xl font-bold">Choose a Theme</h2>
                                </div>
                                <p className="text-zinc-400 text-sm">
                                    Apply professional color schemes to your website instantly
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {themes.map((theme) => (
                                    <motion.div
                                        key={theme.id}
                                        whileHover={{ y: -4 }}
                                        onClick={() => handleApplyTheme(theme)}
                                        className={`cursor-pointer rounded-xl overflow-hidden bg-white/5 border hover:border-white/30 transition group ${
                                            selectedTheme?.id === theme.id ? 'border-white/50 ring-2 ring-white/20' : 'border-white/10'
                                        }`}
                                    >
                                        <div className="h-24 flex">
                                            {theme.preview.map((color, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-semibold">{theme.name}</h3>
                                                {selectedTheme?.id === theme.id && (
                                                    <Check size={16} className="text-green-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-400">{theme.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-blue-300">
                                    💡 <strong>Tip:</strong> Themes apply CSS variables to your code. You can further customize colors by chatting with AI.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GitHub Export Modal */}
            <AnimatePresence>
                {showGithubExport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                        onClick={() => setShowGithubExport(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowGithubExport(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Github size={24} />
                                    <h2 className="text-2xl font-bold">Export to GitHub</h2>
                                </div>
                                <p className="text-zinc-400 text-sm">
                                    Push your website to GitHub and deploy with GitHub Pages
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Step 1 */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">1</div>
                                        <h3 className="font-semibold">Download Project Files</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">
                                        Download your website files including index.html, README.md, and .gitignore
                                    </p>
                                    <button
                                        onClick={() => {
                                            const files = generateGithubFiles()
                                            const repoName = website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
                                            
                                            // Create a simple text file with all content
                                            let allContent = `=== ${repoName} ===\n\n`
                                            Object.entries(files).forEach(([filename, content]) => {
                                                allContent += `\n\n=== ${filename} ===\n${content}\n`
                                            })
                                            
                                            const blob = new Blob([allContent], { type: 'text/plain' })
                                            const url = URL.createObjectURL(blob)
                                            const a = document.createElement('a')
                                            a.href = url
                                            a.download = `${repoName}-github-export.txt`
                                            a.click()
                                            URL.revokeObjectURL(url)
                                            toast.success('Files downloaded!')
                                        }}
                                        className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
                                    >
                                        <Download size={16} className="inline mr-2" />
                                        Download Project Files
                                    </button>
                                </div>

                                {/* Step 2 */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">2</div>
                                        <h3 className="font-semibold">Create GitHub Repository</h3>
                                    </div>
                                    <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                                        <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/new</a></li>
                                        <li>Name your repository: <code className="px-2 py-0.5 rounded bg-black/50">{website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}</code></li>
                                        <li>Keep it public (for GitHub Pages)</li>
                                        <li>Don't initialize with README</li>
                                        <li>Click "Create repository"</li>
                                    </ol>
                                </div>

                                {/* Step 3 */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">3</div>
                                        <h3 className="font-semibold">Push to GitHub</h3>
                                    </div>
                                    <p className="text-sm text-zinc-400 mb-3">
                                        Run these commands in your project folder:
                                    </p>
                                    <div className="relative">
                                        <pre className="p-3 rounded-lg bg-black/50 text-xs overflow-x-auto">
{`git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/${website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.git
git push -u origin main`}
                                        </pre>
                                        <button
                                            onClick={copyGithubCommands}
                                            className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition"
                                            title="Copy commands"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">4</div>
                                        <h3 className="font-semibold">Enable GitHub Pages</h3>
                                    </div>
                                    <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                                        <li>Go to your repository settings</li>
                                        <li>Click "Pages" in the sidebar</li>
                                        <li>Select "main" branch as source</li>
                                        <li>Click "Save"</li>
                                        <li>Your site will be live in a few minutes!</li>
                                    </ol>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <p className="text-xs text-green-300">
                                    ✅ <strong>Pro Tip:</strong> Your site will be available at https://[username].github.io/{website.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Component Library */}
            <AnimatePresence>
                <ComponentLibrary
                    isOpen={showComponents}
                    onClose={() => setShowComponents(false)}
                    onSelectComponent={handleAddComponent}
                />
            </AnimatePresence>

            {/* Animation Library */}
            <AnimatePresence>
                <AnimationLibrary
                    isOpen={showAnimations}
                    onClose={() => setShowAnimations(false)}
                    onSelectAnimation={handleAddAnimation}
                />
            </AnimatePresence>

            {/* Integrations Hub */}
            <AnimatePresence>
                <IntegrationsHub
                    isOpen={showIntegrations}
                    onClose={() => setShowIntegrations(false)}
                    onSelectIntegration={handleAddIntegration}
                />
            </AnimatePresence>

        </div>
    )

    function Header({onclose}) {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                {editingTitle ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleUpdateTitle}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTitle()
                            if (e.key === 'Escape') {
                                setEditingTitle(false)
                                setTitle(website.title)
                            }
                        }}
                        autoFocus
                        className='flex-1 font-semibold bg-white/5 border border-white/20 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-white/30'
                    />
                ) : (
                    <div className='flex items-center gap-2 flex-1'>
                        <span className='font-semibold truncate'>{website.title}</span>
                        <button
                            onClick={() => setEditingTitle(true)}
                            className='p-1 hover:bg-white/10 rounded transition'
                            title='Edit title'
                        >
                            <Pencil size={14} />
                        </button>
                    </div>
                )}
                {onclose &&  <button onClick={onclose}><X size={18} color='white'/></button>}
           
            </div>
        )
    }



}







export default WebsiteEditor


            {/* SEO Analyzer Modal */}
            <AnimatePresence>
                {showSEO && seoAnalysis && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                        onClick={() => setShowSEO(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowSEO(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Search size={24} />
                                    <h2 className="text-2xl font-bold">SEO Analysis</h2>
                                </div>
                                <p className="text-zinc-400 text-sm">
                                    Analyze and improve your website's search engine optimization
                                </p>
                            </div>

                            {/* SEO Score */}
                            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-sm text-zinc-400 mb-1">SEO Score</div>
                                        <div className="text-4xl font-bold">{seoAnalysis.score}/100</div>
                                    </div>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold border-4 ${
                                        seoAnalysis.grade.color === 'green' ? 'border-green-500 text-green-500' :
                                        seoAnalysis.grade.color === 'blue' ? 'border-blue-500 text-blue-500' :
                                        seoAnalysis.grade.color === 'yellow' ? 'border-yellow-500 text-yellow-500' :
                                        seoAnalysis.grade.color === 'orange' ? 'border-orange-500 text-orange-500' :
                                        'border-red-500 text-red-500'
                                    }`}>
                                        {seoAnalysis.grade.letter}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <AlertCircle size={16} className="text-red-400" />
                                        {seoAnalysis.summary.errors} Errors
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <AlertCircle size={16} className="text-yellow-400" />
                                        {seoAnalysis.summary.warnings} Warnings
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Info size={16} className="text-blue-400" />
                                        {seoAnalysis.summary.info} Suggestions
                                    </span>
                                </div>
                            </div>

                            {/* Issues */}
                            {seoAnalysis.issues.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3">Issues Found</h3>
                                    <div className="space-y-3">
                                        {seoAnalysis.issues.map((issue, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-xl border ${
                                                    issue.type === 'error' 
                                                        ? 'bg-red-500/10 border-red-500/30' 
                                                        : 'bg-yellow-500/10 border-yellow-500/30'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {issue.type === 'error' ? (
                                                        <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                                                    ) : (
                                                        <AlertCircle size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-sm">{issue.category}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                                issue.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                                                                issue.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                'bg-blue-500/20 text-blue-300'
                                                            }`}>
                                                                {issue.impact} impact
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-zinc-300 mb-2">{issue.message}</p>
                                                        <p className="text-xs text-zinc-400">
                                                            <strong>Fix:</strong> {issue.fix}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {seoAnalysis.suggestions.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-3">Suggestions</h3>
                                    <div className="space-y-3">
                                        {seoAnalysis.suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Info size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-sm mb-1">{suggestion.category}</div>
                                                        <p className="text-sm text-zinc-300 mb-2">{suggestion.message}</p>
                                                        <p className="text-xs text-zinc-400">
                                                            <strong>Tip:</strong> {suggestion.fix}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {seoAnalysis.summary.errors > 0 && (
                                    <button
                                        onClick={handleFixSEO}
                                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold hover:scale-105 transition"
                                    >
                                        Fix with AI
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowSEO(false)}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium"
                                >
                                    Close
                                </button>
                            </div>

                            {seoAnalysis.score >= 90 && (
                                <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <p className="text-sm text-green-300">
                                        🎉 <strong>Excellent!</strong> Your website has great SEO. Keep up the good work!
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
