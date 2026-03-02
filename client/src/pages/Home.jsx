import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, Sparkles, Zap, Code2, Palette, Rocket, ArrowRight, Check, Star } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Home() {
    const features = [
        {
            icon: <Sparkles size={24} />,
            title: "AI-Powered Generation",
            description: "Describe your vision and watch AI create a stunning website in minutes"
        },
        {
            icon: <Code2 size={24} />,
            title: "Clean, Production Code",
            description: "Get professional HTML, CSS, and JavaScript ready for deployment"
        },
        {
            icon: <Palette size={24} />,
            title: "Fully Responsive",
            description: "Every website works perfectly on desktop, tablet, and mobile devices"
        },
        {
            icon: <Rocket size={24} />,
            title: "One-Click Deploy",
            description: "Launch your website instantly with our integrated deployment system"
        }
    ]

    const stats = [
        { value: "10K+", label: "Websites Created" },
        { value: "99%", label: "Satisfaction Rate" },
        { value: "< 2min", label: "Average Build Time" }
    ]

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    return (
        <div className='relative min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white overflow-hidden'>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <motion.div 
                        className='text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'
                        whileHover={{ scale: 1.05 }}
                    >
                        StackStudio
                    </motion.div>
                    
                    <div className='flex items-center gap-6'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='hidden md:inline text-sm text-zinc-300 hover:text-white transition'
                            onClick={() => navigate("/pricing")}
                        >
                            Pricing
                        </motion.button>

                        {userData && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className='hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-sm cursor-pointer'
                                onClick={() => navigate("/pricing")}
                            >
                                <Coins size={16} className='text-yellow-400' />
                                <span className='text-zinc-200'>{userData.credits}</span>
                                <span className='text-yellow-400 font-semibold'>Credits</span>
                            </motion.div>
                        )}

                        {!userData ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold shadow-lg shadow-indigo-500/25'
                                onClick={() => setOpenLogin(true)}
                            >
                                Get Started
                            </motion.button>
                        ) : (
                            <div className='relative'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='flex items-center'
                                    onClick={() => setOpenProfile(!openProfile)}
                                >
                                    <img
                                        src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=6366f1&color=fff`}
                                        alt=""
                                        referrerPolicy='no-referrer'
                                        className='w-10 h-10 rounded-full border-2 border-indigo-500/50 object-cover'
                                    />
                                </motion.button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-64 z-50 rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-2xl overflow-hidden"
                                        >
                                            <div className='px-5 py-4 border-b border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10'>
                                                <p className='text-sm font-semibold truncate'>{userData.name}</p>
                                                <p className='text-xs text-zinc-400 truncate mt-1'>{userData.email}</p>
                                            </div>

                                            <button className='md:hidden w-full px-5 py-3 flex items-center gap-3 text-sm border-b border-white/10 hover:bg-white/5 transition'>
                                                <Coins size={16} className='text-yellow-400' />
                                                <span className='flex-1 text-left'>{userData.credits} Credits</span>
                                            </button>

                                            <button
                                                className='w-full px-5 py-3 text-left text-sm hover:bg-white/5 transition flex items-center gap-3'
                                                onClick={() => navigate("/dashboard")}
                                            >
                                                <Rocket size={16} />
                                                Dashboard
                                            </button>
                                            <button
                                                className='w-full px-5 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition'
                                                onClick={handleLogOut}
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className='relative pt-32 pb-20 px-6 text-center'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
                    >
                        <Sparkles size={16} className="text-indigo-400" />
                        <span className="text-sm text-zinc-300">AI-Powered Website Builder</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight"
                    >
                        Build Stunning Websites
                        <br />
                        <span className='bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                            in Minutes, Not Days
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className='mt-8 max-w-3xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed'
                    >
                        Describe your vision and let our AI generate a modern, responsive, 
                        production-ready website. No coding required.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                            onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}
                        >
                            {userData ? "Go to Dashboard" : "Start Building Free"}
                            <ArrowRight size={20} />
                        </motion.button>

                        {!userData && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition"
                                onClick={() => navigate("/pricing")}
                            >
                                View Pricing
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-zinc-500 mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className='relative max-w-7xl mx-auto px-6 py-20'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Everything You Need to
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Build Amazing Websites</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Powerful features that make website creation effortless
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 hover:border-indigo-500/50 transition-all duration-300"
                        >
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                            
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className='text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors'>
                                    {feature.title}
                                </h3>
                                <p className='text-zinc-400 leading-relaxed'>
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* User Websites Section */}
            {userData && websites?.length > 0 && (
                <section className='relative max-w-7xl mx-auto px-6 py-20'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between mb-10"
                    >
                        <div>
                            <h3 className='text-3xl font-bold mb-2'>Your Recent Websites</h3>
                            <p className='text-zinc-400'>Continue where you left off</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2"
                            onClick={() => navigate("/dashboard")}
                        >
                            View All
                            <ArrowRight size={16} />
                        </motion.button>
                    </motion.div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {websites.slice(0, 3).map((w, i) => (
                            <motion.div
                                key={w._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="group cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all duration-300"
                            >
                                <div className='relative h-48 bg-black overflow-hidden'>
                                    <iframe
                                        srcDoc={w.latestCode}
                                        className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                        <span className='px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium'>
                                            Open Editor
                                        </span>
                                    </div>
                                </div>
                                <div className='p-5'>
                                    <h3 className='text-base font-semibold line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors'>
                                        {w.title}
                                    </h3>
                                    <p className='text-xs text-zinc-500'>
                                        Updated {new Date(w.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            {!userData && (
                <section className='relative max-w-5xl mx-auto px-6 py-20'>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-12 md:p-16 text-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
                        
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Ready to Build Your Dream Website?
                            </h2>
                            <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of creators who are building amazing websites with AI
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 rounded-full bg-white text-black font-bold text-lg shadow-2xl flex items-center gap-2 mx-auto"
                                onClick={() => setOpenLogin(true)}
                            >
                                Start Building Now
                                <Zap size={20} />
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Footer */}
            <footer className='relative border-t border-white/10 py-12 text-center'>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            StackStudio
                        </div>
                        <div className="text-sm text-zinc-500">
                            &copy; {new Date().getFullYear()} StackStudio. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6 text-sm text-zinc-400">
                            <button className="hover:text-white transition">Privacy</button>
                            <button className="hover:text-white transition">Terms</button>
                            <button className="hover:text-white transition">Contact</button>
                        </div>
                    </div>
                </div>
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home
