import { useMoodEntries, useCreateMoodEntry } from "@/hooks/use-mood";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/Loader";
import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Mood() {
  const { data: entries, isLoading } = useMoodEntries();
  const createMutation = useCreateMoodEntry();
  const { user } = useAuth();
  
  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      score,
      note,
      userId: user?.id || "unknown"
    });
    setNote("");
    setScore(3);
  };

  if (isLoading) return <Loader />;

  // Prepare chart data - reverse to show chronological order left-to-right
  const chartData = entries ? [...entries].reverse().map(e => ({
    date: format(new Date(e.createdAt!), 'MMM d'),
    score: e.score,
    fullDate: format(new Date(e.createdAt!), 'PPpp')
  })) : [];

  const getMoodIcon = (val: number) => {
    if (val >= 4) return <Smile className="text-green-500 w-12 h-12" />;
    if (val <= 2) return <Frown className="text-amber-500 w-12 h-12" />;
    return <Meh className="text-blue-500 w-12 h-12" />;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Mood History</h2>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    ticks={[1, 2, 3, 4, 5]} 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0ea5e9" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data yet. Start tracking below!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-700">Recent Entries</h3>
          {entries?.slice(0, 5).map(entry => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4"
            >
              <div className="bg-slate-50 p-2 rounded-lg font-bold text-lg w-10 h-10 flex items-center justify-center text-primary">
                {entry.score}
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">{entry.note || "No note added"}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(entry.createdAt!), "PPpp")}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Check In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-4 transition-all duration-300 transform scale-110">
              {getMoodIcon(score)}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block text-center">How are you feeling? ({score}/5)</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="1" 
                value={score} 
                onChange={e => setScore(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
                <span>Awful</span>
                <span>Great</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Note (Optional)</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-32 resize-none"
                placeholder="What made you feel this way?"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Save Entry"} <Save size={18} className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
