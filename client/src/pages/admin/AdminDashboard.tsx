
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
    Users,
    LayoutDashboard,
    BookOpen,
    MoreHorizontal,
    Search,
    Sparkles,
    Shield,


    Activity,
    Loader2,
    GraduationCap,
    HeartHandshake
} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your organization, users, and content.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="students">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Students
                    </TabsTrigger>
                    <TabsTrigger value="counselors">
                        <HeartHandshake className="mr-2 h-4 w-4" />
                        Counselors
                    </TabsTrigger>
                    <TabsTrigger value="resources">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Resources
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <OverviewTab />
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                    <UsersTab roleFilter="student" />
                </TabsContent>

                <TabsContent value="counselors" className="space-y-4">
                    <UsersTab roleFilter="counselor" />
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                    <div className="flex items-center justify-center p-8 border border-dashed rounded-lg bg-slate-50">
                        <p className="text-muted-foreground">Resource management coming soon.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export interface Stats {
    totalStudents: number;
    totalAppointments: number;
    moodDistribution: { name: number; value: number }[];
    riskDistribution: { name: string | null; value: number }[];
}



function OverviewTab() {
    const { toast } = useToast();
    // Re-use the existing stats endpoint
    const { data: stats } = useQuery<Stats>({
        queryKey: ["/api/admin/stats"],
    });

    const { data: insights, isLoading: loadingInsights } = useQuery<{ summary: string; topConcerns: string[]; recommendation: string }>({
        queryKey: ["/api/admin/insights"],
    });

    useEffect(() => {
        const socket = io({ path: "/api/socket" });

        socket.on("admin_risk_alert", (data) => {
            toast({
                variant: "destructive",
                title: "CRITICAL RISK ALERT",
                description: `User ${data.userId} flagged for severe distress: "${data.reason}". Content: "${data.content}"`,
                duration: 10000,
            });
        });

        return () => { socket.disconnect(); };
    }, []);

    return (
        <div className="space-y-6">
            {/* AI Pulse Report (New ML Feature) */}
            <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="text-yellow-400" />
                        Institutional Pulse (AI Analysis)
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                        Real-time distress analysis of {stats?.totalStudents || 0} students and anonymous posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loadingInsights ? (
                        <div className="flex items-center gap-2 text-slate-400">
                            <Loader2 className="animate-spin" /> Analyzing campus sentiment...
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-yellow-400 mb-1 text-sm uppercase tracking-wider">Executive Summary</h4>
                                <p className="text-lg leading-relaxed font-light">"{insights?.summary}"</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white/10 p-4 rounded-lg">
                                    <h4 className="font-bold text-red-300 mb-2 flex items-center gap-2">
                                        <Shield size={16} /> Top Risk Factors
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                                        {insights?.topConcerns.map((concern, i) => (
                                            <li key={i}>{concern}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white/10 p-4 rounded-lg">
                                    <h4 className="font-bold text-green-300 mb-2 flex items-center gap-2">
                                        <Activity size={16} /> Strategic Recommendation
                                    </h4>
                                    <p className="text-sm text-slate-200">
                                        {insights?.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalAppointments || 0}</div>
                        <p className="text-xs text-muted-foreground">Total sessions booked</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function UsersTab({ roleFilter }: { roleFilter?: string }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ["/api/admin/users"],
    });
    const [search, setSearch] = useState("");

    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error("Failed to update user");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            toast({ title: "User updated successfully" });
        },
        onError: () => {
            toast({ title: "Failed to update user", variant: "destructive" });
        }
    });

    const filteredUsers = users?.filter(user =>
        (user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(search.toLowerCase())) &&
        (!roleFilter || user.role === roleFilter)
    );

    if (isLoading) return <div>Loading users...</div>;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{roleFilter === 'counselor' ? 'Counselors' : roleFilter === 'student' ? 'Students' : 'Users'}</CardTitle>
                        <CardDescription>
                            manage user accounts and permissions.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                className="pl-8 w-[200px] lg:w-[300px]"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button>Add User</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Risk Level</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Joined</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredUsers?.map((user) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex flex-col">
                                            <span>{user.firstName} {user.lastName}</span>
                                            <span className="text-xs text-muted-foreground">{user.email || user.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant="outline" className="capitalize">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {user.latestRiskLevel && (
                                            <Badge
                                                className={
                                                    user.latestRiskLevel === 'severe' ? "bg-red-100 text-red-700 hover:bg-red-100" :
                                                        user.latestRiskLevel === 'moderate' ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" :
                                                            "bg-green-100 text-green-700 hover:bg-green-100"
                                                }
                                            >
                                                {user.latestRiskLevel}
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge
                                            variant={user.onboardingStatus === 'active' ? 'default' : 'secondary'}
                                            className={user.onboardingStatus === 'active' ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                        >
                                            {user.onboardingStatus}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "-"}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    alert(`User ID: ${user.id}\nUsername: ${user.username}`);
                                                }}>
                                                    View details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    const newRole = prompt("Enter new role (student, counselor, admin, partner):", user.role || undefined);
                                                    if (newRole && newRole !== user.role) {
                                                        updateMutation.mutate({ id: user.id, updates: { role: newRole } });
                                                    }
                                                }}>
                                                    Edit Role
                                                </DropdownMenuItem>
                                                {user.onboardingStatus === 'active' ? (
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to deactivate this user?")) {
                                                                updateMutation.mutate({ id: user.id, updates: { onboardingStatus: "inactive" } });
                                                            }
                                                        }}
                                                    >
                                                        Deactivate
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-green-600"
                                                        onClick={() => updateMutation.mutate({ id: user.id, updates: { onboardingStatus: "active" } })}
                                                    >
                                                        Activate
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
