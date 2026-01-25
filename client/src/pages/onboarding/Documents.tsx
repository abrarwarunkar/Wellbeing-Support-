import { OnboardingLayout } from "./Layout";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";
import { useState } from "react";

export default function Documents() {
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);

    const mutation = useMutation({
        mutationFn: async () => {
            if (!file) throw new Error("Please select a file");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "id_proof");

            const res = await fetch("/api/onboarding/documents", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/user"], data.user);
            toast({ title: "Document Uploaded" });
        },
        onError: (err) => {
            toast({
                title: "Upload Failed",
                description: err.message,
                variant: "destructive"
            });
        },
    });

    return (
        <OnboardingLayout
            currentStep={3}
            totalSteps={5}
            title="Upload Documents"
            description="We need to verify your identity before proceeding."
        >
            <div className="space-y-6 max-w-md">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-2">
                            <Upload className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold">Upload ID Proof</h3>
                        <p className="text-sm text-slate-500">
                            Govt ID, Driver's License, or Passport (PDF/Image)
                        </p>

                        <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />

                        <Label
                            htmlFor="file-upload"
                            className="mt-4 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            Select File
                        </Label>
                    </div>
                </div>

                {file && (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-slate-50">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                            Remove
                        </Button>
                    </div>
                )}

                <Button
                    className="w-full"
                    disabled={!file || mutation.isPending}
                    onClick={() => mutation.mutate()}
                >
                    {mutation.isPending ? "Uploading..." : "Submit for Review"}
                </Button>
            </div>
        </OnboardingLayout>
    );
}
