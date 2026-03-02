import { ArrowLeft, Check, Rocket, Search, Share2, Trash2, Plus, Filter, SortAsc, Sparkles, TrendingUp, Clock, Globe } from 'lucide-react'
import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import toast from 'react-hot-toast'

function Dashboard() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterBy, setFilterBy] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    
    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id
                        ? { ...w, deployed: true, deployUrl: result.data.url }
                        : w
                )
            );
            toast.success('Website deployed successfully!')
        } catch (error) {
            console.log(error)
            toast.error('Failed to deploy website')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this website?")) return
        
        setDeletingId(id)
        try {
            await axios.delete(`${serverUrl}/api/website/delete/${id}`, { withCredentials: true })
            setWebsites((prev) => prev.filter((w) => w._id !== id))
            setDeletingId(null)
            toast.success('Website deleted successfully')
        } catch (error) {
            console.log(error)
            toast.error('Failed to delete website')
            setDeletingId(null)
        }
    }

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
                setLoading(false)
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
                setLoading(false)
            }
        }
        handleGetAllWebsites()
    }, [])

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const filteredWebsites = useMemo(() => {
        if (!websites) return []
        
        let filtered = [...websites]
        
        if (searchQuery) {
            filtered = filtered.filter(w => 
                w.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        
        if (filterBy === "deployed") {
            filtered = filtered.filter(w => w.deployed)
        } else if (filterBy === "not-deployed") {
            filtered = filtered.filter(w => !w.deployed)
        }
        
        if (sortBy === "newest") {
            filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        } else if (sortBy === "oldest") {
            filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        } else if (sortBy === "name") {
            filtered.sort((a, b) => a.title.localeCompare(b.title))
        }
        
        return filtered
    }, [websites, searchQuery, filterBy, sortBy])

    const stats = [
        { icon: <Globe size={20} />, label: "Total Websites", value: websites?.length || 0, color: "from-blue-500 to-cyan-500" },
        { icon: <Rocket size={20} />, label: "Deployed", value: websites?.filter(w => w.deployed).length || 0, color: "from-green-500 to-emerald-500" },
        { icon: <Clock size={20} />, label: "In Progress", value: websites?.filter(w => !w.deployed).length || 0, color: "from-orange-500 to-yellow-500" }
    ]

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white'>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Navigation */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='sticky top-0 z-40 backdrop-blur-2xl bg-black/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='p-2 rounded-xl hover:bg-white/10 transition'
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft size={18} />
                        </motion.button>
                        <h1 className='text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
                            Dashboard
                        </h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className='px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2'
                        onClick={() => navigate("/generate")}
                    >
                        <Plus size={18} />
                        New Website
                    </motion.button>
                </div>
            </motion.div>

            <div className='relative max-w-7xl mx-auto px-6 py-10'>
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={24} className="text-indigo-400" />
                        <p className='text-sm text-zinc-400'>Welcome back</p>
                    </div>
                    <h1 className='text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
                        {userData.name}
                    </h1>
                </motion.div>

                {/* Stats Cards */}
                {!loading && websites && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="relative rounded-2xl bg-white/5 border border-white/10 p-6 overflow-hidden group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-2">{stat.label}</p>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-20 flex items-center justify-center`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
