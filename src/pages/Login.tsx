import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react"
import { authAPI } from "@/lib/api"

export function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await login(email, password)
            await new Promise(resolve => setTimeout(resolve, 800)) // Artificial delay for smoothness
            navigate("/dashboard")
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = authAPI.googleLogin()
    }

    return (
        <div className="min-h-screen w-full flex overflow-hidden bg-background">
            {/* Left Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10"
            >
                {/* Decorative Background Elements for Form Side */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
                    <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
                    <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
                </div>

                <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl shadow-xl border-white/20">
                    <div className="text-center space-y-2">
                        <Link to="/" className="inline-block transition-transform hover:scale-105">
                            <Logo size="lg" className="justify-center" />
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-muted-foreground">
                            Sign in to access your medical dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground/80 ml-1">Email</label>
                                <div className="relative group input-premium">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="doctor@hospital.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-white/50 border-input/50 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground/80 ml-1">Password</label>
                                <div className="relative group input-premium">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 bg-white/50 border-input/50 transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-12 text-lg font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border/50" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground glass rounded-full">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="w-full h-12 hover:bg-white/50 transition-all duration-300"
                                onClick={handleGoogleLogin}
                            >
                                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground pt-4">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-primary hover:text-accent font-semibold transition-colors hover:underline underline-offset-4"
                            >
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>

            {/* Right Side - Branding/Illustration */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden"
            >
                {/* Background Gradient Mesh */}
                <div className="absolute inset-0 gradient-mesh opacity-20" />

                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 animate-float">
                    <div className="w-24 h-24 bg-primary/20 rounded-2xl rotate-12 backdrop-blur-md border border-white/10" />
                </div>
                <div className="absolute bottom-1/3 right-1/4 animate-float-delayed">
                    <div className="w-32 h-32 bg-accent/20 rounded-full backdrop-blur-md border border-white/10" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center p-12 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30">
                            <Activity className="h-12 w-12 text-white" />
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-4xl font-bold text-white mb-6"
                    >
                        Medical Intelligence System
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="text-lg text-slate-300 leading-relaxed"
                    >
                        Empowering healthcare professionals with AI-driven insights for ICU, Emergency, and Staff management.
                    </motion.p>

                    {/* Stat Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="mt-12 grid grid-cols-2 gap-4"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">99.9%</div>
                            <div className="text-xs text-slate-400">Uptime</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">Secure</div>
                            <div className="text-xs text-slate-400">HIPAA Compliant</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
