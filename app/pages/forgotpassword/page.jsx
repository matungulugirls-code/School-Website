"use client";

import React, { useState } from "react";
import { Mail, LoaderCircle, ArrowLeft, School, ShieldCheck, Inbox } from "lucide-react";
import { toast, Toaster } from "sonner";

const infoCards = [
  {
    title: "Secure Recovery",
    text: "Your account reset request is handled through the existing protected school reset flow.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "School Email Access",
    text: "Use the email registered to your account so the reset link reaches the correct inbox.",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Check Inbox & Spam",
    text: "After sending the request, review both your inbox and spam folder for the recovery message.",
    icon: <Inbox className="h-5 w-5" />,
  },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Sending reset link...", {
      position: "top-right",
    });

    try {
      const res = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success(data.message || "Reset link sent successfully.", {
          position: "top-right",
        });
        setEmail("");
        setEmailSent(true);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Failed to send reset link.", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to send reset link. Please try again.", {
        position: "top-right",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailClick = () => {
    if (!email && !emailSent) {
      toast.warning("Please enter your email first", {
        position: "top-right",
      });
      return;
    }

    toast.info("Opening Gmail...", {
      position: "top-right",
      duration: 2000,
    });

    window.open(
      `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(email)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#061510] text-white">
      <Toaster position="top-right" richColors expand />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,171,87,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(14,86,73,0.26),transparent_34%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <section className="order-2 space-y-6 lg:order-1">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/70">
              <School className="h-4 w-4 text-[#d4b15f]" />
              Account Recovery
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] text-white sm:text-5xl lg:text-6xl">
              Reset access through a cleaner recovery workspace.
            </h1>
            <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">
              Enter the school email attached to your account and we will send a secure password reset link using the existing backend recovery flow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {infoCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.16)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white">
                  {card.icon}
                </div>
                <h2 className="mt-4 text-lg font-black text-white">{card.title}</h2>
                <p className="mt-2 text-sm leading-7 text-white/60">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b1d18]/95 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white shadow-[0_18px_38px_rgba(15,91,76,0.35)]">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/45">
                  Recovery Desk
                </p>
                <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                  Forgot Password
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-[#d4b15f]/20 bg-[#d4b15f]/10 p-4 text-sm leading-7 text-white/78">
              Use your registered email to request a reset link. The API logic and delivery flow remain unchanged.
            </div>

            {emailSent && (
              <div className="mt-5 rounded-[1.4rem] border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-100">
                Reset link sent. Check your inbox and spam folder.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-white/75">
                  School Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@matungulugirls.sc.ke"
                    className="h-14 w-full rounded-[1.3rem] border border-white/10 bg-white/[0.05] pl-12 pr-4 text-sm font-medium text-white outline-none placeholder:text-white/30 focus:border-[#d4b15f]/45"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex h-14 items-center justify-center gap-2 rounded-[1.3rem] text-sm font-black transition ${
                    loading
                      ? "cursor-not-allowed bg-[#0f5b4c]/50 text-white/60"
                      : "bg-[linear-gradient(135deg,#0f5b4c,#d4b15f)] text-white shadow-[0_18px_40px_rgba(15,91,76,0.3)]"
                  }`}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGmailClick}
                  className={`inline-flex h-14 items-center justify-center gap-2 rounded-[1.3rem] border text-sm font-black transition ${
                    !email && !emailSent
                      ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30"
                      : "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08]"
                  }`}
                  disabled={!email && !emailSent}
                >
                  <Inbox className="h-5 w-5 text-[#d4b15f]" />
                  Open Gmail
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[0.22em] text-white/40">
              Matungulu Girls Senior School · Secure Recovery Portal
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
