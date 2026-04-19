"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  School,
  ShieldCheck,
} from "lucide-react";

function ConditionRow({ condition, text }) {
  return (
    <div className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/[0.04] px-4 py-3">
      {condition ? (
        <CheckCircle className="h-4 w-4 text-emerald-300" />
      ) : (
        <AlertCircle className="h-4 w-4 text-white/35" />
      )}
      <span className={`text-sm font-medium ${condition ? "text-emerald-100" : "text-white/55"}`}>
        {text}
      </span>
    </div>
  );
}

function ResetPasswordContent() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  useEffect(() => {
    setHasMinLength(newPassword.length >= 8);
    setHasNumber(/[0-9]/.test(newPassword));
    setHasLetter(/[a-zA-Z]/.test(newPassword));
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== "");
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        router.push("/pages/adminLogin");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [resetSuccess, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.");
      setLoading(false);
      return;
    }

    if (!hasMinLength || !hasNumber || !hasLetter || !passwordsMatch) {
      setError("Please meet all password requirements.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setResetSuccess(true);
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-[#0b1d18]/95 p-8 shadow-[0_35px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-[linear-gradient(135deg,#8b2f45,#d4b15f)] text-white">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-3xl font-black text-white">Invalid Reset Link</h2>
        <p className="mt-3 text-sm leading-7 text-white/68">
          This password reset link is missing or expired. Request a new recovery email to continue.
        </p>
        <button
          onClick={() => router.push("/pages/forgotpassword")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] px-5 py-3 text-sm font-black text-white"
        >
          Request New Reset Link
        </button>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-[#0b1d18]/95 p-8 text-center shadow-[0_35px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-3xl font-black text-white">Password Reset Successful</h2>
        <p className="mt-3 text-sm leading-7 text-white/68">
          Your password has been updated successfully. Redirecting you back to login.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#d4b15f]" />
          Redirecting in 3 seconds
        </div>
        <button
          onClick={() => router.push("/pages/adminLogin")}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white"
        >
          Go to Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0b1d18]/95 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white shadow-[0_18px_38px_rgba(15,91,76,0.35)]">
          <KeyRound className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">
            Password Reset
          </p>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Create a New Password</h2>
        </div>
      </div>

      <div className="mt-6 rounded-[1.4rem] border border-[#d4b15f]/20 bg-[#d4b15f]/10 p-4 text-sm leading-7 text-white/78">
        This page keeps the existing token validation and reset API flow. Only the interface has been redesigned.
      </div>

      {error && (
        <div className="mt-5 rounded-[1.4rem] border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-white/75">New Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-14 w-full rounded-[1.3rem] border border-white/10 bg-white/[0.05] pl-12 pr-12 text-sm font-medium text-white outline-none placeholder:text-white/30 focus:border-[#d4b15f]/45"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-white/75">Confirm Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="h-14 w-full rounded-[1.3rem] border border-white/10 bg-white/[0.05] pl-12 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/30 focus:border-[#d4b15f]/45"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch}
            className={`inline-flex h-14 items-center justify-center gap-2 rounded-[1.3rem] text-sm font-black transition ${
              loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch
                ? "cursor-not-allowed bg-[#0f5b4c]/50 text-white/60"
                : "bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white shadow-[0_18px_40px_rgba(15,91,76,0.3)]"
            }`}
          >
            {loading ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </div>

        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Password Requirements</p>
              <p className="text-xs text-white/52">Meet every condition before submission</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ConditionRow condition={hasMinLength} text="At least 8 characters" />
            <ConditionRow condition={hasNumber} text="Contains a number" />
            <ConditionRow condition={hasLetter} text="Contains a letter" />
            <ConditionRow condition={passwordsMatch} text="Passwords match" />
          </div>
        </div>
      </form>
    </div>
  );
}

function ResetPasswordPageInner() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#061510] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,171,87,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,86,73,0.26),transparent_34%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <section className="order-2 space-y-6 lg:order-1">
          <button
            onClick={() => router.push("/pages/adminLogin")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/70">
              <School className="h-4 w-4 text-[#d4b15f]" />
              Secure Password Setup
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              Create a stronger password in a cleaner reset workspace.
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">
              Finish your password reset with a modern, easier-to-scan layout while keeping the original reset token and API behavior unchanged.
            </p>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <ResetPasswordContent />
        </section>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#061510] px-4 text-white">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b1d18]/95 p-8 text-center shadow-[0_35px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white">
              <LoaderCircle className="h-6 w-6 animate-spin" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-white">Loading Reset Workspace</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Checking your reset link and preparing the secure password form.
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordPageInner />
    </Suspense>
  );
}
