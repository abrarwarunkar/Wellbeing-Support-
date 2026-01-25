import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

// Update schema to include role
const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "counselor"]).optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function Login() {
  const { login, register } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: "", password: "", role: "student" },
  });

  const onSubmit = async (data: AuthFormData, isRegister: boolean) => {
    try {
      if (isRegister) {
        // Create full object expected by backend
        await register({ ...data, role: data.role || "student" });
      } else {
        await login(data);
      }
      setLocation("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* ... Hero Section remains same ... */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-display tracking-tight">MindfulSpace</h1>
        </div>
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold font-display mb-6 leading-tight">Find calm in the chaos.</h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Your personal sanctuary for mental wellness. Connect with counselors, track your journey, and find support whenever you need it.
          </p>
        </div>
        <div className="relative z-10 text-sm text-blue-200">© 2024 MindfulSpace. All rights reserved.</div>
      </div>

      {/* Right Side - Login */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...form.register("username")} />
                      {form.formState.errors.username && <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input type="password" id="password" {...form.register("password")} />
                      {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, true))} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input id="reg-username" {...form.register("username")} />
                      {form.formState.errors.username && <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label>I am a...</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${form.watch("role") === "student" ? "bg-primary text-white border-primary" : "hover:bg-slate-50"}`}>
                          <input
                            type="radio"
                            value="student"
                            className="sr-only"
                            {...form.register("role")}
                          />
                          Student
                        </label>
                        <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${form.watch("role") === "counselor" ? "bg-primary text-white border-primary" : "hover:bg-slate-50"}`}>
                          <input
                            type="radio"
                            value="counselor"
                            className="sr-only"
                            {...form.register("role")}
                          />
                          Counselor
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input type="password" id="reg-password" {...form.register("password")} />
                      {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
