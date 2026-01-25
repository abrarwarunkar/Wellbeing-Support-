import { OnboardingLayout } from "./Layout";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, HeartHandshake, Shield, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
    {
        id: "student",
        title: "Student",
        description: "Access counseling, resources, and peer support.",
        icon: GraduationCap,
    },
    {
        id: "counselor",
        title: "Counselor",
        description: "Provide support, manage appointments, and guide students.",
        icon: HeartHandshake,
    },
    {
        id: "partner",
        title: "Partner Agency",
        description: "Collaborate on student wellbeing initiatives.",
        icon: UserCog,
    },
    // Admin is usually pre-assigned, but listed for demo or specific flows
    {
        id: "admin",
        title: "Administrator",
        description: "Manage system settings and user access.",
        icon: Shield,
    },
];

export default function RoleSelection() {
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: async (role: string) => {
            const res = await fetch("/api/onboarding/role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            if (!res.ok) throw new Error("Failed to select role");
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/user"], data.user);
            toast({ title: "Role Selected" });
        },
    });

    return (
        <OnboardingLayout
            currentStep={1}
            totalSteps={5}
            title="Select Your Role"
            description="Choose the role that best describes you to personalize your experience."
        >
            <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                        <Card
                            key={role.id}
                            className={cn(
                                "cursor-pointer transition-all hover:border-primary hover:bg-slate-50",
                                mutation.isPending && "opacity-50 pointer-events-none"
                            )}
                            onClick={() => mutation.mutate(role.id)}
                        >
                            <CardContent className="p-6 flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{role.title}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </OnboardingLayout>
    );
}
