import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  MessageSquareHeart, 
  CalendarClock, 
  BookOpen, 
  Users, 
  Smile, 
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/chat", icon: MessageSquareHeart, label: "Chat Support" },
    { href: "/appointments", icon: CalendarClock, label: "Appointments" },
    { href: "/resources", icon: BookOpen, label: "Resources" },
    { href: "/forum", icon: Users, label: "Peer Support" },
    { href: "/mood", icon: Smile, label: "Mood Tracker" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white shadow-md rounded-full"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence>
        {(isMobileOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`
              fixed lg:relative z-40 h-full w-72 
              bg-white/80 backdrop-blur-xl border-r border-slate-100 shadow-2xl lg:shadow-none
              flex flex-col
              ${isMobileOpen ? "block" : "hidden lg:flex"}
            `}
          >
            <div className="p-8 pb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MindfulSpace
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Wellness Companion</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-6 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}>
                    <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-slate-400 group-hover:text-primary transition-colors"}`} />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 m-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate text-slate-800">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
