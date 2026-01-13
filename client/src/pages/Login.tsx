import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Side - Hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        {/* Floating circles decoration */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-display tracking-tight">MindfulSpace</h1>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold font-display mb-6 leading-tight">
            Find calm in the chaos.
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Your personal sanctuary for mental wellness. Connect with counselors, track your journey, and find support whenever you need it.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © 2024 MindfulSpace. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please sign in to continue your journey.</p>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full h-12 text-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
              onClick={() => window.location.href = "/api/login"}
            >
              Log in with Replit
            </Button>
            
            <p className="text-center text-sm text-slate-400 mt-8">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
