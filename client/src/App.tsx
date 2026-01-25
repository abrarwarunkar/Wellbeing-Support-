import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { Loader } from "@/components/Loader";
import { useEffect } from "react";

import Dashboard from "@/pages/Dashboard";
import AIChat from "@/pages/ai-chat/Chat";
import Appointments from "@/pages/Appointments";
import Resources from "@/pages/Resources";
import CounselorDashboard from "@/pages/counselor/CounselorDashboard";
import Forum from "@/pages/Forum";
import Mood from "@/pages/Mood";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

import RoleSelection from "@/pages/onboarding/Role";
import Profile from "@/pages/onboarding/Profile";
import Assessment from "@/pages/screening/Assessment";
// import Documents from "@/pages/onboarding/Documents"; // Removed
// import Review from "@/pages/onboarding/Review"; // Removed

// Protected Route Wrapper
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && user && user.onboardingStatus !== 'active' && user.onboardingStatus !== 'completed') {
      // Redirect to onboarding if not active
      // Map step to route
      const stepRoutes: Record<string, string> = {
        'role_selection': '/onboarding/role',
        'profile_setup': '/onboarding/profile',
      };

      const targetRoute = stepRoutes[user.currentStep as string] || '/onboarding/role';
      // Only redirect if we are not already in the /onboarding path (to avoid loops if logic was handled elsewhere, but here we do it broadly)
      // Actually strictly, this is a "Protected App Route", so we SHOULD be redirected OUT of here to onboarding.
      setLocation(targetRoute);
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  if (!user) return null;
  // If user is not active, we return null while redirecting (unless it's the legacy doc state)
  if (user.onboardingStatus !== 'active' && user.onboardingStatus !== 'completed' && user.currentStep !== 'document_submission') return null;

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function OnboardingRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
    // If active, go to dashboard
    else if (!isLoading && user && (user.onboardingStatus === 'active' || user.onboardingStatus === 'completed')) {
      setLocation("/");
    }
    // Check if we are on the correct step
    else if (!isLoading && user) {
      console.log("OnboardingRoute Check:", {
        status: user.onboardingStatus,
        step: user.currentStep,
        path: window.location.pathname
      });

      const stepRoutes: Record<string, string> = {
        'role_selection': '/onboarding/role',
        'profile_setup': '/onboarding/profile',
        'document_submission': '/', // Fallback for legacy state
        'completed': '/',
      };

      const targetRoute = stepRoutes[user.currentStep as string] || '/onboarding/role';
      const currentPath = window.location.pathname;

      // redirect if not on target
      if (currentPath !== targetRoute && targetRoute !== '/') {
        console.log("Redirecting to:", targetRoute);
        setLocation(targetRoute);
      } else if (targetRoute === '/') {
        // Special case for completed but somehow caught here
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
  if (!user) return null;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      {/* Onboarding Routes */}
      <Route path="/onboarding/role">
        {() => <OnboardingRoute component={RoleSelection} />}
      </Route>
      <Route path="/onboarding/profile">
        {() => <OnboardingRoute component={Profile} />}
      </Route>
      <Route path="/screening/assessment">
        {() => <ProtectedRoute component={Assessment} />}
      </Route>
      {/* Documents and Review routes removed */}

      {/* Protected Routes */}
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/chat">
        {() => <ProtectedRoute component={AIChat} />}
      </Route>
      <Route path="/appointments">
        {() => <ProtectedRoute component={Appointments} />}
      </Route>
      <Route path="/resources">
        {() => <ProtectedRoute component={Resources} />}
      </Route>
      <Route path="/counselor">
        {() => <ProtectedRoute component={CounselorDashboard} />}
      </Route>
      <Route path="/forum">
        {() => <ProtectedRoute component={Forum} />}
      </Route>
      <Route path="/mood">
        {() => <ProtectedRoute component={Mood} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
