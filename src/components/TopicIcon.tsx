import React from 'react';
import type { Question } from '@/data/questions';

// ============================================
// CHAPTER 1: VALUES & PRINCIPLES (Red #EF4444)
// ============================================

export const ScaleIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 3v18M3 6h18M6.5 6L4 14h6L7.5 6M16.5 6L14 14h6L17.5 6" />
  </svg>
);

export const ShieldIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const HandshakeIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    <path d="M16.5 9.5L19 12M12 14l2.5 2.5" />
  </svg>
);

export const VoteIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M8 10h8M8 14h5M16 8l2 2-2 2" />
  </svg>
);

export const GavelIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 20l6-6M14 10l6-6M8 14l-2 2M16 6l2-2M10 8l4 4" />
    <rect x="2" y="20" width="20" height="2" rx="1" />
  </svg>
);

export const PeopleIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="6" cy="5" r="2" />
  </svg>
);

export const HeartIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

export const MegaphoneIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 11l18-5v12L3 13v-2zM11 15.5V20a2 2 0 002 2h0" />
    <circle cx="20" cy="15" r="1" fill="currentColor" />
  </svg>
);

// ============================================
// CHAPTER 2: WHAT IS THE UK? (Blue #3B82F6)
// ============================================

export const UKFlagIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 12h18M12 3v18M5 5l14 14M19 5L5 19" />
  </svg>
);

export const MapPinIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const CastleIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 22V10l4-4V4M16 4v2l4 4v12M2 10h20M8 22v-6h8v6M12 6v16" />
    <rect x="6" y="6" width="4" height="4" />
    <rect x="14" y="6" width="4" height="4" />
  </svg>
);

export const MountainIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M21 20l-6-12-4 8-4-6-6 10" />
    <circle cx="16" cy="5" r="2" />
  </svg>
);

export const GlobeIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

export const CompassIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);

export const CrownBadgeIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M5 16L3 7l5.5 3L12 4l3.5 6L21 7l-2 9H5z" />
    <path d="M5 16h14v4H5z" />
  </svg>
);

export const BridgeIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 20v-8a8 8 0 0116 0v8M2 20h20" />
    <path d="M8 16v-2a4 4 0 018 0v2" />
  </svg>
);

// ============================================
// CHAPTER 3: A LONG HISTORY (Amber #F59E0B)
// ============================================

export const CrownIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M5 16L3 7l5.5 3L12 4l3.5 6L21 7l-2 9H5zM5 16h14v4H5z" />
    <circle cx="8" cy="21" r="1" fill="currentColor" />
    <circle cx="12" cy="21" r="1" fill="currentColor" />
    <circle cx="16" cy="21" r="1" fill="currentColor" />
  </svg>
);

export const SwordIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M5 14l5 5M2 22l3-3" />
  </svg>
);

export const ChurchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3z" />
    <path d="M12 2v4M10 6h4" />
  </svg>
);

export const ShipIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M2 18l4-12h12l4 12M2 18h20v4H2z" />
    <path d="M12 6V2M9 6h6" />
    <path d="M6 14h12" />
  </svg>
);

export const SteamEngineIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="18" cy="12" r="3" />
    <path d="M6 15V9h8v6H6zM2 15h20v4H2z" />
    <path d="M8 9V6M12 9V5" />
  </svg>
);

export const QuillIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

export const CannonIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="6" cy="18" r="4" />
    <circle cx="18" cy="18" r="4" />
    <path d="M4 18H2V8h16l4 4v6h-2" />
    <path d="M18 8V4l3-2" />
  </svg>
);

export const PyramidIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2L2 22h20L12 2z" />
    <path d="M12 2v20M7 22l5-10 5 10" />
  </svg>
);

// ============================================
// CHAPTER 4: MODERN SOCIETY (Green #10B981)
// ============================================

export const TheatreIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 16s2-4 8-4 8 4 8 4M2 21h20" />
    <path d="M6 16V3h12v13" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M10 12c.5.5 1.5.5 2 0" />
  </svg>
);

export const MusicNoteIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const TrophyIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M6 9h12v4a6 6 0 01-12 0V9zM12 18v3M8 21h8" />
  </svg>
);

export const FootballIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M12 6l-4 4 1.5 5h5l1.5-5z" />
  </svg>
);

export const PaletteIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6a4 4 0 100 8 4 4 0 000-8z" />
    <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
    <circle cx="14" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

export const BookOpenIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

export const TVIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="2" y="7" width="20" height="15" rx="2" />
    <path d="M17 2l-5 5-5-5" />
  </svg>
);

