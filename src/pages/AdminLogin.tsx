import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

const AdminLogin = () => {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock admin login - in production this would validate against backend
    if (email === "admindf@gmail.com" && password === "admin123") {
      login({
        id: 'admin-1',
        name: 'Admin',
        email: 'admindf@gmail.com',
        country: 'Global',
        role: 'admin',
        verified: true,
      });
      toast({ title: "Admin Access Granted", description: "Welcome to the admin dashboard." });
      navigate('/secure-admin');
    } else {
      toast({ title: "Access Denied", description: "Invalid admin credentials.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" linkTo="" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <ShieldCheck className="w-5 h-5 text-destructive" />
            <h1 className="text-xl font-bold text-foreground">Admin Access</h1>
          </div>
          <p className="text-muted-foreground font-body text-sm mt-1">Authorized personnel only</p>
        </div>

        <div className="glass-card p-8 gradient-border">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Admin Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border/50 rounded-lg pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Admin Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50 border-border/50 rounded-lg pl-10"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 rounded-lg font-semibold">
              Access Dashboard
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          This page is for authorized administrators only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
