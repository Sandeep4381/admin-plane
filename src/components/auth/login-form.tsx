"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Car, Loader2, User, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState('admin@sawarikaro.com');
    const [password, setPassword] = useState('password');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email === 'admin@sawarikaro.com' && password === 'password') {
                toast({
                    title: "Login Successful",
                    description: "Welcome back, Admin!",
                });
                router.push('/dashboard');
            } else {
                toast({
                    title: "Login Failed",
                    description: "Invalid email or password. Please try again.",
                    variant: "destructive",
                });
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <form onSubmit={handleLogin}>
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Car className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">SawariKaro Admin</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="Email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password"
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign in
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