export const FlowerIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 7.5a4.5 4.5 0 10-4.5-4.5M12 7.5a4.5 4.5 0 014.5-4.5M12 7.5V22" />
    <path d="M8 15c-2 0-5-2-5-5 3 0 5 2 5 5zM16 15c2 0 5-2 5-5-3 0-5 2-5 5z" />
  </svg>
);

// ============================================
// CHAPTER 5: GOVERNMENT & LAW (Purple #8B5CF6)
// ============================================

export const ParliamentIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 22h16" />
    <path d="M6 22V10l6-6 6 6v12" />
    <rect x="10" y="14" width="4" height="8" />
    <path d="M2 22h20" />
    <path d="M12 4V2" />
  </svg>
);

export const ScalesIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 3v16M5 7l7-4 7 4" />
    <path d="M5 7l-2 9h14l-2-9" />
    <circle cx="3" cy="16" r="2" fill="currentColor" />
    <circle cx="21" cy="16" r="2" fill="currentColor" />
    <path d="M12 19v4" />
  </svg>
);

export const VoteBoxIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="4" y="8" width="16" height="14" rx="2" />
    <path d="M12 2l-6 6h12z" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

export const DocumentIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

export const PoliceIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2L2 7v2a10 10 0 0020 0V7L12 2z" />
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="22" r="1" />
    <path d="M12 15v5" />
  </svg>
);

export const MailIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

export const PoundIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M18 5c-2 0-4 1-5 3s-1 4-1 6M7 21c2 0 4-1 5-3s1-4 1-6" />
    <path d="M5 14h10" />
  </svg>
);

export const HandRaiseIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v0M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v5.5" />
    <path d="M18 11l-3 9H7l-3-7.5a2 2 0 011-3l4-1.5" />
  </svg>
);

// ============================================
// ICON MAPPING BY CHAPTER
// ============================================

const CHAPTER_ICONS: Record<number, React.FC<{ className?: string }>[]> = {
  1: [ScaleIcon, ShieldIcon, HandshakeIcon, VoteIcon, GavelIcon, PeopleIcon, HeartIcon, MegaphoneIcon],
  2: [UKFlagIcon, MapPinIcon, CastleIcon, MountainIcon, GlobeIcon, CompassIcon, CrownBadgeIcon, BridgeIcon],
  3: [CrownIcon, SwordIcon, ChurchIcon, ShipIcon, SteamEngineIcon, QuillIcon, CannonIcon, PyramidIcon],
  4: [TheatreIcon, MusicNoteIcon, TrophyIcon, FootballIcon, PaletteIcon, BookOpenIcon, TVIcon, FlowerIcon],
  5: [ParliamentIcon, ScalesIcon, VoteBoxIcon, DocumentIcon, PoliceIcon, MailIcon, PoundIcon, HandRaiseIcon],
};

// ============================================
// TOPIC DETECTION
// ============================================

