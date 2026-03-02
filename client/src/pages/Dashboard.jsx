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

                {/* Search and Filters */}
                {!loading && websites && websites.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 flex flex-col md:flex-row gap-4"
                    >
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search your websites..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer"
                            >
                                <option value="all">All Websites</option>
                                <option value="deployed">Deployed</option>
                                <option value="not-deployed">Not Deployed</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="mt-24 text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"
                        ></motion.div>
                        <p className="text-zinc-400">Loading your websites...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-24 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} className="text-red-400" />
                        </div>
                        <p className="text-red-400">{error}</p>
                    </motion.div>
                )}

                {/* Empty State */}
                {websites?.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-24 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                            <Sparkles size={40} className="text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">No websites yet</h3>
                        <p className="text-zinc-400 mb-8">Create your first AI-powered website in minutes</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 font-semibold shadow-lg shadow-indigo-500/25"
                            onClick={() => navigate("/generate")}
                        >
                            Create Your First Website
                        </motion.button>
                    </motion.div>
                )}

                {/* No Search Results */}
                {!loading && !error && websites?.length > 0 && filteredWebsites.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-24 text-center text-zinc-400"
                    >
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No websites match your search</p>
                    </motion.div>
                )}

                {/* Websites Grid */}
                {!loading && !error && filteredWebsites.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    >
                        {filteredWebsites.map((w, i) => {
                            const copied = copiedId === w._id
                            const deleting = deletingId === w._id

                            return (
                                <motion.div
                                    key={w._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="group relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
                                >
                                    {/* Preview */}
                                    <div
                                        className='relative h-48 bg-black cursor-pointer overflow-hidden'
                                        onClick={() => navigate(`/editor/${w._id}`)}
                                    >
                                        <iframe
                                            srcDoc={w.latestCode}
                                            className='absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                            <span className='px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium'>
                                                Open Editor
                                            </span>
                                        </div>
                                        
                                        {/* Deployed Badge */}
                                        {w.deployed && (
                                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium flex items-center gap-1">
                                                <Check size={12} />
                                                Deployed
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className='p-5 flex flex-col gap-4'>
                                        <div>
                                            <h3 className='text-base font-semibold line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors'>
                                                {w.title}
                                            </h3>
                                            <p className='text-xs text-zinc-500 flex items-center gap-2'>
                                                <Clock size={12} />
                                                Updated {new Date(w.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className='flex gap-2'>
                                            {!w.deployed ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                                                    onClick={() => handleDeploy(w._id)}
                                                >
                                                    <Rocket size={16} />
                                                    Deploy
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleCopy(w)}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                                        copied
                                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                            : "bg-white/10 hover:bg-white/20 border border-white/10"
                                                    }`}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check size={14} />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Share2 size={14} />
                                                            Share
                                                        </>
                                                    )}
                                                </motion.button>
                                            )}

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(w._id)}
                                                disabled={deleting}
                                                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete website"
                                            >
                                                {deleting ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.div>
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
