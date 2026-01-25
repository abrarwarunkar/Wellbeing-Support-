import { OnboardingLayout } from "./Layout";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Review() {
    const { user } = useAuth();

    // This is just a waiting screen.
    // In a real verification, we'd poll for status or use websockets.
    const isApproved = user?.onboardingStatus === 'active';

    return (
        <OnboardingLayout
            currentStep={4}
            totalSteps={5}
            title={isApproved ? "Approved!" : "Under Review"}
            description={isApproved ? "You're all set." : "Our team is reviewing your documents."}
        >
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                {isApproved ? (
                    <CheckCircle2 className="h-20 w-20 text-green-500" />
                ) : (
                    <Clock className="h-20 w-20 text-orange-400 animate-pulse" />
                )}

                <div className="max-w-md space-y-2">
                    <h2 className="text-2xl font-bold">{isApproved ? "Welcome Aboard!" : "Submission Received"}</h2>
                    <p className="text-slate-500">
                        {isApproved
                            ? "Your account has been fully verified. You can now access all features."
                            : "Thank you for submitting your documents. We usually process applications within 2-3 business days."}
                    </p>
                </div>

                {isApproved ? (
                    <Button onClick={() => window.location.href = "/"} className="w-full max-w-sm">
                        Go to Dashboard
                    </Button>
                ) : (
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm max-w-sm">
                        An admin can verify you now by using the API or database directly.
                        (For this demo, ask the Developer to run the approval command).
                    </div>
                )}
            </div>
        </OnboardingLayout>
    );
}
