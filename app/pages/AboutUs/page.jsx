"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Globe,
  Heart,
  Lightbulb,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { SiGooglemaps } from "react-icons/si";

export default function AboutPage() {
  const stats = [
    { value: "15+", label: "Years of Service", note: "Building excellence since inception" },
    { value: "1500+", label: "Current Students", note: "Girls from across Kenya" },
    { value: "10+", label: "Faculty & Staff", note: "Dedicated educators and professionals" },
    { value: "Best", label: "University Admission", note: "Graduates pursuing higher education" },
  ];

  const pillars = [
    {
      title: "Academic Confidence",
      icon: <BookOpen size={18} />,
      desc: "A focused learning culture that helps girls build mastery, curiosity, and consistency in every subject area.",
    },
    {
      title: "Character & Discipline",
      icon: <ShieldCheck size={18} />,
      desc: "We shape responsible young women through discipline, integrity, and respect for self, others, and community.",
    },
    {
      title: "Mentorship & Sisterhood",
      icon: <Heart size={18} />,
      desc: "A girls-only environment creates room for support, belonging, positive role models, and confident self-expression.",
    },
    {
      title: "Leadership Readiness",
      icon: <Target size={18} />,
      desc: "Learners are encouraged to lead boldly in academics, service, co-curricular life, and future career spaces.",
    },
  ];

  const pathways = [
    {
      title: "STEM Pathway",
      icon: <Lightbulb size={18} />,
      desc: "Science, technology, engineering, and mathematics opportunities that encourage girls to solve real problems with confidence.",
    },
    {
      title: "Social Sciences",
      icon: <Globe size={18} />,
      desc: "Humanities and business-oriented learning that develops communication, critical thinking, and civic awareness.",
    },
    {
      title: "Arts & Sports",
      icon: <Sparkles size={18} />,
      desc: "Creative expression, talent growth, teamwork, and physical wellbeing as part of a balanced school experience.",
    },
  ];

  const values = [
    {
      title: "Committed to Excellence",
      icon: <Star size={18} />,
      desc: "A daily standard that pushes every learner to aim higher and finish strong.",
    },
    {
      title: "Integrity",
      icon: <ShieldCheck size={18} />,
      desc: "Doing what is right with honesty, accountability, and courage.",
    },
    {
      title: "Discipline",
      icon: <Clock size={18} />,
      desc: "Consistency in habits, time, and personal responsibility.",
    },
    {
      title: "Resilience",
      icon: <Trophy size={18} />,
      desc: "Rising through challenge with confidence, endurance, and hope.",
    },
    {
      title: "Compassion",
      icon: <Heart size={18} />,
      desc: "Creating a caring sisterhood where every girl feels seen and supported.",
    },
    {
      title: "Leadership",
      icon: <Users size={18} />,
      desc: "Preparing girls to influence their schools, communities, and future professions.",
    },
  ];

  const contactCards = [
    {
      title: "School Profile",
      icon: <BookOpen className="h-5 w-5" />,
      body: "Public girls boarding school in Matungulu Sub-County, Machakos County.",
      tone: "bg-[#eef8f2] text-[#166534]",
    },
    {
      title: "Postal Address",
      icon: <MapPin className="h-5 w-5" />,
      body: "P.O. Box 109 - 90131, Tala",
      tone: "bg-[#eef4ff] text-[#1d4ed8]",
    },
    {
      title: "Senior School",
      icon: <Sparkles className="h-5 w-5" />,
      body: "CBC-aligned pathways include STEM, Social Sciences, and Arts & Sports.",
      tone: "bg-[#fff3ea] text-[#C1410c]",
    },
    {
      title: "School Motto",
      icon: <Star className="h-5 w-5" />,
      body: "Strive to Excel",
      tone: "bg-[#f5efff] text-[#7c3aed]",
    },
  ];

  const schoolDetails = [
    {
      title: "Who We Are",
      text: "Matungulu Girls Senior School is a public C1 National girls boarding school serving learners in Matungulu Sub-County, Machakos County.",
    },
    {
      title: "Our Learning Culture",
      text: "The school combines academic seriousness with structure, mentorship, and a strong emphasis on discipline, confidence, and positive growth.",
    },
    {
      title: "Where We Are Going",
      text: "As a senior school, Matungulu Girls is positioned to support modern pathways while preparing girls for university, careers, leadership, and service.",
    },
  ];

  return (
    <div className="bg-[#f7f8f4] text-slate-900">
      <section className="relative flex min-h-[82vh] items-center justify-center overflow-hidden sm:min-h-[85vh]">
        <div className="absolute inset-0 overflow-hidden rounded-t-md">
          <Image
            src="/Matungulu/29.jpeg"
            alt="Matungulu Girls Senior School"
            fill
            className="object-cover opacity-35 scale-[1.02] sm:opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a241b]/45 via-[#124635]/30 to-[#09131e]/48" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#051016]/90 via-[#051016]/25 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[110px] sm:h-[560px] sm:w-[560px]" />
        </div>

        <div className="relative z-30 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-300/25 bg-emerald-500/10 px-4 py-2 backdrop-blur-md sm:mb-8 sm:px-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-50">
              About Matungulu Girls
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-black leading-none tracking-tighter text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Matungulu Girls
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-white/80 bg-clip-text text-transparent">
              {" "}Senior School
            </span>
          </h1>

          <div className="mx-auto mb-10 max-w-3xl space-y-5 sm:mb-12 sm:space-y-6">
            <p className="text-sm font-medium leading-7 text-white md:text-base md:leading-relaxed">
              A public girls boarding school in Matungulu Sub-County, Machakos County,
              known for academic focus, disciplined growth, and a learning environment
              designed to help girls rise with confidence.
            </p>

            <div className="grid gap-5 border-y border-white/10 py-6 text-left md:grid-cols-2 md:gap-6 md:py-8">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  What Makes Us Distinct
                </h4>
                <p className="text-sm leading-7 text-white/90">
                  Our girls are nurtured through academic rigor, mentorship, spiritual and
                  moral grounding, and a strong culture of discipline and purpose.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
                  What We Build
                </h4>
                <p className="text-sm leading-7 text-white/90">
                  We prepare young women who can think clearly, communicate boldly, serve
                  others well, and lead with integrity in school and beyond.
                </p>
              </div>
            </div>

            <p className="text-xs italic text-slate-100 md:text-sm">
              "Committed to Excellence" is more than a motto. It is the culture we expect
              and the standard we grow into together.
            </p>
          </div>
{/* Parent Container: Changed flex-col to flex-row and items-stretch to items-center */}
<div className="flex flex-row items-center justify-center gap-2 px-1 sm:gap-4 sm:px-2">
  
  <Link href="/pages/admissions" className="flex-1 sm:flex-none">
    <button className="flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-3 text-[10px] font-black text-white shadow-lg shadow-emerald-900/20 transition-transform active:scale-95 sm:gap-2 sm:rounded-2xl sm:px-10 sm:text-sm">
      Admission <ArrowRight size={14} className="shrink-0 sm:size-[16px]" />
    </button>
  </Link>

  <Link href="/pages/contact" className="flex-1 sm:flex-none">
    <button className="w-full whitespace-nowrap rounded-xl border border-white/10 bg-slate-900 px-3 py-3 text-[10px] font-black text-white shadow-xl transition-transform active:scale-95 sm:rounded-2xl sm:px-10 sm:text-sm">
      Contact
    </button>
  </Link>
  
</div>

          <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-80 sm:mt-12 sm:gap-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              Girls Boarding
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              C1 National
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
              CBC Ready
            </span>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-10 sm:-mt-14 w-full">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 lg:gap-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl sm:rounded-[2rem] border border-white/70 bg-white/95 p-4 sm:p-5 lg:p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.28)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]"
              >
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{stat.value}</p>
                <p className="mt-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.22em] text-emerald-700">
                  {stat.label}
                </p>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="rounded-2xl sm:rounded-[2rem] bg-[#14382d] p-5 sm:p-7 lg:p-10 text-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.5)]">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
                About The School
              </span>
              <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-5xl font-black tracking-tight">
                A girls&apos; school built around growth, discipline, and possibility.
              </h2>
              <p className="mt-4 sm:mt-5 text-xs sm:text-sm lg:text-base leading-7 sm:leading-8 text-white/80">
                Matungulu Girls offers a focused boarding environment where young women can
                learn with confidence, build strong values, and prepare for a future of
                leadership, service, and academic excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {schoolDetails.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl sm:rounded-[1.7rem] border border-slate-200 bg-white p-4 sm:p-6 lg:p-7 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.28)] transition-all duration-200 hover:shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">
                    {item.title}
                  </p>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-[15px] leading-6 sm:leading-7 lg:leading-8 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="rounded-[2rem] border border-[#dbe7dc] bg-white p-7 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.3)] sm:p-10">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">
              School Overview
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              A space where girls are taught to excel and trusted to lead.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Matungulu Girls Senior School serves learners in a focused girls-only boarding
              environment that supports academic achievement, personal discipline, and
              positive identity formation. The school&apos;s setting allows girls to grow in
              confidence, discover their strengths, and prepare for meaningful futures in
              university, careers, and community leadership.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[1.5rem] border border-slate-200 bg-[#fafaf7] p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#163c30] text-white">
                    {pillar.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#dce8dd] bg-[#eaf4eb] p-4 sm:p-5">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <Image
                src="/Matungulu/29.jpeg"
                alt="Students at Matungulu Girls"
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="relative mt-4 rounded-[1.6rem] bg-[#163c30] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
                Girls School Advantage
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight">
                Focused learning, stronger voice, deeper sisterhood.
              </p>
              <p className="mt-3 text-sm leading-7 text-emerald-50/85">
                A supportive girls&apos; environment helps students participate more boldly,
                explore leadership freely, and pursue excellence without limitation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#10261f] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
              Learning Pathways
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Modern preparation for the future girls will shape.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/75">
              As a senior school, Matungulu Girls aligns with CBC pathway growth while
              continuing to nurture discipline, performance, and holistic development.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pathways.map((path) => (
              <div
                key={path.title}
                className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-[#10261f]">
                  {path.icon}
                </div>
                <h3 className="mt-5 text-xl font-black">{path.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/75">{path.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] bg-[#f0eee7] p-8 sm:p-10">
            <span className="inline-flex rounded-full border border-[#d7d0bc] bg-white/80 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#6a5f37]">
              Our Values
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              The character we expect, teach, and celebrate.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The values below reflect the tone of school life at Matungulu Girls:
              excellence, integrity, discipline, compassion, and the courage to lead as
              young women of purpose.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#eef7ef] via-[#f8faf8] to-[#eef3fb] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2.2rem] bg-[#14382d] p-8 text-white shadow-[0_24px_80px_-45px_rgba(15,23,42,0.5)] sm:p-10">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
                Visit & Contact
              </span>
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Reach a school community built for growth.
              </h2>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                      Location
                    </p>
                    <p className="mt-2 text-base font-bold">Matungulu, Machakos County</p>
                    <p className="mt-1 text-sm leading-7 text-white/75">
                      Girls boarding secondary school in Matungulu Sub-County, Eastern Kenya.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                      Enquiries
                    </p>
                    <p className="mt-2 text-base font-bold">School office and admissions desk</p>
                    <p className="mt-1 text-sm leading-7 text-white/75">
                      Contact details vary across public listings, so visits and direct office
                      follow-up remain the most reliable for admissions and school enquiries.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <SiGooglemaps size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                      Directions
                    </p>
                    <p className="mt-2 text-base font-bold">Plan your route before visiting</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/WqjeNfi78asowHx7A"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#14382d] transition-transform active:scale-95"
              >
                View on Maps <ArrowRight size={15} />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.28)]"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}>
                    {card.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
                </div>
              ))}

              <div className="rounded-[1.8rem] border border-slate-200 bg-[#fffdf7] p-6 sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                  Why Parents Choose Matungulu Girls
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-base font-black text-slate-900">Focused Environment</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      A girls-only space that encourages participation, discipline, and steady growth.
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">Holistic Formation</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Academics, character, mentorship, talent, and wellbeing are developed together.
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">Future Readiness</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Learners are prepared for senior school pathways, university ambitions, and life beyond campus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


          {/* Google Maps Location Section - NEW */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="inline-block px-4 py-2 mb-3 text-xs font-bold tracking-[0.1em] text-teal-700 uppercase bg-teal-50 rounded-full">
                      Visit Us
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Our <span className="text-teal-600">Location</span>
                    </h2>
                  </div>
                  
                  {/* Quick location info */}
                  <div className="flex items-center gap-3 text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium">Matungulu, Machakos County</span>
                    <a 
                      href="https://maps.app.goo.gl/q6ubZsEk5KWxzAUv9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 p-1.5 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors"
                      aria-label="Open in Google Maps"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
      
                {/* Map Container with proper aspect ratio */}
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1234!2d37.2618!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM3wrAxNSc0Mi41IkU!5e0!3m2!1sen!2ske!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Katwanyaa Senior School Location"
                    className="rounded-2xl"
                  ></iframe>
                </div>
      
                {/* Map Footer with directions button */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-teal-600" />
                    Matungulu Girls  Senior School, Matungulu, Machakos County
                  </p>
                  <a
                    href="https://maps.app.goo.gl/q6ubZsEk5KWxzAUv9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </section>


    </div>
  );
}
