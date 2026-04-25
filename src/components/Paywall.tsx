import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Crown, Lock, Zap, ChevronRight, Sparkles, BarChart3, Infinity, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isPro } from '@/lib/tier';

/** Small amber badge showing "Pro" on premium features */
export function ProBadge({ className }: { className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
      className
    )}>
      <Crown className="h-2.5 w-2.5" />
      Pro
    </span>
  );
}

/** Beautiful paywall card overlay for locked content */
export function PaywallCard({
  title,
  description,
  features,
  className,
}: {
  title: string;
  description: string;
  features: string[];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-orange-50/60 p-6 dark:border-amber-800/40 dark:from-amber-950/40 dark:to-orange-950/30",
        className
      )}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }} />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          to="/pricing"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30"
        >
          <Zap className="h-4 w-4" />
          Unlock with Pro — £19
          <ChevronRight className="h-4 w-4" />
        </Link>

        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Less than half the cost of one retake. One-time payment.
        </p>
      </div>
    </motion.div>
  );
}

/** Inline upgrade prompt banner */
export function UpgradePrompt({
  context,
  className,
}: {
  context: string;
  className?: string;
}) {
  const contexts: Record<string, { icon: typeof BarChart3; text: string }> = {
    analytics: { icon: BarChart3, text: 'See exactly which chapters you need to study' },
    marathon: { icon: Infinity, text: 'Endless practice questions to master every topic' },
    review: { icon: Target, text: 'Review every answer with detailed explanations' },
    flashcards: { icon: Sparkles, text: 'Master all 60 flashcards with 3D flip' },
    chapters: { icon: Target, text: 'Access all 5 chapters with key facts' },
    leaderboard: { icon: BarChart3, text: 'Compete on the leaderboard and track your rank' },
  };

  const { icon: Icon, text } = contexts[context] || contexts.analytics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 dark:border-amber-800/30 dark:from-amber-950/30 dark:to-orange-950/20",
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
        <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {text}
        </p>
      </div>
      <Link
        to="/pricing"
        className="shrink-0 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        Upgrade
      </Link>
    </motion.div>
  );
}

/** Feature gate wrapper — renders children for Pro, PaywallCard for Free */
export function FeatureGate({
  paywallTitle,
  paywallDescription,
  paywallFeatures,
  children,
}: {
  paywallTitle: string;
  paywallDescription: string;
  paywallFeatures: string[];
  children: React.ReactNode;
}) {
  if (isPro()) return <>{children}</>;
  return (
    <PaywallCard
      title={paywallTitle}
      description={paywallDescription}
      features={paywallFeatures}
    />
  );
}

/** Navbar upgrade button (shown when free) */
export function NavbarUpgradeButton() {
  if (isPro()) return null;
  return (
    <Link
      to="/pricing"
      className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30 md:flex"
    >
      <Crown className="h-3.5 w-3.5" />
      Get Pro
    </Link>
  );
}

/** Tier indicator in profile/settings */
export function TierBadge({ tier, size = 'md' }: { tier: string; size?: 'sm' | 'md' | 'lg' }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    free: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', label: 'Free' },
    pro: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400', label: 'Pro' },
    ultimate: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-400', label: 'Ultimate' },
  };

  const c = config[tier] || config.free;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-semibold", c.bg, c.text, sizeClasses[size])}>
      {tier !== 'free' && <Crown className="h-3 w-3" />}
      {c.label}
    </span>
  );
}
