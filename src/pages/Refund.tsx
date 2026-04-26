import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
} as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Refund() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.h1
              variants={fadeIn}
              className="font-display text-4xl font-bold sm:text-5xl"
            >
              Refund Policy
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mx-auto mt-4 max-w-xl text-lg text-gray-300"
            >
              Fair, simple, and designed to give you confidence in your purchase.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16 dark:bg-slate-800/50">
        <div className="mx-auto max-w-3xl px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Overview */}
            <motion.div variants={fadeIn}>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800/30 dark:bg-emerald-950/20">
                <h2 className="font-display text-xl font-bold text-emerald-800 dark:text-emerald-400">
                  30-Day Money-Back Guarantee
                </h2>
                <p className="mt-3 text-emerald-900 dark:text-emerald-200">
                  We are confident that Life in the UK Test Pro will help you prepare for your
                  exam. If you are not satisfied for any reason, you may request a full refund
                  within 30 days of your purchase. No lengthy forms, no awkward conversations.
                </p>
              </div>
            </motion.div>

            {/* Conditions */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Conditions for a Refund
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                To qualify for a refund, we ask that you have made a genuine effort to use the
                platform. Specifically, you must have:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Completed at least <strong>3 full mock exams</strong> on our platform</li>
              </ul>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                This condition exists to prevent abuse while keeping the process fair for honest
                students. Mock exam results are stored in your browser’s localStorage, so you will
                need to include a screenshot or export of your results with your refund request.
              </p>
            </motion.div>

            {/* How to request */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                How to Request a Refund
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Email us at:{" "}
                <a
                  href="mailto:support@lifetestpro.com"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  support@lifetestpro.com
                </a>
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Please include the following in your email:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>The email address you used to purchase the upgrade</li>
                <li>Your approximate purchase date</li>
                <li>A brief reason for the refund (this helps us improve)</li>
                <li>A screenshot or export of your mock exam results showing at least 3 completed tests</li>
              </ul>
            </motion.div>

            {/* Processing time */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Processing Time
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Once we receive your refund request, we will review it within{" "}
                <strong>48 hours</strong>. Approved refunds are issued to the original payment
                method. Depending on your bank or card provider, it may take an additional 3 to
                10 business days for the funds to appear in your account.
              </p>
            </motion.div>

            {/* Exclusions */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Exclusions
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We reserve the right to decline refund requests that:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Are submitted more than 30 days after the original purchase date</li>
                <li>Do not include evidence of at least 3 completed mock exams</li>
                <li>Appear to be fraudulent, abusive, or made in bad faith</li>
                <li>Originate from a chargeback or payment dispute opened before contacting us directly</li>
              </ul>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We are a small, independent team. Please treat this policy with the same honesty
                it was designed with.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Questions?
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                If you are unsure whether you qualify for a refund, or if you need help exporting
                your test results, please reach out to us at:{" "}
                <a
                  href="mailto:support@lifetestpro.com"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  support@lifetestpro.com
                </a>
                . We are happy to help.
              </p>
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Last updated: 26 April 2026
            </motion.p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
