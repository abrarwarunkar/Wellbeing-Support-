
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

const questions = [
    { id: "q1", text: "Little interest or pleasure in doing things?" },
    { id: "q2", text: "Feeling down, depressed, or hopeless?" },
    { id: "q3", text: "Trouble falling or staying asleep, or sleeping too much?" },
    { id: "q4", text: "Feeling tired or having little energy?" },
    { id: "q5", text: "Poor appetite or overeating?" },
    { id: "q6", text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down?" },
    { id: "q7", text: "Trouble concentrating on things, such as reading the newspaper or watching television?" },
];

const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
];

export default function Assessment() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/screening/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: data }),
            });
            if (!res.ok) throw new Error("Failed to submit");
            return res.json();
        },
        onSuccess: (data) => {
            setResult(data);
            toast({ title: "Assessment Complete" });
        },
        onError: () => {
            toast({ title: "Failed to submit assessment", variant: "destructive" });
        }
    });

    const handleAnswer = (value: number) => {
        const currentQ = questions[step];
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }));

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
        } else {
            mutation.mutate({ ...answers, [currentQ.id]: value });
        }
    };

    if (result) {
        return <ResultView result={result} />;
    }

    const currentQuestion = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Question {step + 1} of {questions.length}
                        </span>
                        <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                    <CardTitle className="mt-6 text-xl leading-relaxed">
                        Over the last 2 weeks, how often have you been bothered by: <br />
                        <span className="text-primary">{currentQuestion.text}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 mt-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid gap-3"
                        >
                            {options.map((opt) => (
                                <Button
                                    key={opt.value}
                                    variant="outline"
                                    className="w-full justify-start h-14 text-lg hover:border-primary hover:bg-primary/5 transition-all"
                                    onClick={() => handleAnswer(opt.value)}
                                    disabled={mutation.isPending}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}

function ResultView({ result }: { result: any }) {
    const isSevere = result.riskLevel === 'severe';
    const isModerate = result.riskLevel === 'moderate';

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 bg-slate-100 p-4 rounded-full inline-block">
                        {isSevere ? (
                            <AlertTriangle className="h-12 w-12 text-red-500" />
                        ) : (
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">Assessment Complete</CardTitle>
                    <CardDescription>
                        Your result indicates <strong className="uppercase">{result.riskLevel}</strong> risk level.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-lg border text-left">
                        {result.aiAnalysis ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                    <Sparkles className="h-5 w-5" />
                                    AI Insight
                                </div>
                                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {result.aiAnalysis}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-600 text-center">
                                {isSevere
                                    ? "It seems you are going through a tough time. We strongly recommend speaking with a counselor."
                                    : isModerate
                                        ? "You might be experiencing some stress. Consider exploring our resources or chatting with a peer."
                                        : "You are doing well! Keep up the good habits."}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-3">
                        {isSevere && (
                            <Link href="/appointments">
                                <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 gap-2">
                                    Book a Counselor Immediately <ArrowRight size={16} />
                                </Button>
                            </Link>
                        )}
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
