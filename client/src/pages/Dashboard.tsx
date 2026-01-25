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
  Activity,
  Shield,
  Sparkles,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import AdminDashboard from "./admin/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: appointments } = useAppointments();
  const { data: moodEntries } = useMoodEntries();
  const { data: resources } = useResources();

  const { data: aiRecs, isLoading: loadingRecs } = useQuery<any[]>({
    queryKey: ["/api/ai/recommendations"],
    enabled: !!user && user.role !== 'admin'
  });

  if (user?.role === 'admin') {
    return (
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} initial="hidden" animate="show">
        <AdminDashboard />
      </motion.div>
    );
  }

  const nextAppointment = appointments?.find(a => new Date(a.date) > new Date());
  const recentMood = moodEntries?.[0]; // Assuming sorted by date desc

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome Header */}
      <motion.div variants={item} className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-800 mb-2">
          Good Morning, <span className="text-primary">{user?.firstName || "Friend"}</span>.
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-xl text-muted-foreground">How are you feeling today?</p>
          {user?.role === 'admin' && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield size={12} /> Administrator
            </span>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Next Appointment Card */}
        <motion.div variants={item} className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Upcoming Session
            </h3>
            {nextAppointment ? (
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">
                  {format(new Date(nextAppointment.date), "MMM d")}
                </p>
                <p className="text-xl text-primary font-medium mb-4">
                  {format(new Date(nextAppointment.date), "h:mm a")}
                </p>
                <div className="inline-flex items-center text-sm font-medium text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
                  {nextAppointment.type === 'online' ? 'Video Call' : 'In-Person'}
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-slate-500 mb-4">No upcoming appointments.</p>
                <Link href="/appointments" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                  Book a session <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mood Check-in Card */}
        <motion.div variants={item} className="glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={120} className="text-secondary" />
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center gap-2">
              <TrendingUp className="text-secondary" size={20} />
              Recent Mood
            </h3>
            {recentMood ? (
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-bold text-slate-800">{recentMood.score}</span>
                  <span className="text-xl text-muted-foreground mb-2">/ 5</span>
                </div>
                <p className="text-slate-500 italic truncate max-w-[200px]">"{recentMood.note || 'No note added'}"</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Last checked: {format(new Date(recentMood.createdAt!), "MMM d, h:mm a")}
                </p>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-slate-500 mb-4">Haven't checked in yet?</p>
                <Link href="/mood" className="text-secondary font-bold hover:underline inline-flex items-center gap-1">
                  Log your mood <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Resource Highlight */}
        <motion.div variants={item} className="glass-card p-6 relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-500" size={20} />
            Daily Wisdom
          </h3>
          <blockquote className="text-xl font-serif italic text-slate-700 leading-relaxed mb-4">
            "The greatest weapon against stress is our ability to choose one thought over another."
          </blockquote>
          <p className="text-sm font-bold text-slate-500">— William James</p>
        </motion.div>
      </div>

      {/* Screening CTA */}
      <motion.div variants={item} className="mt-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">How is your mental wellbeing?</h2>
            <p className="text-indigo-100 mb-6 text-lg">
              Take a quick, confidential assessment to get personalized recommendations and understand your risk level.
            </p>
            <Link href="/screening/assessment">
              <Button size="lg" variant="secondary" className="gap-2 font-bold text-indigo-700">
                Take Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Activity className="absolute right-0 bottom-0 text-white/10 h-64 w-64 -mr-16 -mb-16" />
        </div>
      </motion.div>



      {/* AI Powered Recommendations */}
      <motion.div variants={item} className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">AI Personal Insights</h2>
        </div>

        {loadingRecs ? (
          <div className="p-8 text-center text-muted-foreground bg-white rounded-xl border border-dashed">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            Generating your personalized wellness plan...
          </div>
        ) : aiRecs && aiRecs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecs.map((action: any, i: number) => (
              <div key={i} className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm hover:translate-y-[-2px] transition-transform">
                <div className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                  {i + 1}
                </div>
                <h4 className="font-bold text-indigo-900 mb-2 truncate">{action.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                <div className="h-1 w-12 bg-indigo-200 rounded-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Complete a mood check-in to get AI suggestions.</p>
        )}
      </motion.div>

      {/* Standard Recommended Resources (Keep below) */}
      <motion.div variants={item} className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recommended For You</h2>
          <Link href="/resources" className="text-primary font-semibold hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources?.slice(0, 2).map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {resource.category}
                </span>
                <span className="text-slate-400 text-xs uppercase font-bold">{resource.type}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{resource.title}</h3>
              <p className="text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>
              <a
                href={resource.content}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold text-sm hover:underline"
              >
                Read Now →
              </a>
            </div>
          ))}
          {!resources?.length && (
            <div className="col-span-2 text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-muted-foreground">Resources loading or unavailable...</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