const TOPIC_KEYWORDS: Record<string, string[]> = {
  // Chapter 1: Values & Principles
  scale: ['justice', 'judge', 'court', 'lawyer', 'barrister', 'solicitor', 'legal system', 'magistrate', 'tribunal', 'jury', 'verdict', 'sentence'],
  shield: ['protection', 'defence', 'defend', 'safety', 'secure', 'armed forces', 'military', 'army', 'navy', 'raf'],
  handshake: ['tolerance', 'respect', 'community', 'neighbour', 'diversity', 'multicultural', 'integration', 'cohesion', 'mutual respect'],
  vote: ['democracy', 'vote', 'election', 'elect', 'ballot', 'polling', 'franchise', 'suffrage', 'democratic'],
  gavel: ['law', 'legislation', 'act of parliament', 'statute', 'legal', 'illegal', 'crime', 'criminal', 'civil law'],
  people: ['citizen', 'citizenship', 'resident', 'population', 'society', 'community', 'people', 'public', 'national'],
  heart: ['equality', 'equal', 'rights', 'human rights', 'freedom', 'liberty', 'fair', 'discrimination', 'fairness'],
  megaphone: ['free speech', 'expression', 'speech', 'press', 'media', 'protest', 'demonstrate', 'opinion', 'voice'],

  // Chapter 2: What is the UK?
  ukflag: ['united kingdom', 'great britain', 'british', 'union jack', 'uk', 'gb', 'britain', 'national flag'],
  map: ['england', 'scotland', 'wales', 'northern ireland', 'ireland', 'london', 'edinburgh', 'cardiff', 'belfast'],
  castle: ['castle', 'palace', 'buckingham', 'westminster', 'tower of london', 'edinburgh castle', 'historic building'],
  mountain: ['mountain', 'ben nevis', 'snowdon', 'scafell', 'lake district', 'highlands', 'loch', 'river', 'channel', 'sea'],
  globe: ['commonwealth', 'europe', 'european', 'international', 'overseas', 'abroad', 'empire', 'world', 'global'],
  compass: ['geography', 'population', 'area', 'size', 'border', 'coastline', 'isle', 'island', 'territory'],
  crown: ['crown dependency', 'channel islands', 'isle of man', 'jersey', 'guernsey', 'dependencies', 'overseas territory'],
  bridge: ['landmark', 'big ben', 'stonehenge', 'giant\'s causeway', 'angel of the north', 'hadrian', 'blackpool'],

  // Chapter 3: History
  crownh: ['king', 'queen', 'monarch', 'royal', 'royalty', 'throne', 'reign', 'coronation', 'windsor', 'tudor', 'stuart'],
  sword: ['war', 'battle', 'conflict', 'fight', 'invasion', 'conquest', 'crusade', 'campaign', 'military', 'siege'],
  church: ['church', 'christian', 'christianity', 'protestant', 'catholic', 'reformation', 'religion', 'religious', 'bishop', 'god'],
  ship: ['empire', 'colony', 'colonial', 'explore', 'navy', 'sail', 'voyage', 'discovery', 'trade', 'east india'],
  engine: ['industrial revolution', 'steam', 'factory', 'railway', 'engine', 'industry', 'manufacture', 'coal', 'iron'],
  quill: ['shakespeare', 'writer', 'author', 'literature', 'poet', 'playwright', 'art', 'artist', 'paint', 'composer'],
  cannon: ['english civil war', 'napoleonic', 'world war', 'ww1', 'ww2', 'trenches', 'churchill', 'nazi', 'axis', 'allies'],
  pyramid: ['roman', 'roman britain', 'caesar', 'boudicca', 'anglo-saxon', 'viking', 'norman', '1066', 'medieval'],

  // Chapter 4: Modern Society
  theatre: ['theatre', 'drama', 'play', 'performance', 'west end', 'festival', 'carnival', 'celebration', 'culture'],
  music: ['music', 'musician', 'band', 'concert', 'orchestra', 'opera', 'proms', 'british music', 'beatles', 'classical'],
  trophy: ['sport', 'olympics', 'olympic', 'athlete', 'competition', 'medal', 'tournament', 'race', 'trophy'],
  football: ['football', 'premier league', 'cricket', 'rugby', 'tennis', 'wimbledon', 'golf', 'grand national', 'formula'],
  palette: ['art', 'gallery', 'museum', 'painting', 'sculpture', 'design', 'fashion', 'creative', 'artist', 'exhibition'],
  book: ['education', 'school', 'university', 'degree', 'student', 'literature', 'book', 'author', 'writer', 'poet'],
  tv: ['bbc', 'broadcasting', 'television', 'radio', 'news', 'media', 'film', 'movie', 'cinema', 'entertainment'],
  flower: ['garden', 'flower', 'park', 'national trust', 'countryside', 'nature', 'conservation', 'rose', 'thistle'],

  // Chapter 5: Government & Law
  parliament: ['parliament', 'house of commons', 'house of lords', 'westminster', 'whitehall', 'mp', 'member of parliament', 'speaker'],
  scales: ['law', 'legal', 'court', 'judge', 'justice', 'magistrate', 'jury', 'trial', 'evidence', 'verdict', 'sentence', 'appeal'],
  votebox: ['election', 'general election', 'vote', 'voting', 'ballot', 'candidate', 'campaign', 'party', 'poll'],
  document: ['constitution', 'bill of rights', 'habeas corpus', 'charter', 'act', 'statute', 'legislation', 'reform'],
  police: ['police', 'policing', 'crime', 'criminal', 'arrest', 'prison', 'sentence', 'offence', 'cps', 'probation'],
  mail: ['local council', 'councillor', 'mayor', 'authority', 'services', 'devolution', 'scottish parliament', 'senedd', 'assembly'],
  pound: ['tax', 'taxation', 'income tax', 'national insurance', 'budget', 'treasury', 'hmrc', 'revenue', 'vat', 'duty'],
  hand: ['volunteer', 'charity', 'citizenship ceremony', 'jury service', 'community', 'local', 'serve', 'duty', 'responsibility'],
};

