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

export default function Privacy() {
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
              Privacy Policy
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mx-auto mt-4 max-w-xl text-lg text-gray-300"
            >
              Transparent, simple, and reassuring. Your data stays on your device.
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
            {/* Introduction */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Your Data, Your Device
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                At Life in the UK Test Pro, we believe your personal information belongs to you.
                That is why we have built our platform to respect your privacy from the ground up.
                This policy explains exactly what data we collect, how we use it, and what rights
                you have under UK and EU law.
              </p>
            </motion.div>

            {/* What we collect */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                What Data We Collect
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Our platform uses <strong>localStorage only</strong>. This means all of your
                progress, practice scores, and study history are stored directly in your web
                browser. We do not transmit this data to our servers, nor do we have access to it.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Practice test scores and completion status</li>
                <li>Mock exam results and progress tracking</li>
                <li>Chosen study mode preferences</li>
                <li>Bookmarked or flagged questions</li>
              </ul>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                If you clear your browser data or switch devices, your progress will reset.
                This is the trade-off we accept to guarantee your privacy.
              </p>
            </motion.div>

            {/* How we use it */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                How We Use Your Data
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Because all data is stored locally on your device, we do not process, analyse,
                or share your information. The data exists solely to provide you with a
                personalised study experience: tracking your strengths, highlighting weak
                areas, and measuring your readiness for the official test.
              </p>
            </motion.div>

            {/* Cookies and tracking */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Cookies and Tracking
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We do not use any tracking cookies. We do not run analytics scripts from
                third-party providers. We do not build advertising profiles or share data
                with advertisers. If that ever changes, we will update this policy and notify
                you before any new tracking begins.
              </p>
            </motion.div>

            {/* GDPR / UK rights */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Your Rights Under GDPR and UK Data Law
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Even though we do not store personal data on our servers, you retain full rights
                under the UK GDPR and the Data Protection Act 2018. These include:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>The right to be informed about how your data is used</li>
                <li>The right to access any data we hold about you</li>
                <li>The right to rectify inaccurate or incomplete data</li>
                <li>The right to erasure (you can delete your browser data at any time)</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
              </ul>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Because your data is stored locally, the fastest way to exercise your right to
                erasure is to clear your browser&apos;s localStorage and cookies for this site.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                If you have any questions about this privacy policy, or if you would like to
                exercise any of your data rights, please contact us at:{" "}
                <a
                  href="mailto:support@lifetestpro.com"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  support@lifetestpro.com
                </a>
              </p>
            </motion.div>

            {/* Last updated */}
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
