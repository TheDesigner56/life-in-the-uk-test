import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Send,
  User,
  AtSign,
  Tag,
  CheckCircle,
  X,
} from 'lucide-react';
import Layout from '@/components/Layout';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const subjectOptions = [
  'General Question',
  'Technical Issue',
  'Refund Request',
  'Other',
];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[200] flex w-[90vw] max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-2xl dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-white"
    >
      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          Message sent!
        </p>
        <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-200/80">
          {message}
        </p>
      </div>
      <button onClick={onClose} className="shrink-0 text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(subjectOptions[0]);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email';
    }
    if (!message.trim()) nextErrors.message = 'Message is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submission: ContactSubmission = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('contact_submissions') || '[]') as ContactSubmission[];
      existing.push(submission);
      localStorage.setItem('contact_submissions', JSON.stringify(existing));
    } catch {
      localStorage.setItem('contact_submissions', JSON.stringify([submission]));
    }

    setShowToast(true);
    setName('');
    setEmail('');
    setSubject(subjectOptions[0]);
    setMessage('');
    setErrors({});
  };

  return (
    <Layout showFooter={true}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pb-20 pt-32 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 40%, rgba(245,158,11,0.25) 0%, transparent 50%), radial-gradient(circle at 75% 60%, rgba(99,102,241,0.2) 0%, transparent 50%)',
        }} />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div
              variants={fadeIn}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20"
            >
              <MessageSquare className="h-7 w-7 text-amber-400" />
            </motion.div>

            <motion.h1 variants={fadeIn} className="font-display text-4xl font-bold sm:text-5xl">
              Get in <span className="text-amber-400">Touch</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
              We&apos;re here to help. Whether you have a question, a technical issue, or a refund request, our team will get back to you within 24 hours.
            </motion.p>

            <motion.div variants={fadeIn} className="mt-8">
              <a
                href="mailto:support@lifetestpro.com"
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:shadow-xl"
              >
                <Mail className="h-4 w-4" />
                support@lifetestpro.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-gray-50 py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-2xl px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:p-10"
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Send a message
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Fill out the form below and we will respond as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <User className="h-4 w-4 text-amber-500" />
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-amber-500 dark:focus:bg-slate-700"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <AtSign className="h-4 w-4 text-amber-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-amber-500 dark:focus:bg-slate-700"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <Tag className="h-4 w-4 text-amber-500" />
                  Subject
                </label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-amber-500 dark:focus:bg-slate-700"
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <MessageSquare className="h-4 w-4 text-amber-500" />
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-amber-500 dark:focus:bg-slate-700"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] sm:w-auto"
              >
                <Send className="h-5 w-5" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showToast && (
          <Toast
            message="We have received your message and will reply within 24 hours."
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