function detectTopic(text: string): string {
  const lower = text.toLowerCase();
  let bestMatch = '';
  let bestScore = 0;

  for (const [icon, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        // Longer keyword matches = more specific = higher score
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = icon;
    }
  }

  return bestMatch;
}

function getIconIndex(topic: string, chapterId: number): number {
  // Map detected topic to icon index within chapter
  const topicMap: Record<number, Record<string, number>> = {
    1: { scale: 0, shield: 1, handshake: 2, vote: 3, gavel: 4, people: 5, heart: 6, megaphone: 7 },
    2: { ukflag: 0, map: 1, castle: 2, mountain: 3, globe: 4, compass: 5, crown: 6, bridge: 7 },
    3: { crownh: 0, sword: 1, church: 2, ship: 3, engine: 4, quill: 5, cannon: 6, pyramid: 7 },
    4: { theatre: 0, music: 1, trophy: 2, football: 3, palette: 4, book: 5, tv: 6, flower: 7 },
    5: { parliament: 0, scales: 1, votebox: 2, document: 3, police: 4, mail: 5, pound: 6, hand: 7 },
  };

  const map = topicMap[chapterId] || topicMap[1];
  return map[topic] ?? (chapterId % 8);
}

// ============================================
// PUBLIC COMPONENTS
// ============================================

/** Get the appropriate icon component for a question */
export function getTopicIcon(question: Question): React.FC<{ className?: string }> {
  const topic = detectTopic(question.text);
  const index = getIconIndex(topic, question.chapterId);
  const icons = CHAPTER_ICONS[question.chapterId] || CHAPTER_ICONS[1];
  return icons[index % icons.length];
}

/** Chapter color mapping */
export const CHAPTER_COLORS: Record<number, { bg: string; text: string; border: string; gradient: string; pattern: string }> = {
  1: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    gradient: 'from-red-500/5 to-orange-500/5',
    pattern: 'opacity-[0.03]',
  },
  2: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500/5 to-cyan-500/5',
    pattern: 'opacity-[0.03]',
  },
  3: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    gradient: 'from-amber-500/5 to-yellow-500/5',
    pattern: 'opacity-[0.03]',
  },
  4: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-500/5 to-teal-500/5',
    pattern: 'opacity-[0.03]',
  },
  5: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    gradient: 'from-purple-500/5 to-indigo-500/5',
    pattern: 'opacity-[0.03]',
  },
};

/** Renders the appropriate topic icon for a question */
export function TopicIcon({ question, className = 'w-6 h-6' }: { question: Question; className?: string }) {
  const Icon = getTopicIcon(question);
  const colors = CHAPTER_COLORS[question.chapterId] || CHAPTER_COLORS[1];
  return (
    <span className={`inline-flex items-center justify-center ${colors.text}`}>
      <Icon className={className} />
    </span>
  );
}

/** Full visual header for a question card — SVG icon + gradient background + pattern overlay */
export function QuestionVisual({ question, children }: { question: Question; children?: React.ReactNode }) {
  const Icon = getTopicIcon(question);
  const colors = CHAPTER_COLORS[question.chapterId] || CHAPTER_COLORS[1];

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors.gradient} ${colors.border} border`}>
      {/* Subtle dot pattern overlay */}
      <div
        className={`absolute inset-0 ${colors.pattern}`}
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {/* Content */}
      <div className="relative flex items-start gap-3 p-4">
        <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border`}>
          <Icon className={`w-7 h-7 ${colors.text}`} />
        </div>
        {children}
      </div>
    </div>
  );
}

/** Small inline icon badge for question lists */
export function QuestionIconBadge({ question, className = '' }: { question: Question; className?: string }) {
  const Icon = getTopicIcon(question);
  const colors = CHAPTER_COLORS[question.chapterId] || CHAPTER_COLORS[1];
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${colors.bg} ${colors.text} ${className}`}>
      <Icon className="w-5 h-5" />
    </span>
  );
}

/** Chapter header visual with large icon */
export function ChapterHeaderVisual({ chapterId, title, subtitle }: { chapterId: number; title: string; subtitle?: string }) {
  const chapterIcons = CHAPTER_ICONS[chapterId] || CHAPTER_ICONS[1];
  const Icon = chapterIcons[0];
  const colors = CHAPTER_COLORS[chapterId] || CHAPTER_COLORS[1];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colors.gradient} ${colors.border} border p-6`}>
      <div
        className={`absolute inset-0 ${colors.pattern}`}
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative flex items-center gap-4">
        <div className={`flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border shadow-sm`}>
          <Icon className={`w-10 h-10 ${colors.text}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default TopicIcon;
