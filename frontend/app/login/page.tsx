"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(formData.email, formData.password);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-zinc-400 font-medium">Continue your conversations with AI.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-bold text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="block w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Password</label>
                <a href="#" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">Forgot Password?</a>
              </div>
              <input
                type="password"
                required
                className="block w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center rounded-2xl bg-white px-4 py-4 text-sm font-black text-zinc-950 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm font-medium text-zinc-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white hover:underline decoration-zinc-600 underline-offset-4">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
