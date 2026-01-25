import { useAppointments } from "@/hooks/use-appointments";
import { format } from "date-fns";
import {
    Calendar, Clock, Video, User as UserIcon, MessageSquare,
    FileText, AlertTriangle, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/Loader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CounselorDashboard() {
    const { data: appointments, isLoading } = useAppointments();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const res = await apiRequest("PATCH", `/api/appointments/${id}`, { status });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
            toast({ title: "Appointment updated" });
        },
        onError: () => {
            toast({ title: "Update failed", variant: "destructive" });
        }
    });

    if (isLoading) return <Loader />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Counselor Portal</h1>
                <p className="text-muted-foreground">Manage your caseload and clinical sessions.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="text-primary" />
                            Upcoming Sessions
                        </CardTitle>
                        <CardDescription>
                            Your scheduled appointments for the week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {appointments?.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No appointments scheduled.</p>
                            ) : (
                                appointments?.map((apt: any) => (
                                    <div
                                        key={apt.id}
                                        className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg transition-colors hover:bg-slate-50 ${apt.student?.latestRiskLevel === 'severe' ? 'border-l-4 border-l-red-500 bg-red-50/50' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`p-3 rounded-full h-fit ${apt.student?.latestRiskLevel === 'severe' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <UserIcon size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-lg">
                                                        {apt.student ? `${apt.student.firstName} ${apt.student.lastName}` : "Unknown Student"}
                                                    </h4>
                                                    {apt.student?.latestRiskLevel === 'severe' && (
                                                        <Badge variant="destructive" className="flex items-center gap-1">
                                                            <AlertTriangle size={10} /> Severe Risk
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {format(new Date(apt.date), "MMM d, yyyy")}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {format(new Date(apt.date), "h:mm a")}
                                                    </span>
                                                    <span className="flex items-center gap-1 border px-1 rounded bg-white">
                                                        {apt.type}
                                                    </span>
                                                </div>
                                                {/* Show email for debugging/info if no button */}
                                                {!apt.student?.email && <p className="text-xs text-red-400">No email on file</p>}
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                                            <div className="flex gap-2 items-center">
                                                <Badge variant={apt.status === 'confirmed' ? 'default' : apt.status === 'cancelled' ? 'destructive' : 'secondary'} className="capitalize">
                                                    {apt.status}
                                                </Badge>

                                                {apt.status === 'pending' && (
                                                    <>
                                                        <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 h-7 text-xs" onClick={() => statusMutation.mutate({ id: apt.id, status: 'confirmed' })}>
                                                            Confirm
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs" onClick={() => statusMutation.mutate({ id: apt.id, status: 'cancelled' })}>
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {/* Actions */}
                                                {apt.type === 'online' && apt.status === 'confirmed' && (
                                                    <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => window.alert('Join functionality requires a video provider integration.')}>
                                                        <Video size={16} /> Join
                                                    </Button>
                                                )}

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="gap-2"
                                                    disabled={!apt.student?.email}
                                                    onClick={() => apt.student?.email && window.open(`mailto:${apt.student.email}`)}
                                                >
                                                    <MessageSquare size={16} /> {apt.student?.email ? 'Email' : 'No Email'}
                                                </Button>

                                                <NotesDialog appointment={apt} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function NotesDialog({ appointment }: { appointment: any }) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState(appointment.notes || "");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: async (newNotes: string) => {
            const res = await apiRequest("PATCH", `/api/appointments/${appointment.id}`, { notes: newNotes });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
            toast({ title: "Clinical notes updated" });
            setOpen(false);
        },
        onError: () => {
            toast({ title: "Failed to save notes", variant: "destructive" });
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <FileText size={16} /> Clinical Notes
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Session Notes</DialogTitle>
                    <DialogDescription>
                        Private clinical notes for {appointment.student?.firstName} {appointment.student?.lastName}.
                        Only visible to you and administrators.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        placeholder="Enter SOAP notes, observations, or action items..."
                        className="h-[200px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => updateMutation.mutate(notes)} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Saving..." : "Save Notes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
