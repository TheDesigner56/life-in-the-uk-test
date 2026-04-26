import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function NotFound() {
  return (
    <Layout showFooter={true}>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 py-20 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(245,158,11,0.25) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(99,102,241,0.2) 0%, transparent 50%)',
        }} />

        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeIn}
              className="font-display text-[8rem] font-bold leading-none tracking-tighter text-transparent sm:text-[10rem]"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, #fbbf24, #f59e0b, #ef4444)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              404
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="mt-4 font-display text-3xl font-bold sm:text-4xl"
            >
              Page not found
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-gray-300"
            >
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-2xl shadow-white/10 transition-all hover:scale-105 hover:shadow-white/20"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur transition-all hover:bg-white/10 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
