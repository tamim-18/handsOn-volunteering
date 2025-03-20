"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandHeart, Mail, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <HandHeart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">HandsOn</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Make a Difference in Your Community
          </h2>
          <p className="text-muted-foreground">
            Join thousands of volunteers creating positive change. Connect, contribute, and track your
            social impact journey with HandsOn.
          </p>
        </motion.div>

        {/* Right side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl shadow-lg p-8"
        >
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 p-3 rounded-lg transition-all",
                isLogin ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 p-3 rounded-lg transition-all",
                !isLogin ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
                />
              </div>
            </div>

            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity">
              {isLogin ? "Login" : "Create Account"}
            </button>

            {isLogin && (
              <p className="text-center text-sm text-muted-foreground">
                <a href="#" className="text-primary hover:underline">
                  Forgot your password?
                </a>
              </p>
            )}
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}