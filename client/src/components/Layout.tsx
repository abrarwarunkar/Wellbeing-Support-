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
  X,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  let navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/chat",      icon: MessageSquareHeart, label: "AI Chat" },
    { href: "/mood",      icon: Smile,             label: "Mood Check-in" },
    { href: "/appointments", icon: CalendarClock,  label: "Appointments" },
    { href: "/resources", icon: BookOpen,          label: "Resources" },
    { href: "/forum",     icon: Users,             label: "Community Forum" },
  ];

  if (user?.role === "counselor") {
    navItems = [
      { href: "/counselor", icon: LayoutDashboard, label: "Counselor Portal" },
      { href: "/resources", icon: BookOpen,         label: "Resource Library" },
      { href: "/forum",     icon: Users,            label: "Community Forum" },
    ];
  } else if (user?.role === "admin") {
    navItems = [
      { href: "/dashboard", icon: LayoutDashboard, label: "Admin Dashboard" },
    ];
  }

  const userInitial = user?.firstName?.[0] || user?.username?.[0] || user?.email?.[0] || "U";
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.username || "User";
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #4d41df, #675df9)" }}
        >
          <Brain className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-extrabold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
          MindfulSpace
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group"
              style={{
                background: isActive ? "rgba(77,65,223,0.1)" : "transparent",
                color: isActive ? "#4d41df" : "#464555",
              }}
            >
              <item.icon
                className="w-5 h-5 flex-shrink-0 transition-colors"
                style={{ color: isActive ? "#4d41df" : "#777587" }}
              />
              <span className="text-sm font-semibold">{item.label}</span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#4d41df" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="px-3 pb-6 pt-2">
        <div
          className="rounded-2xl p-4"
          style={{ background: "#f2f3f7" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4d41df, #675df9)" }}
            >
              {userInitial.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate" style={{ color: "#191c1f" }}>
                {displayName}
              </p>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "rgba(77,65,223,0.1)", color: "#4d41df" }}
              >
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-red-50 hover:text-red-500"
            style={{ color: "#777587" }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f8f9fd" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r"
        style={{ background: "#ffffff", borderColor: "rgba(199,196,216,0.15)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "rgba(25,28,31,0.3)" }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col"
              style={{ background: "#ffffff" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
        style={{ background: "#ffffff" }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={18} style={{ color: "#191c1f" }} /> : <Menu size={18} style={{ color: "#191c1f" }} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
