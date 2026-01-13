import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { useMoodEntries } from "@/hooks/use-mood";
import { useResources } from "@/hooks/use-resources";
import { format } from "date-fns";
import { 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  BookOpen, 
  Activity 
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: appointments } = useAppointments();
  const { data: moodEntries } = useMoodEntries();
  const { data: resources } = useResources();

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
        <p className="text-xl text-muted-foreground">How are you feeling today?</p>
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

      {/* Recommended Resources */}
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
