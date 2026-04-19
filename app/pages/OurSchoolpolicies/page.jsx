"use client";

import React, { useState } from "react";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiHome,
  FiMessageCircle,
  FiSearch,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const allTerms = [
  {
    id: 1,
    title: "1. School Registration and Enrollment",
    intro: "Matungulu Girls Senior School maintains rigorous standards for student enrollment to ensure academic excellence and maintain our reputation as a leading educational institution for girls.",
    subSections: [
      { subTitle: "1.1. Eligibility Criteria:", content: "Admission is open to female students who have completed primary education (Class 8) and attained the minimum required KCPE score as determined by the school board annually." },
      { subTitle: "1.2. Documentation Required:", content: "Original birth certificate, KCPE result slip, transfer letter (if applicable), medical records, baptism certificate (if Catholic), and four passport-sized photographs must be submitted during registration." },
      { subTitle: "1.3. Age Requirement:", content: "Students must be between 13-15 years at the time of admission to Form 1. Special consideration may be given for exceptional circumstances upon board review." }
    ]
  },
  {
    id: 2,
    title: "2. Academic Requirements and Expectations",
    intro: "Matungulu Girls Senior School is committed to academic excellence and expects students to maintain high standards of academic performance and conduct.",
    subSections: [
      { subTitle: "2.1. Minimum Attendance:", content: "Students must maintain at least 85% attendance in all subjects. Medical certificates must be provided for any absence exceeding two days." },
      { subTitle: "2.2. Academic Performance:", content: "Students must maintain a minimum grade of C- in all subjects. Those failing two or more subjects will be placed on academic probation with mandatory remedial classes." },
      { subTitle: "2.3. Examination Rules:", content: "Strict adherence to KNEC examination rules during national exams. Any form of examination malpractice will result in immediate expulsion and blacklisting from national exams." }
    ]
  },
  {
    id: 3,
    title: "3. School Fees and Financial Obligations",
    intro: "Timely payment of school fees is essential for the smooth operation of the school and continued access to educational resources.",
    subSections: [
      { subTitle: "3.1. Fee Structure:", content: "School fees are payable in three installments: 40% in Term 1, 35% in Term 2, and 25% in Term 3. Fees include tuition, boarding, laboratory charges, and extracurricular activities." },
      { subTitle: "3.2. Payment Deadlines:", content: "Fees must be paid within the first two weeks of each term. Students with outstanding fees after the third week will be sent home until payment is cleared." },
      { subTitle: "3.3. Additional Charges:", content: "Extra charges apply for damage to school property, lost textbooks, and specialized activities. These must be settled before end of term." }
    ]
  },
  {
    id: 4,
    title: "4. Code of Conduct and Discipline",
    intro: "Matungulu Girls Senior School maintains high standards of discipline to create a conducive learning environment for all students.",
    subSections: [
      { subTitle: "4.1. School Uniform:", content: "Complete school uniform must be worn at all times during school hours. Uniform includes prescribed shoes, socks, tie, badge, and veil for Mass. No alterations allowed." },
      { subTitle: "4.2. Prohibited Items:", content: "Mobile phones, electronic devices, drugs, alcohol, tobacco products, weapons, makeup, and inappropriate literature are strictly prohibited on school premises." },
      { subTitle: "4.3. Disciplinary Actions:", content: "Minor offenses: Detention. Moderate offenses: Manual work. Serious offenses: Suspension or expulsion depending on severity and frequency." }
    ]
  },
  {
    id: 5,
    title: "5. Boarding School Regulations",
    intro: "As a boarding school, we provide structured residential facilities with specific rules to ensure safety and proper development of our girls.",
    subSections: [
      { subTitle: "5.1. Dormitory Rules:", content: "Lights out at 9:30 PM. Morning wake-up at 5:00 AM. Dormitory inspection daily at 7:00 AM. No visitors in dormitories without permission." },
      { subTitle: "5.2. Weekend Passes:", content: "Students may go home on weekends with written permission from parents/guardians. Must sign out and return by Sunday 6:00 PM." },
      { subTitle: "5.3. Health and Hygiene:", content: "Daily showers mandatory. Bedding washed weekly. Regular room cleaning. Medical check-ups monthly." }
    ]
  },
  {
    id: 6,
    title: "6. Academic Resources and Facilities",
    intro: "The school provides various academic resources to support student learning and development.",
    subSections: [
      { subTitle: "6.1. Library Access:", content: "Library open Monday-Friday 7:30 AM to 6:00 PM, Saturday 8:00 AM to 1:00 PM. Maximum two books borrowed for two weeks." },
      { subTitle: "6.2. Laboratory Usage:", content: "Science laboratories accessible during practical lessons and supervised study sessions. Strict safety protocols must be followed." },
      { subTitle: "6.3. Computer Lab:", content: "Computer lab available for ICT lessons and research. Internet access filtered for educational purposes only." }
    ]
  },
  {
    id: 7,
    title: "7. Extracurricular Activities",
    intro: "Participation in extracurricular activities is encouraged for holistic development of students.",
    subSections: [
      { subTitle: "7.1. Sports and Games:", content: "Mandatory participation in at least one sport. Training sessions Monday, Wednesday, Friday 4:00-6:00 PM. Inter-school competitions monthly." },
      { subTitle: "7.2. Clubs and Societies:", content: "Each student must join at least two clubs. Club meetings every Tuesday and Thursday 4:00-5:30 PM. Catholic Action Club mandatory for all." },
      { subTitle: "7.3. Cultural Activities:", content: "Music, drama, and art competitions held each term. Participation in annual music festival mandatory." }
    ]
  },
  {
    id: 8,
    title: "8. Health and Safety Regulations",
    intro: "Student health and safety are our top priorities with comprehensive policies in place.",
    subSections: [
      { subTitle: "8.1. Medical Care:", content: "School nurse available 24/7. Serious cases referred to Mweiga Health Center. Parents notified immediately of any serious illness." },
      { subTitle: "8.2. Emergency Procedures:", content: "Fire drills conducted monthly. Emergency evacuation plans displayed in all rooms. First aid kits in every classroom and dormitory." },
      { subTitle: "8.3. COVID-19 Protocols:", content: "Masks mandatory in crowded areas. Hand sanitizers at all entrances. Temperature checks daily. Isolation room for suspected cases." }
    ]
  },
  {
    id: 9,
    title: "9. Parent/Guardian Involvement",
    intro: "We believe in strong partnership between school and parents for student success.",
    subSections: [
      { subTitle: "9.1. Parent Meetings:", content: "PTA meetings held each term (second Saturday). Individual parent-teacher consultations available by appointment." },
      { subTitle: "9.2. Communication:", content: "School newsletter monthly. Progress reports end of each term. Emergency contacts updated annually." },
      { subTitle: "9.3. Visiting Days:", content: "Official visiting days: First Saturday of each month 9:00 AM - 4:00 PM. Special visits require prior approval." }
    ]
  },
  {
    id: 10,
    title: "10. Examination and Assessment Policy",
    intro: "Comprehensive assessment system to monitor and evaluate student progress.",
    subSections: [
      { subTitle: "10.1. Continuous Assessment:", content: "Three CATs per term. End-term examinations each term. Form 4: Mock exams Terms 1 and 2." },
      { subTitle: "10.2. Grading System:", content: "CATs: 30%, End-term: 70%. Minimum passing grade: D+. Promotion to next form requires passing all subjects." },
      { subTitle: "10.3. KCSE Preparation:", content: "Form 4 students: Special revision classes Saturday mornings. Past paper practice from Term 2." }
    ]
  },
  {
    id: 11,
    title: "11. Dress Code and Appearance",
    intro: "Maintaining proper appearance is part of instilling discipline and pride in the school.",
    subSections: [
      { subTitle: "11.1. Hair Regulations:", content: "Hair must be neat, clean, and tied back. No elaborate hairstyles, braids, or extensions. Hair must not touch the collar. No coloring or styling products allowed." },
      { subTitle: "11.2. Accessories:", content: "Simple watches and small stud earrings allowed (one per ear). No jewelry except religious medals worn inside uniform. No visible tattoos or body piercings." },
      { subTitle: "11.3. Sports Attire:", content: "Prescribed sports uniform for games. No personal sports gear allowed during school activities." }
    ]
  },
  {
    id: 12,
    title: "12. Technology and Internet Usage",
    intro: "Responsible use of technology to enhance learning while maintaining safety.",
    subSections: [
      { subTitle: "12.1. Device Policy:", content: "Calculators allowed for Mathematics and Sciences only. No personal laptops, tablets, or smartphones on school premises." },
      { subTitle: "12.2. Internet Access:", content: "Filtered internet available in computer lab only. Social media access blocked. All browsing monitored and logged." },
      { subTitle: "12.3. Cyber Safety:", content: "No sharing of personal information online. Reporting of cyberbullying mandatory. Digital citizenship lessons monthly." }
    ]
  },
  {
    id: 13,
    title: "13. Transportation and Travel",
    intro: "Safety regulations for student movement within and outside school.",
    subSections: [
      { subTitle: "13.1. School Transport:", content: "School buses available for official trips only. Seat belts mandatory. No standing in moving vehicles." },
      { subTitle: "13.2. Travel Authorization:", content: "Written permission required for any travel outside school. Parent/guardian must sign consent forms." },
      { subTitle: "13.3. Emergency Travel:", content: "School vehicle available for medical emergencies. Parents responsible for transport costs for non-emergencies." }
    ]
  },
  {
    id: 14,
    title: "14. Counseling and Guidance",
    intro: "Comprehensive support system for student welfare and career development.",
    subSections: [
      { subTitle: "14.1. Guidance Office:", content: "Open Monday-Friday 8:00 AM-5:00 PM. Confidential counseling sessions available. Appointment system for privacy." },
      { subTitle: "14.2. Career Guidance:", content: "Career talks each term. University and college visits Form 3 and 4. Career profiling and subject selection assistance." },
      { subTitle: "14.3. Peer Counseling:", content: "Trained peer counselors available. Anonymous reporting system for sensitive issues." }
    ]
  },
  {
    id: 15,
    title: "15. Environmental Conservation",
    intro: "Instilling responsibility towards the environment as part of holistic education.",
    subSections: [
      { subTitle: "15.1. Cleanliness:", content: "Daily cleaning of classrooms and compounds. Monthly environmental clean-up exercises. No littering policy strictly enforced." },
      { subTitle: "15.2. Conservation Projects:", content: "Tree planting each rainy season. Water conservation education. Renewable energy projects." },
      { subTitle: "15.3. Waste Management:", content: "Separate bins for biodegradable and non-biodegradable waste. Recycling program for paper and plastics." }
    ]
  }
];

