import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Star, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "counselor"]).optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Login() {
  const { login, register } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", password: "", role: "student" },
  });

  const onSubmit = async (data: AuthFormData, isRegister: boolean) => {
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register({ ...data, role: data.role || "student" });
      } else {
        await login(data);
      }
      setLocation("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = form.watch("role");

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f9fd' }}>
      {/* ── Left Brand Panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[55%] relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4d41df 0%, #675df9 100%)' }}
      >
        {/* Blob decorations */}
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[120px] left-[-60px] w-64 h-64 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[10%] w-32 h-32 rounded-full"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Manrope' }}>MindfulSpace</span>
        </div>

        {/* Central Content */}
        <div className="relative z-10 max-w-md">
          <div
            className="pill-badge mb-6 w-fit"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            ✨ Trusted by 10,000+ students
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: 'Manrope' }}>
            Your mental health journey starts here
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
            AI-powered support, mood tracking, and personalized wellness — all in one safe space.
          </p>
          <div className="space-y-3">
            {[
              "24/7 AI Counselor Chat",
              "Real-time Crisis Detection",
              "Peer Support Community",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.85)' }} />
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            ))}
          </div>
          <p className="text-sm italic leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
            "MindfulSpace helped me manage my exam anxiety when I felt like I had no one to talk to. The AI counselor is surprisingly empathetic and always there."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-white">Alex Chen</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Computer Science, Year 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Auth Form ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4d41df, #675df9)' }}>
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>MindfulSpace</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-0 p-1 rounded-full mb-8 w-fit" style={{ background: '#f2f3f7' }}>
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-200"
                style={{
                  background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#4d41df' : '#777587',
                  boxShadow: tab === t ? '0 2px 8px rgba(25,28,31,0.06)' : 'none',
                }}
              >
                {t === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>
                  Welcome back 👋
                </h2>
                <p className="text-sm mb-7" style={{ color: '#777587' }}>
                  Please enter your details to continue your journey.
                </p>

                <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium" style={{ color: '#464555' }}>Username or Email</Label>
                    <Input
                      id="username"
                      placeholder="name@university.edu"
                      {...form.register("username")}
                      className="rounded-full px-5 h-11 text-sm border"
                      style={{ borderColor: 'rgba(199,196,216,0.4)', background: '#fff' }}
                    />
                    {form.formState.errors.username && (
                      <p className="text-xs text-red-500 pl-2">{form.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium" style={{ color: '#464555' }}>Password</Label>
                      <a href="#" className="text-xs font-medium hover:underline" style={{ color: '#4d41df' }}>
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        className="rounded-full px-5 h-11 text-sm border pr-12"
                        style={{ borderColor: 'rgba(199,196,216,0.4)', background: '#fff' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: '#777587' }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="text-xs text-red-500 pl-2">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 text-sm mt-2"
                  >
                    {isSubmitting ? "Signing in..." : "Login"}
                  </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px" style={{ background: 'rgba(199,196,216,0.4)' }} />
                  <span className="text-xs" style={{ color: '#777587' }}>or continue with</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(199,196,216,0.4)' }} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Google", icon: "G" },
                    { label: "Apple", icon: "🍎" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      className="btn-secondary py-2.5 text-sm flex items-center justify-center gap-2"
                      style={{ color: '#191c1f', borderColor: 'rgba(199,196,216,0.4)' }}
                    >
                      <span className="font-bold">{s.icon}</span> {s.label}
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm mt-6" style={{ color: '#777587' }}>
                  Don't have an account?{" "}
                  <button onClick={() => setTab("register")} className="font-semibold hover:underline" style={{ color: '#4d41df' }}>
                    Sign up
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: 'Manrope', color: '#191c1f' }}>
                  Create your account 🌱
                </h2>
                <p className="text-sm mb-7" style={{ color: '#777587' }}>
                  Start your wellbeing journey in seconds. It's free.
                </p>

                <form onSubmit={form.handleSubmit((data) => onSubmit(data, true))} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium" style={{ color: '#464555' }}>Username</Label>
                    <Input
                      id="reg-username"
                      placeholder="your_username"
                      {...form.register("username")}
                      className="rounded-full px-5 h-11 text-sm border"
                      style={{ borderColor: 'rgba(199,196,216,0.4)', background: '#fff' }}
                    />
                    {form.formState.errors.username && (
                      <p className="text-xs text-red-500 pl-2">{form.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium" style={{ color: '#464555' }}>Password</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        className="rounded-full px-5 h-11 text-sm border pr-12"
                        style={{ borderColor: 'rgba(199,196,216,0.4)', background: '#fff' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: '#777587' }}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: '#464555' }}>I am a...</Label>
                    <div className="flex gap-2">
                      {(["student", "counselor"] as const).map((r) => (
                        <label
                          key={r}
                          className="flex-1 flex items-center justify-center py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all capitalize border"
                          style={{
                            background: selectedRole === r ? 'linear-gradient(135deg, #4d41df, #675df9)' : '#fff',
                            color: selectedRole === r ? '#fff' : '#777587',
                            borderColor: selectedRole === r ? 'transparent' : 'rgba(199,196,216,0.4)',
                          }}
                        >
                          <input type="radio" value={r} className="sr-only" {...form.register("role")} />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 text-sm mt-2"
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </button>
                </form>

                <p className="text-center text-sm mt-6" style={{ color: '#777587' }}>
                  Already have an account?{" "}
                  <button onClick={() => setTab("login")} className="font-semibold hover:underline" style={{ color: '#4d41df' }}>
                    Login
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock className="h-3.5 w-3.5" style={{ color: '#777587' }} />
            <p className="text-xs" style={{ color: '#777587' }}>Your data is encrypted and secure</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
