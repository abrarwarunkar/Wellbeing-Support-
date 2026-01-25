import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OnboardingLayout } from "./Layout";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

const formSchema = z.object({
    code: z.string().min(6, {
        message: "Your OTP code must be 6 characters.",
    }),
});

export default function Identity() {
    const { toast } = useToast();
    // Ensure user data is fresh
    const { user } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const res = await fetch("/api/onboarding/verify-identity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                const text = await res.text();
                console.error("Verification failed:", res.status, text);
                throw new Error(text || "Invalid verification code");
            }
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/user"], data.user);
            toast({ title: "Identity Verified!" });
        },
        onError: (err) => {
            console.error("Mutation error:", err);
            toast({
                title: "Verification Failed",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <OnboardingLayout
            currentStep={0}
            totalSteps={5}
            title="Verify Your Identity"
            description="We've sent a 6-digit code to your email. Please enter it below."
        >
            <div className="flex flex-col items-center justify-center py-6 text-center mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">Authentication Required</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1">
                    For demo purposes, the code is <strong>123456</strong>
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456" {...field} className="text-center text-lg tracking-widest" maxLength={6} />
                                </FormControl>
                                <FormDescription>
                                    Please enter the 6-digit code sent to your device.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? "Verifying..." : "Verify Identity"}
                    </Button>
                </form>
            </Form>

        </OnboardingLayout>
    );
}