const TERMS_PER_PAGE = 5;

export default function TermsAndConditions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = allTerms.filter((term) =>
    term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.intro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.subSections.some(
      (sub) =>
        sub.subTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredPages = Math.ceil(filteredTerms.length / TERMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * TERMS_PER_PAGE;
  const currentTerms = filteredTerms.slice(startIndex, startIndex + TERMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickFacts = [
    { label: "Policy Sections", value: allTerms.length, icon: FiGrid, note: "Full handbook coverage" },
    { label: "Current View", value: currentTerms.length, icon: FiBookOpen, note: "Visible on this page" },
    { label: "Boarding Focus", value: "24/7", icon: FiHome, note: "Residential guidance" },
    { label: "Student Support", value: "Active", icon: FiUsers, note: "Parents and learners" },
  ];

  const needToKnow = [
    {
      title: "Before Reporting",
      body: "Review enrollment documents, fee obligations, uniform rules, and prohibited items before the first day of school.",
      icon: FiCheckCircle,
    },
    {
      title: "Discipline & Conduct",
      body: "School discipline applies across academics, boarding life, dress code, digital behavior, and movement permissions.",
      icon: FiShield,
    },
    {
      title: "Parents & Guardians",
      body: "Keep contact details updated, attend scheduled meetings, and follow official visiting and communication procedures.",
      icon: FiMessageCircle,
    },
    {
      title: "Safety & Welfare",
      body: "Medical care, guidance, emergency response, and wellbeing rules are part of the student support system.",
      icon: FiAlertCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f2] px-4 py-4 sm:px-6 sm:py-6 md:px-8">
      <div className="mx-auto w-full md:w-[90%]">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#d7e8dd] bg-[#102b23] p-6 text-white shadow-[0_24px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8 lg:p-10">
          <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute left-0 top-24 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%),linear-gradient(140deg,rgba(255,255,255,0.05),transparent_45%)]" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-200">
                <FiShield className="text-sm" />
School Policies 
              </div>
              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.28em] text-emerald-300/80">
                Matungulu Girls Senior School
              </p>
         <h1 className="mt-3 max-w-4xl text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
  School policies,
  <span className="block bg-gradient-to-r from-emerald-200 to-teal-300 bg-clip-text text-transparent">
    designed for transparency and everyday use.
  </span>
</h1>
<p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
  A fresh, searchable handbook for students, staff, and parents. Find the rules
  that matter, understand expectations instantly, and navigate every section in
  a layout that works beautifully on any device.
</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Info</span>
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-emerald-200">{fact.label}</p>
                    <p className="mt-1 text-2xl font-black text-white">{fact.value}</p>
                    <p className="mt-1 text-xs leading-6 text-white/60">{fact.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.35)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Search Rules</p>
              <div className="mt-4 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search rules, welfare, exams, boarding..."
                  className="w-full rounded-2xl  font-bold border border-slate-200 bg-[#f8faf8] py-3 pl-11 pr-11 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  style={{ fontSize: "16px" }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-1.5 text-slate-500 transition-colors hover:bg-slate-200"
                  >
                    ✕
                  </button>
                )}
              </div>

        
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {needToKnow.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-38px_rgba(15,23,42,0.28)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-base font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.8rem] bg-[#102b23] p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">Need-To-Know</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-white/78">
                <p>These policies apply to academics, boarding life, health, discipline, technology, transport, and parent communication.</p>
                <p>Parents should review this page together with students before reporting or returning for the new term.</p>
                <p>Appeals and clarifications should be made through the school administration in writing.</p>
              </div>
            </div>
          </aside>

          <main className="space-y-5">
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.35)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Rules Explorer</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Student policy bento view
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Every section is presented as a policy card with a summary and supporting rule details for quick scanning.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f4f8f4] px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Search Query</p>
                  <p className="mt-1 text-sm font-black text-slate-950">
                    {searchTerm ? `"${searchTerm}"` : "Showing all rules"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-5 xl:grid-cols-2">
              {currentTerms.length > 0 ? (
                currentTerms.map((term, idx) => (
                  <div
                    key={term.id}
                    className={`group overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-[0_18px_55px_-42px_rgba(15,23,42,0.35)] transition-all duration-300 hover:border-emerald-200 hover:shadow-[0_22px_70px_-44px_rgba(5,150,105,0.28)] ${
                      idx % 3 === 0 ? "xl:col-span-2" : ""
                    }`}
                  >
                    <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#102b23_0%,#185140_100%)] p-5 text-white sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:h-10 sm:w-10">
                              <span className="text-sm sm:text-lg font-bold">{term.id}</span>
                            </div>
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100">
                              Section {term.id}
                            </span>
                          </div>
                          <h2 className="max-w-2xl text-lg font-black leading-tight sm:text-xl md:text-2xl">{term.title}</h2>
                        </div>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                          <FiCheckCircle className="text-xl text-emerald-200" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 md:p-7">
                      <div className="rounded-[1.5rem] bg-[#f7faf7] p-4 sm:p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Section Overview</p>
                        <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">{term.intro}</p>
                      </div>

                      <div className="mt-5 grid gap-3 sm:gap-4">
                        {term.subSections.map((sub, index) => (
                          <div
                            key={index}
                            className="rounded-[1.3rem] border border-slate-100 bg-white p-4 transition-colors group-hover:border-emerald-100"
                          >
                            <div className="flex items-start gap-3">
                              <div className="shrink-0">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 sm:h-8 sm:w-8">
                                  <span className="text-xs font-black">{index + 1}</span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="mb-1 text-sm font-black text-slate-900 sm:text-base">{sub.subTitle}</h4>
                                <p className="text-sm leading-7 text-slate-600">{sub.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.9rem] border-2 border-dashed border-slate-300 bg-white p-8 text-center sm:p-12 xl:col-span-2">
                  <div className="max-w-md mx-auto">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 sm:h-20 sm:w-20">
                      <FiSearch className="text-3xl text-slate-400 sm:text-4xl" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">No Rules Found</h3>
                    <p className="mb-4 text-slate-600">Try searching with different keywords or browse all sections</p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Show All Rules
                    </button>
                  </div>
                </div>
              )}
            </div>

            {filteredPages > 1 && (
              <div className="rounded-[1.8rem] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.25)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-800">Page {currentPage} of {filteredPages}</p>
                    <p className="text-[11px] text-slate-500">{filteredTerms.length} rule sections available</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50 disabled:opacity-30"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(filteredPages > 4 ? 3 : 5, filteredPages) }, (_, i) => {
                        let pageNum;
                        if (filteredPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= filteredPages - 2) pageNum = filteredPages - 4 + i;
                        else pageNum = currentPage - 2 + i;

                        if (!pageNum) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`h-10 w-10 rounded-xl text-sm font-black transition-all ${
                              currentPage === pageNum
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(filteredPages, currentPage + 1))}
                      disabled={currentPage === filteredPages}
                      className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50 disabled:opacity-30"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <h4 className="font-black text-emerald-900">Important Notice</h4>
                <p className="mt-2 text-sm leading-7 text-slate-700">These rules are binding for all students. Parents and guardians should ensure learners understand and comply.</p>
              </div>
              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
                <h4 className="font-black text-emerald-900">Review Cycle</h4>
                <p className="mt-2 text-sm leading-7 text-slate-700">Rules are reviewed annually and may be updated to support academics, safety, student welfare, and school operations.</p>
              </div>
              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 sm:col-span-2 xl:col-span-1">
                <h4 className="font-black text-emerald-900">Enforcement</h4>
                <p className="mt-2 text-sm leading-7 text-slate-700">Rules are enforced by the school administration. Appeals should be made formally through the Principal&apos;s office.</p>
              </div>
            </div>

            <div className="pb-4 text-center">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()} Matungulu Girls Senior School. All rights reserved.
                <span className="mt-1 block">For policy queries, contact the administration office through official school channels.</span>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
