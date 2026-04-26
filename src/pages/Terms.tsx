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

export default function Terms() {
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
              Terms of Service
            </motion.h1>
            <motion.p
              variants={fadeIn}
              className="mx-auto mt-4 max-w-xl text-lg text-gray-300"
            >
              Please read these terms carefully before using Life in the UK Test Pro.
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
            {/* Disclaimer */}
            <motion.div variants={fadeIn}>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/30 dark:bg-amber-950/20">
                <h2 className="font-display text-xl font-bold text-amber-800 dark:text-amber-400">
                  Important Disclaimer
                </h2>
                <p className="mt-3 text-amber-900 dark:text-amber-200">
                  Life in the UK Test Pro is an independent practice tool. It is <strong>not</strong>
                  the official Life in the UK test, nor is it affiliated with or endorsed by
                  the UK government, the Home Office, or any official testing body. All questions
                  are created for study and revision purposes only. Passing our practice tests
                  does not guarantee a pass in the official examination.
                </p>
              </div>
            </motion.div>

            {/* Free vs Paid */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Free and Paid Tiers
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We offer a free Starter tier so you can evaluate the platform before purchasing.
                The Starter tier includes limited access to practice questions, one mock exam,
                and basic progress tracking.
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Our Pro and Ultimate tiers are unlocked by a <strong>one-time payment</strong>.
                There are no recurring subscriptions, hidden fees, or automatic renewals.
                Once you pay, you have lifetime access to the features included in your chosen
                tier, subject to these terms.
              </p>
            </motion.div>

            {/* Payment and refunds */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                One-Time Payment and 30-Day Guarantee
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                All paid upgrades are billed as a single, one-time charge. Prices are displayed
                clearly before checkout and are subject to change for future customers only;
                existing purchasers are never charged again.
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We offer a <strong>30-day money-back guarantee</strong>. If you are not satisfied,
                contact us at{" "}
                <a
                  href="mailto:support@lifetestpro.com"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  support@lifetestpro.com
                </a>{" "}
                within 30 days of purchase. Refunds are normally processed within 48 hours.
                For full conditions, please see our Refund Policy.
              </p>
            </motion.div>

            {/* User conduct */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                User Conduct
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                By using this platform, you agree not to:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Attempt to reverse-engineer, scrape, or copy our question database</li>
                <li>Share paid account access with others in a way that circumvents our licensing</li>
                <li>Use automated tools, bots, or scripts to interact with the service</li>
                <li>Upload or distribute malicious code or content</li>
                <li>Impersonate another person or misrepresent your identity</li>
              </ul>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Violation of these rules may result in immediate termination of access without
                refund, at our sole discretion.
              </p>
            </motion.div>

            {/* Liability */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Limitation of Liability
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                To the maximum extent permitted by law, Life in the UK Test Pro and its operators
                shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages arising out of or related to your use of the service. This
                includes, but is not limited to, any failure to pass the official Life in the UK
                test, loss of data stored in localStorage, or any other loss or damage.
              </p>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Our total aggregate liability in any matter arising from or relating to these
                terms is limited to the amount you actually paid for the service, or zero if you
                used the free tier.
              </p>
            </motion.div>

            {/* Governing law */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Governing Law
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                These Terms of Service are governed by and construed in accordance with the laws
                of <strong>England and Wales</strong>. Any disputes arising from these terms
                shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </motion.div>

            {/* Changes */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Changes to These Terms
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                We may update these terms from time to time. If we make material changes, we will
                notify you by email or by posting a notice on the site before the changes take
                effect. Continued use of the platform after any changes constitutes acceptance
                of the revised terms.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeIn}>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Contact
              </h2>
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                Questions about these terms can be sent to:{" "}
                <a
                  href="mailto:support@lifetestpro.com"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  support@lifetestpro.com
                </a>
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
