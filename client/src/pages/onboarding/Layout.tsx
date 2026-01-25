import { useAuth } from "@/hooks/use-auth";
import { Check, Circle, Loader2 } from "lucide-react";
import { Redirect } from "wouter";

interface OnboardingLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
    title: string;
    description: string;
}

const steps = [
    { id: "role_selection", label: "Role" },
    { id: "profile_setup", label: "Profile" },
];

export function OnboardingLayout({
    children,
    currentStep,
    title,
    description
}: OnboardingLayoutProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Redirect to="/login" />;
    }

    if (user.onboardingStatus === 'active' && user.currentStep === 'completed') {
        return <Redirect to="/" />;
    }

    // Calculate progress percentage
    const progress = ((currentStep) / (steps.length - 1)) * 100;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl text-primary">MindfulSpace</div>
                    <div className="text-sm text-slate-500">Onboarding</div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl grid md:grid-cols-[250px_1fr] gap-8">
                {/* Sidebar Stepper */}
                <aside className="hidden md:block">
                    <nav className="space-y-1">
                        {steps.map((step, index) => {
                            const isCompleted = index < currentStep;
                            const isCurrent = index === currentStep;

                            return (
                                <div key={step.id} className="relative pl-8 py-2">
                                    {/* Line */}
                                    {index !== steps.length - 1 && (
                                        <div className={`absolute left-3.5 top-8 w-px h-full ${isCompleted ? "bg-primary" : "bg-slate-200"
                                            }`} />
                                    )}

                                    {/* Indicator */}
                                    <div className={`absolute left-0 top-2.5 w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 ${isCompleted
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : isCurrent
                                            ? "border-primary bg-white text-primary"
                                            : "border-slate-200 bg-white text-slate-300"
                                        }`}>
                                        {isCompleted ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <span className="text-xs font-medium">{index + 1}</span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div>
                                        <p className={`text-sm font-medium ${isCurrent || isCompleted ? "text-slate-900" : "text-slate-500"
                                            }`}>
                                            {step.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <main>
                    <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                            <p className="text-slate-500 mt-2">{description}</p>
                        </div>

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
