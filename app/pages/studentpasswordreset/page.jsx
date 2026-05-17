"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  School,
  ShieldCheck,
} from "lucide-react";

function PasswordRule({ active, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {active ? (
        <CheckCircle className="h-4 w-4 text-emerald-600" />
      ) : (
        <AlertCircle className="h-4 w-4 text-slate-400" />
      )}
      <span className={`text-sm font-bold ${active ? "text-emerald-700" : "text-slate-600"}`}>
        {children}
      </span>
    </div>
  );
}

function StudentPasswordResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [student, setStudent] = useState(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const rules = useMemo(() => ({
    length: newPassword.length >= 8,
    lower: /[a-z]/.test(newPassword),
    upper: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  }), [newPassword, confirmPassword]);

  const canSubmit = Object.values(rules).every(Boolean);

  useEffect(() => {
    const validateLink = async () => {
      if (!token) {
        setError("This student password link is missing or invalid.");
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(`/api/student-password-reset?token=${encodeURIComponent(token)}`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "This password link is invalid or expired.");
        setStudent(data.student);
      } catch (err) {
        setError(err.message || "This password link is invalid or expired.");
      } finally {
        setChecking(false);
      }
    };

    validateLink();
  }, [token]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.push("/pages/StudentPortal"), 2500);
    return () => clearTimeout(timer);
  }, [success, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please meet all password requirements before continuing.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/student-password-reset", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-reset",
          token,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not update the student password.");
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not update the student password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="relative bg-slate-950 p-7 text-white sm:p-9">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-xl">
            <School className="h-7 w-7" />
          </div>
          <p className="mt-8 text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">
            Student Portal Security
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Secure Password Reset
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This link was sent to the registered parent email and can only be used once while the student remains active in the dashboard.
          </p>

          {student && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Verified Student</p>
              <h2 className="mt-2 text-xl font-black">{student.fullName || student.admissionNumber}</h2>
              <p className="mt-1 text-sm font-bold text-slate-300">
                ADM {student.admissionNumber} {student.form ? `- ${student.form}` : ""} {student.stream || ""}
              </p>
            </div>
          )}
        </aside>

        <section className="p-6 sm:p-9">
          {checking ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <LoaderCircle className="h-10 w-10 animate-spin text-slate-950" />
              <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-500">Checking secure link</p>
            </div>
          ) : success ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-white">
                <CheckCircle className="h-9 w-9" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Password Updated</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">
                The student can now sign in with the new portal password.
              </p>
            </div>
          ) : error && !student ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Link Unavailable</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">{error}</p>
              <button
                onClick={() => router.push("/pages/StudentPortal")}
                className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
              >
                Back to Student Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-black">Create a New Password</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Use a strong password that the student can remember and keep private.
                </p>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                  <KeyRound className="h-4 w-4" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 pr-12 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-2 flex w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                  <ShieldCheck className="h-4 w-4" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <PasswordRule active={rules.length}>At least 8 characters</PasswordRule>
                <PasswordRule active={rules.lower && rules.upper}>Uppercase and lowercase</PasswordRule>
                <PasswordRule active={rules.number}>At least one number</PasswordRule>
                <PasswordRule active={rules.symbol}>At least one symbol</PasswordRule>
                <PasswordRule active={rules.match}>Passwords match</PasswordRule>
              </div>

              <button
                type="submit"
                disabled={saving || !canSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                {saving ? "Updating Password..." : "Update Student Password"}
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

export default function StudentPasswordResetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <StudentPasswordResetContent />
    </Suspense>
  );
}
