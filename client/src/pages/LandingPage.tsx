import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Brain, MessageCircle, BarChart3, Shield, Heart, Users, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
    const { user, isLoading } = useAuth();
    const [, setLocation] = useLocation();

    // Only redirect fully onboarded users to dashboard
    if (!isLoading && user && (user.onboardingStatus === 'active' || user.onboardingStatus === 'completed')) {
        setLocation("/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold text-slate-900">MindGuardAI</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => setLocation("/login")}>
                            Login
                        </Button>
                        <Button onClick={() => setLocation("/login")}>
                            Get Started <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-50 -z-10" />
                <motion.div
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -z-10"
                />

                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            AI-Powered Proactive Mental Health
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            Your Mind Deserves
                            <span className="text-primary block mt-2">A Guardian</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            MindGuardAI detects early signs of mental health challenges using AI — providing
                            real-time support, personalized wellness actions, and timely intervention before a crisis occurs.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button size="lg" onClick={() => setLocation("/login")} className="text-base px-8 py-6">
                                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => {
                                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                            }} className="text-base px-8 py-6">
                                Learn More
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need for Mental Wellness</h2>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            A comprehensive platform that goes beyond reactive support — we protect your well-being proactively.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Brain,
                                title: "AI Counselor Chat",
                                description: "24/7 empathetic AI support powered by Llama 3.3 — available whenever you need someone to talk to.",
                                color: "text-violet-600 bg-violet-100",
                            },
                            {
                                icon: BarChart3,
                                title: "Mood Tracking",
                                description: "Track your emotional patterns over time with daily mood logging and AI-generated trend analysis.",
                                color: "text-blue-600 bg-blue-100",
                            },
                            {
                                icon: Shield,
                                title: "Crisis Detection",
                                description: "Real-time NLP analysis detects signs of distress and triggers immediate alerts to your support network.",
                                color: "text-red-500 bg-red-100",
                            },
                            {
                                icon: MessageCircle,
                                title: "Peer Support Forum",
                                description: "Connect with others who understand. Share experiences anonymously in a safe, moderated space.",
                                color: "text-green-600 bg-green-100",
                            },
                            {
                                icon: Heart,
                                title: "Wellness Actions",
                                description: "Receive personalized micro-habits and activities tailored to your current emotional state.",
                                color: "text-pink-600 bg-pink-100",
                            },
                            {
                                icon: Users,
                                title: "Counselor Connect",
                                description: "Book appointments with certified counselors and get professional guidance when you need it.",
                                color: "text-amber-600 bg-amber-100",
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-primary/30 transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">Three simple steps to begin your wellness journey</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Sign Up", description: "Create your account and choose your role — student or counselor." },
                            { step: "02", title: "Complete Profile", description: "Tell us about yourself so we can personalize your experience." },
                            { step: "03", title: "Get Support", description: "Access AI chat, mood tracking, resources, and community — all in one place." },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-primary text-white">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold mb-4">Your Mental Health Matters</h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                        Don't wait for a crisis. Start your proactive mental wellness journey today — it's free.
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => setLocation("/login")}
                        className="text-base px-8 py-6"
                    >
                        Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-slate-100 bg-white">
                <div className="container mx-auto flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span>MindGuardAI</span>
                    </div>
                    <p>© 2026 MindGuardAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
