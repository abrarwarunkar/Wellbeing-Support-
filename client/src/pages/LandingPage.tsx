import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain, MessageCircle, BarChart3, Shield, Heart, Users, ArrowRight, Sparkles, CheckCircle2, Star } from "lucide-react";

export default function LandingPage() {
    const { user, isLoading, logout } = useAuth();
    const [, setLocation] = useLocation();

    if (!isLoading && user && (user.onboardingStatus === 'active' || user.onboardingStatus === 'completed')) {
        setLocation("/dashboard");
        return null;
    }

    if (!isLoading && user && user.onboardingStatus !== 'active' && user.onboardingStatus !== 'completed') {
        logout();
    }

    const features = [
        {
            icon: Brain,
            title: "AI Counselor Chat",
            description: "24/7 empathetic listening and evidence-based guidance through our advanced neural empathy model.",
            color: "#4d41df",
            bg: "rgba(77, 65, 223, 0.08)",
        },
        {
            icon: BarChart3,
            title: "Mood Tracking",
            description: "Visualize your emotional journey over time with smart pattern recognition and trigger analysis.",
            color: "#3b82f6",
            bg: "rgba(59, 130, 246, 0.08)",
        },
        {
            icon: Shield,
            title: "Crisis Detection",
            description: "Real-time sentiment analysis that flags early warning signs and provides immediate safety resources.",
            color: "#ef4444",
            bg: "rgba(239, 68, 68, 0.08)",
        },
        {
            icon: MessageCircle,
            title: "Peer Support Forum",
            description: "A safe, moderated community to share experiences and find strength in shared journeys.",
            color: "#22c55e",
            bg: "rgba(34, 197, 94, 0.08)",
        },
        {
            icon: Heart,
            title: "Wellness Actions",
            description: "Curated daily exercises and mindfulness practices tailored to your current energy levels.",
            color: "#ec4899",
            bg: "rgba(236, 72, 153, 0.08)",
        },
        {
            icon: Users,
            title: "Counselor Connect",
            description: "Seamless bridge to licensed human professionals when specialized intervention is needed.",
            color: "#f59e0b",
            bg: "rgba(245, 158, 11, 0.08)",
        },
    ];

    const steps = [
        { step: "01", title: "Sign Up", description: "Create your anonymous profile in seconds. Your privacy is our priority." },
        { step: "02", title: "Complete Profile", description: "Share your preferences and goals to help our AI tailor the experience to you." },
        { step: "03", title: "Get Support", description: "Access AI chat, mood tracking, resources, and community — all in one place." },
    ];

    const testimonials = [
        {
            quote: "The AI counselor was surprisingly intuitive. It helped me process finals week stress when I felt like I had no one else to talk to at 2 AM.",
            name: "Priya S.",
            role: "Computer Science, Year 3",
            rating: 5,
        },
        {
            quote: "Mood tracking showed me patterns I never noticed. I realized how much my sleep affected my anxiety levels. This tool is a game changer.",
            name: "Alex C.",
            role: "Psychology, Year 2",
            rating: 5,
        },
        {
            quote: "The community forums are so supportive. Knowing I wasn't alone in my struggles made the healing process feel so much faster.",
            name: "Jordan M.",
            role: "Engineering, Year 4",
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#f8f9fd' }}>
            {/* ── Navbar ── */}
            <nav className="fixed top-0 w-full z-50 glass-navbar">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4d41df, #675df9)' }}>
                            <Brain className="h-4.5 w-4.5 text-white" />
                        </div>
                        <span className="text-lg font-bold" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>MindfulSpace</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#464555' }}>
                        <a href="#features" className="hover:text-[#4d41df] transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-[#4d41df] transition-colors">How It Works</a>
                        <a href="#testimonials" className="hover:text-[#4d41df] transition-colors">Testimonials</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setLocation("/login")}
                            className="text-sm font-semibold rounded-full px-5"
                            style={{ color: '#464555' }}
                        >
                            Login
                        </Button>
                        <button
                            onClick={() => setLocation("/login")}
                            className="btn-primary text-sm px-5 py-2.5 hidden sm:inline-flex items-center gap-1.5"
                        >
                            Get Started Free <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="pt-28 pb-20 px-6 relative overflow-hidden">
                {/* Floating blob decorations */}
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-16 right-[15%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'rgba(196, 192, 255, 0.15)' }}
                />
                <motion.div
                    animate={{ y: [0, 25, 0], x: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-[10%] w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'rgba(183, 180, 255, 0.12)' }}
                />

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <div
                            className="pill-badge mx-auto mb-6 w-fit"
                            style={{ background: 'rgba(183, 180, 255, 0.2)', color: '#4d41df' }}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            AI-Powered Mental Health Platform
                        </div>

                        {/* Headline */}
                        <h1
                            className="text-5xl md:text-[4.25rem] leading-[1.1] font-extrabold mb-6"
                            style={{ fontFamily: 'Manrope', color: '#191c1f' }}
                        >
                            Your mind deserves
                            <span className="block mt-1" style={{ background: 'linear-gradient(135deg, #4d41df, #675df9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                a guardian
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#464555' }}>
                            MindfulSpace uses AI to detect early signs of mental health challenges —
                            providing real-time support, personalized wellness actions, and timely intervention before a crisis occurs.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <button
                                onClick={() => setLocation("/login")}
                                className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2"
                            >
                                Start Your Journey <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                                className="btn-secondary text-base px-8 py-3.5"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                            {[
                                { value: "10,000+", label: "Students Protected" },
                                { value: "95%", label: "Feel Supported" },
                                { value: "50+", label: "Partner Institutions" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: 'Manrope', color: '#4d41df' }}>{stat.value}</p>
                                    <p className="text-xs md:text-sm font-medium mt-1" style={{ color: '#777587' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section id="features" className="py-20 px-6" style={{ background: '#f2f3f7' }}>
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>
                            Holistic support for every state of mind
                        </h2>
                        <p className="max-w-xl mx-auto text-base" style={{ color: '#464555' }}>
                            Comprehensive tools that adapt to your unique emotional needs, providing clarity when you need it most.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="glass-card p-7 group cursor-default"
                            >
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                                    style={{ background: feature.bg }}
                                >
                                    <feature.icon className="h-5.5 w-5.5" style={{ color: feature.color }} />
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>{feature.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#464555' }}>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="py-20 px-6" style={{ background: '#f8f9fd' }}>
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>
                            Simple steps to peace of mind
                        </h2>
                        <p style={{ color: '#464555' }}>Get started in minutes and begin your personalized mental wellness journey.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5" style={{ background: 'rgba(199, 196, 216, 0.3)' }} />

                        {steps.map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="text-center relative"
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-xl font-extrabold relative z-10"
                                    style={{
                                        fontFamily: 'Manrope',
                                        background: i === 2 ? 'linear-gradient(135deg, #4d41df, #675df9)' : '#f2f3f7',
                                        color: i === 2 ? '#fff' : '#4d41df',
                                    }}
                                >
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>{item.title}</h3>
                                <p className="text-sm" style={{ color: '#464555' }}>{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section id="testimonials" className="py-20 px-6" style={{ background: '#f2f3f7' }}>
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>
                            Voices of resilience
                        </h2>
                        <p style={{ color: '#464555' }}>Hear from students who found their anchor with MindfulSpace.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="glass-card p-7"
                            >
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: '#464555' }}>
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                        style={{ background: 'linear-gradient(135deg, #4d41df, #675df9)' }}
                                    >
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: '#191c1f' }}>{t.name}</p>
                                        <p className="text-xs" style={{ color: '#777587' }}>{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #4d41df 0%, #675df9 100%)' }}>
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'Manrope' }}>
                        Your Mental Health Matters.
                        <br />
                        Start Today — It's Free.
                    </h2>
                    <p className="text-base mb-8" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                        Join thousands of others who have taken the first step toward a more mindful and resilient life.
                    </p>
                    <button
                        onClick={() => setLocation("/login")}
                        className="inline-flex items-center gap-2 text-base font-semibold px-8 py-3.5 rounded-full transition-all hover:translate-y-[-2px] hover:shadow-lg"
                        style={{ background: '#ffffff', color: '#4d41df' }}
                    >
                        Create Free Account <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-10 px-6" style={{ background: '#f8f9fd' }}>
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4d41df, #675df9)' }}>
                                <Brain className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="text-sm font-bold" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>MindfulSpace</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm" style={{ color: '#777587' }}>
                            <a href="#features" className="hover:text-[#4d41df] transition-colors">Features</a>
                            <a href="#" className="hover:text-[#4d41df] transition-colors">Privacy</a>
                            <a href="#" className="hover:text-[#4d41df] transition-colors">Terms</a>
                            <a href="#" className="hover:text-[#4d41df] transition-colors">Contact</a>
                        </div>
                        <p className="text-xs" style={{ color: '#777587' }}>© 2026 MindfulSpace. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
