import { useState } from "react";
import { useAppointments, useCreateAppointment } from "@/hooks/use-appointments";
import { format } from "date-fns";
import { Calendar, Clock, Video, MapPin, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/Loader";
import * as Dialog from "@radix-ui/react-dialog";

export default function Appointments() {
  const { data: appointments, isLoading } = useAppointments();
  const createMutation = useCreateAppointment();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    type: "online" as "online" | "in-person",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return;

    // Combine date and time
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    await createMutation.mutateAsync({
      date: dateTime.toISOString(),
      type: formData.type,
      notes: formData.notes,
      studentId: "user-id-placeholder", // In real app, backend infers this from session
      status: "pending"
    });
    setIsOpen(false);
    setFormData({ date: "", time: "", type: "online", notes: "" });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Your Appointments</h1>
          <p className="text-muted-foreground mt-2">Manage your therapy sessions and check-ins.</p>
        </div>
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <Button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              New Appointment
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-xl font-bold text-slate-800">Book a Session</Dialog.Title>
                <Dialog.Close className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </Dialog.Close>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Time</label>
                    <input 
                      type="time" 
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Session Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: "online"})}
                      className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${formData.type === "online" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      Online Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: "in-person"})}
                      className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${formData.type === "in-person" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      In-Person
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Notes (Optional)</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none"
                    placeholder="Anything specific you'd like to discuss?"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {appointments?.map((apt) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-xl">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {format(new Date(apt.date), "EEEE, MMMM do, yyyy")}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {format(new Date(apt.date), "h:mm a")}
                    </span>
                    <span className="flex items-center gap-1">
                      {apt.type === "online" ? <Video size={16} /> : <MapPin size={16} />}
                      {apt.type === "online" ? "Video Call" : "Campus Office"}
                    </span>
                  </div>
                  {apt.notes && <p className="mt-2 text-sm text-slate-500 italic">"{apt.notes}"</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                  ${apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                  ${apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {apt.status}
                </span>
                {apt.status !== 'cancelled' && (
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20">
                    Cancel
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {appointments?.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">No appointments yet</h3>
            <p className="text-muted-foreground">Book your first session to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
