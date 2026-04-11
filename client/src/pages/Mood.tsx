import { useMoodEntries, useCreateMoodEntry } from "@/hooks/use-mood";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Smile, Frown, Meh, Save, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Mood() {
  const { data: moodData, isLoading } = useMoodEntries();
  const entries = (moodData as any)?.entries ?? (Array.isArray(moodData) ? moodData : []);
  const createMutation = useCreateMoodEntry();
  const { user } = useAuth();
  const { toast } = useToast();

  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        score,
        note,
        userId: "session", // Server overrides this with the actual session user ID
      });
      toast({ title: "Mood saved! ✓", description: `Feeling ${moodLabels[score]} has been logged.` });
      setNote("");
      setScore(3);
    } catch (err: any) {
      toast({ title: "Failed to save mood", description: err?.message || "Please try again.", variant: "destructive" });
    }
  };

  if (isLoading) return <Loader />;

  const chartData = entries
    ? [...entries].reverse().map((e: any) => ({
        date: format(new Date(e.createdAt!), "MMM d"),
        score: e.score,
      }))
    : [];

  const moodEmoji = (val: number) => {
    if (val >= 4) return { icon: Smile, color: "#22c55e", label: "Great" };
    if (val <= 2) return { icon: Frown, color: "#ef4444", label: "Low" };
    return { icon: Meh, color: "#f59e0b", label: "Okay" };
  };
  const mood = moodEmoji(score);

  const moodLabels: Record<number, string> = { 1: "Awful", 2: "Bad", 3: "Okay", 4: "Good", 5: "Great" };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-1" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
          Mood Tracker
        </h1>
        <p className="text-base" style={{ color: "#777587" }}>
          Reflect on how you feel and spot patterns over time.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Chart + History */}
        <div className="lg:col-span-2 space-y-6">

          {/* Chart */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5" style={{ color: "#4d41df" }} />
              <h2 className="text-lg font-bold" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
                Mood History
              </h2>
            </div>

            <div className="h-56">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4d41df" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#4d41df" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(199,196,216,0.3)" />
                    <XAxis
                      dataKey="date"
                      stroke="#777587"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                      stroke="#777587"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 8px 32px rgba(25,28,31,0.08)",
                        fontSize: "12px",
                        fontFamily: "Inter",
                      }}
                      formatter={(value: any) => [moodLabels[value] || value, "Mood"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#4d41df"
                      strokeWidth={2.5}
                      fill="url(#moodGradient)"
                      dot={{ r: 4, fill: "#4d41df", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full" style={{ color: "#777587" }}>
                  <p className="text-sm">No data yet. Start tracking below!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Entries */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold mb-4" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
              Recent Entries
            </h3>
            {entries?.length > 0 ? (
              <div className="space-y-3">
                {entries.slice(0, 6).map((entry: any) => {
                  const em = moodEmoji(entry.score);
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-3 rounded-2xl"
                      style={{ background: "#f2f3f7" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold flex-shrink-0"
                        style={{ background: `${em.color}18`, color: em.color, fontFamily: "Manrope" }}
                      >
                        {entry.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "#191c1f" }}>
                          {entry.note || "No note added"}
                        </p>
                        <p className="text-xs" style={{ color: "#777587" }}>
                          {format(new Date(entry.createdAt!), "PPpp")}
                        </p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: `${em.color}18`, color: em.color }}
                      >
                        {em.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: "#777587" }}>
                <p className="text-sm">No entries yet. Log your first mood!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Check-in form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "Manrope", color: "#191c1f" }}>
              Check In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood icon */}
              <div className="flex flex-col items-center py-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
                  style={{ background: `${mood.color}18` }}
                >
                  <mood.icon className="h-10 w-10" style={{ color: mood.color }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: mood.color }}>
                  Feeling {mood.label}
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <label className="text-sm font-semibold block text-center" style={{ color: "#464555" }}>
                  How are you feeling? ({score}/5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: "#4d41df", background: `rgba(77,65,223,0.15)` }}
                />
                <div className="flex justify-between text-xs font-medium" style={{ color: "#777587" }}>
                  {["Awful", "Bad", "Okay", "Good", "Great"].map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-sm font-semibold block" style={{ color: "#464555" }}>
                  Note <span style={{ color: "#777587", fontWeight: 400 }}>(Optional)</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition-all border"
                  style={{
                    background: "#f2f3f7",
                    border: "1.5px solid rgba(199,196,216,0.35)",
                    color: "#191c1f",
                    height: "100px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#4d41df";
                    e.target.style.boxShadow = "0 0 0 3px rgba(77,65,223,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(199,196,216,0.35)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="What made you feel this way?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                {createMutation.isPending ? "Saving..." : "Save Entry"}
                <Save className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
