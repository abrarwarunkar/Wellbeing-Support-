import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useAppointments } from "@/hooks/use-appointments";
import { useMoodEntries } from "@/hooks/use-mood";
import { useResources } from "@/hooks/use-resources";
import { format } from "date-fns";
import {
  Calendar,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Shield,
  Sparkles,
  Loader2,
  Flame,
  MessageSquare,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

import AdminDashboard from "./admin/AdminDashboard";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function Dashboard() {
  const { user }                        = useAuth();
  const { data: appointments }          = useAppointments();
  const { data: moodData }              = useMoodEntries();
  const { data: resources }             = useResources();
  const moodEntries = (moodData as any)?.entries ?? (Array.isArray(moodData) ? moodData : []);

  const { data: aiRecs, isLoading: loadingRecs } = useQuery<any[]>({
    queryKey: ["/api/ai/recommendations"],
    enabled: !!user && user.role !== "admin",
  });

  if (user?.role === "admin") {
    return (
      <motion.div variants={container} initial="hidden" animate="show">
        <AdminDashboard />
      </motion.div>
    );
  }

  const nextAppointment = appointments?.find((a) => new Date(a.date) > new Date());
  const recentMood      = moodEntries?.[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    {
      icon: Flame,
      label: "Current Streak",
      value: `${moodEntries?.length ?? 0} days`,
      sub: "Keep it up! 🔥",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
    },
    {
      icon: TrendingUp,
      label: "Mood Score",
      value: recentMood ? `${recentMood.score}/5` : "—",
      sub: recentMood ? "Latest entry" : "No entries yet",
      color: "#4d41df",
      bg: "rgba(77,65,223,0.08)",
    },
    {
      icon: Calendar,
      label: "Next Session",
      value: nextAppointment ? format(new Date(nextAppointment.date), "MMM d") : "None",
      sub: nextAppointment ? format(new Date(nextAppointment.date), "h:mm a") : "Book one →",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.08)",
    },
    {
      icon: MessageSquare,
      label: "Total Check-ins",
      value: String(moodEntries?.length ?? 0),
      sub: "Mood entries logged",
      color: "#ec4899",
      bg: "rgba(236,72,153,0.08)",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* ── Greeting ── */}
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
          {greeting}, {user?.firstName || "there"} 👋
        </h1>
        <p className="text-base" style={{ color: "#777587" }}>How are you feeling today?</p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            variants={cardVariants}
            className="glass-card p-5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: s.bg }}
            >
              <s.icon className="h-5 w-5" style={{ color: s.color }} />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: "#777587" }}>{s.label}</p>
            <p className="text-2xl font-extrabold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "#777587" }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Middle Row ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Mood History */}
        <motion.div variants={cardVariants} className="glass-card p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
              Recent Mood Entries
            </h2>
            <Link href="/mood">
              <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#4d41df" }}>
                Log mood <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {moodEntries && moodEntries.length > 0 ? (
            <div className="space-y-3">
              {moodEntries.slice(0, 4).map((entry: any) => {
                const scoreColor =
                  entry.score >= 4 ? "#22c55e" : entry.score <= 2 ? "#ef4444" : "#f59e0b";
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-3 rounded-2xl transition-all"
                    style={{ background: "#f2f3f7" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0"
                      style={{ background: `${scoreColor}18`, color: scoreColor, fontFamily: "Manrope" }}
                    >
                      {entry.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#191c1f" }}>
                        {entry.note || "No note added"}
                      </p>
                      <p className="text-xs" style={{ color: "#777587" }}>
                        {format(new Date(entry.createdAt!), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: scoreColor }} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center" style={{ color: "#777587" }}>
              <TrendingUp className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No mood entries yet</p>
              <Link href="/mood">
                <span className="text-xs font-semibold mt-2 hover:underline" style={{ color: "#4d41df" }}>
                  Start tracking →
                </span>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={cardVariants} className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
              Upcoming Sessions
            </h2>
            <Link href="/appointments">
              <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#4d41df" }}>
                View all <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {appointments && appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 2).map((appt: any) => (
                <div
                  key={appt.id}
                  className="p-4 rounded-2xl"
                  style={{ background: "#f2f3f7" }}
                >
                  <p className="text-sm font-bold mb-1" style={{ color: "#191c1f" }}>
                    {appt.counselor?.firstName
                      ? `Dr. ${appt.counselor.firstName} ${appt.counselor.lastName || ""}`
                      : "Counselor Session"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "#777587" }}>
                    <Clock className="h-3 w-3" />
                    {format(new Date(appt.date), "MMM d, h:mm a")}
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                    style={{
                      background: appt.status === "confirmed" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                      color: appt.status === "confirmed" ? "#22c55e" : "#f59e0b",
                    }}
                  >
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center" style={{ color: "#777587" }}>
              <Calendar className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No upcoming sessions</p>
              <Link href="/appointments">
                <span className="text-xs font-semibold mt-2 hover:underline" style={{ color: "#4d41df" }}>
                  Book a session →
                </span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Screening CTA ── */}
      <motion.div variants={cardVariants}>
        <div
          className="rounded-3xl p-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #4d41df 0%, #675df9 100%)" }}
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "Manrope" }}>
              How is your mental wellbeing?
            </h2>
            <p className="text-base mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
              Take a quick, confidential assessment to get personalized recommendations.
            </p>
            <Link href="/screening/assessment">
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-all hover:translate-y-[-1px] hover:shadow-lg"
                style={{ background: "#ffffff", color: "#4d41df" }}
              >
                Take Assessment <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
          <Shield className="absolute right-8 bottom-0 h-40 w-40 text-white/10" />
        </div>
      </motion.div>

      {/* ── AI Recommendations ── */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(77,65,223,0.1)" }}>
            <Sparkles className="h-4.5 w-4.5" style={{ color: "#4d41df" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
            AI Personal Insights
          </h2>
        </div>

        {loadingRecs ? (
          <div className="glass-card p-10 flex flex-col items-center justify-center gap-3" style={{ color: "#777587" }}>
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#4d41df" }} />
            <p className="text-sm">Generating your personalized wellness plan...</p>
          </div>
        ) : aiRecs && aiRecs.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {aiRecs.map((action: any, i: number) => (
              <div
                key={i}
                className="glass-card p-6"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4"
                  style={{ background: "linear-gradient(135deg, #4d41df, #675df9)" }}
                >
                  {i + 1}
                </div>
                <h4 className="font-bold mb-2 text-sm" style={{ color: "#191c1f" }}>{action.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "#464555" }}>{action.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center" style={{ color: "#777587" }}>
            <p className="text-sm">Complete a mood check-in to get AI suggestions.</p>
            <Link href="/mood">
              <span className="text-xs font-semibold mt-2 inline-block hover:underline" style={{ color: "#4d41df" }}>
                Log your mood →
              </span>
            </Link>
          </div>
        )}
      </motion.div>

      {/* ── Resources ── */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
            Resources For You
          </h2>
          <Link href="/resources">
            <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#4d41df" }}>
              View all <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources?.slice(0, 3).map((resource) => (
            <div key={resource.id} className="glass-card p-5">
              <span
                className="pill-badge text-xs mb-3 inline-flex"
                style={{ background: "rgba(77,65,223,0.08)", color: "#4d41df" }}
              >
                {resource.category}
              </span>
              <h3 className="text-sm font-bold mb-2" style={{ color: "#191c1f" }}>{resource.title}</h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "#464555" }}>
                {resource.description}
              </p>
              <a
                href={resource.content}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold flex items-center gap-1 hover:underline"
                style={{ color: "#4d41df" }}
              >
                Read now <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
          {!resources?.length && (
            <div className="col-span-3 glass-card p-8 text-center" style={{ color: "#777587" }}>
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Resources loading or unavailable...</p>
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}
