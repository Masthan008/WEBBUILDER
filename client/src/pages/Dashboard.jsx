import { ArrowLeft, Check, Rocket, Search, Share2, Trash2 } from 'lucide-react'
import React, { useEffect, useState, useMemo } from 'react'
import { motion } from "motion/react"
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

    // Filter and sort websites
    const filteredWebsites = useMemo(() => {
        if (!websites) return []
        
        let filtered = [...websites]
        
        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(w => 
                w.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        
        // Deployment filter
        if (filterBy === "deployed") {
            filtered = filtered.filter(w => w.deployed)
        } else if (filterBy === "not-deployed") {
            filtered = filtered.filter(w => !w.deployed)
        }
        
        // Sort
        if (sortBy === "newest") {
            filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        } else if (sortBy === "oldest") {
            filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
        } else if (sortBy === "name") {
            filtered.sort((a, b) => a.title.localeCompare(b.title))
        }
        
        return filtered
    }, [websites, searchQuery, filterBy, sortBy])

    return (
        <div className='min-h-screen bg-[#050505] text-white'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate("/")}><ArrowLeft size={16} /></button>
                        <h1 className='text-lg font-semibold'>Dashboard</h1>
                    </div>
                    <button className='px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition' onClick={() => navigate("/generate")}>
                        + New Website
                    </button>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
                    <h1 className='text-3xl font-bold'>{userData.name}</h1>
                </motion.div>

                {/* Search and Filter */}
                {!loading && websites && websites.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8 flex flex-col md:flex-row gap-4"
                    >
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search websites..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition"
                            />
                        </div>
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition cursor-pointer"
                        >
                            <option value="all">All Websites</option>
                            <option value="deployed">Deployed Only</option>
                            <option value="not-deployed">Not Deployed</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 transition cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </motion.div>
                )}

                {loading && (
                    <div className="mt-24 text-center text-zinc-400">Loading Your Websites...</div>
                )}

                {error && !loading && (
                    <div className="mt-24 text-center text-red-400">{error}</div>
                )}

                {websites?.length == 0 && (
                    <div className="mt-24 text-center text-zinc-400">You have no websites</div>
                )}

                {!loading && !error && websites?.length > 0 && filteredWebsites.length === 0 && (
                    <div className="mt-24 text-center text-zinc-400">No websites match your search</div>
                )}

                {!loading && !error && filteredWebsites.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {filteredWebsites.map((w, i) => {

                            const copied = copiedId === w._id

                            return <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -6 }}
                               
                                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col"
                            >
                                <div className='relative h-40 bg-black cursor-pointer'  onClick={()=>navigate(`/editor/${w._id}`)}>
                                    <iframe srcDoc={w.latestCode} className='absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white' />
                                    <div className='absolute inset-0 bg-black/30' />
                                </div>

                                <div className='p-5 flex flex-col gap-4 flex-1'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='text-xs text-zinc-400'>Last Updated {""}
                                        {new Date(w.updatedAt).toLocaleDateString()}
                                    </p>

                                    <div className='mt-auto flex gap-2'>
                                        {!w.deployed ? (
                                            <button className="flex-1 flex items-center justify-center gap-2
                          px-4 py-2 rounded-xl text-sm font-semibold
                          bg-gradient-to-r from-indigo-500 to-purple-500
                          hover:scale-105 transition
                        "
                                                onClick={() => handleDeploy(w._id)}

                                            ><Rocket size={18} /> Deploy</button>
                                        ) : (<motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCopy(w)}
                                            className={`
                          flex-1 flex items-center justify-center gap-2
                          px-4 py-2 rounded-xl text-sm font-medium
                          transition-all
                          ${copied
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                    : "bg-white/10 hover:bg-white/20 border border-white/10"
                                                }
                        `}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={14} />
                                                    Link Copied
                                                </>
                                            ) :
                                                <>
                                                    <Share2 size={14} />
                                                    Share Link
                                                </>
                                            }
                                        </motion.button>)}

                                        <button
                                            onClick={() => handleDelete(w._id)}
                                            disabled={deletingId === w._id}
                                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition disabled:opacity-50"
                                            title="Delete website"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                </div>

                            </motion.div>
                        })}

                    </div>
                )}


            </div>
        </div>
    )
}

export default Dashboard
