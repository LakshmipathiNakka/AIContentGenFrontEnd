
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Dashboard from "@/pages/Dashboard";
import GenerateQuestions from "@/pages/GenerateQuestions";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <AuthRoute>
                  <>
                    <NavBar />
                    <main>
                      <Dashboard />
                    </main>
                  </>
                </AuthRoute>
              } />
              <Route path="/generate" element={
                <AuthRoute>
                  <>
                    <NavBar />
                    <main>
                      <GenerateQuestions />
                    </main>
                  </>
                </AuthRoute>
              } />
              <Route path="/settings" element={
                <AuthRoute>
                  <>
                    <NavBar />
                    <main>
                      <Settings />
                    </main>
                  </>
                </AuthRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
