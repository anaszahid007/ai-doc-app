"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(formData.name, formData.email, formData.password);
      router.push("/login");
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
          <h2 className="text-3xl font-black tracking-tight text-white">Create Account</h2>
          <p className="mt-2 text-sm text-zinc-400 font-medium">Join the future of document intelligence.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-bold text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                required
                className="block w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
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
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 ml-1">Password</label>
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm font-medium text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline decoration-zinc-600 underline-offset-4">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
