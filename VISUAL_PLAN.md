# Smart Question Visualisation System — Zero Latency

## Problem
- Hero image loads slowly (~1MB PNG)
- Per-question images would be catastrophic for performance
- Need contextual visuals that load instantly

## Solution: Multi-Layer Visual System

### Layer 1: SVG Topic Icons (Instant — Inline Code)
Each question gets a contextual SVG icon based on its chapter + sub-topic. 40 SVG icons total, ~200 bytes each.

**Chapter 1: Values & Principles (Red)**
- Scale (justice), Shield (protection), Handshake (tolerance), VoteBallot (democracy), Gavel (law), PeopleGroup (community), Heart (equality), Megaphone (free speech), Lock (rights), Building (institutions)

**Chapter 2: What is the UK? (Blue)**
- UKFlag, MapPin, Castle, Mountain, River, Bridge, Globe, Compass, CrownBadge, Cityscape

**Chapter 3: A Long History (Amber)**
- Crown, Sword, Church, Ship, SteamEngine, CrownJewel, Quill, Cannon, PyramidClock, Factory

**Chapter 4: Modern Society (Green)**
- TheatreMasks, MusicNote, Trophy, Football, PaintPalette, BookOpen, TV, Utensils, Flower, Festival

**Chapter 5: Government & Law (Purple)**
- Parliament, Gavel, ScaleBalanced, VoteBox, Stamp, Document, PoliceBadge, Mail, PoundCoin, HandRaise

### Layer 2: CSS Chapter Gradients (Instant)
Each question card has a subtle chapter-themed gradient background:
- Ch1: Red-tinted subtle gradient
- Ch2: Blue-tinted subtle gradient
- Ch3: Amber-tinted subtle gradient
- Ch4: Green-tinted subtle gradient
- Ch5: Purple-tinted subtle gradient

### Layer 3: Pattern Overlays (CSS — Instant)
- Subtle dot patterns, line patterns, geometric shapes
- Different pattern per chapter
- Very low opacity (2-4%)

### Layer 4: Chapter Hero Images (Lazy Loaded)
Only 5 pre-generated images — one per chapter, shown at the top of chapter-specific study pages. Lazy loaded.

### Layer 5: Optimised Existing Images
- Compress existing 4 PNG images
- Convert to WebP where supported
- Add loading="lazy" to all images below the fold

## Implementation

### Files to Create/Modify:
1. `src/components/SvgIcons.tsx` — 40 SVG icon components, topic detection logic
2. `src/components/QuestionVisual.tsx` — Question card visual wrapper (combines SVG + CSS gradient + pattern)
3. `src/pages/Test.tsx` — Integrate visuals into question cards
4. `src/pages/Practice.tsx` — Add chapter icons to test cards
5. `src/pages/Study.tsx` — Add chapter icons, optimize chapter images
6. `src/index.css` — Add CSS pattern definitions, chapter gradient utilities
7. `src/components/Navbar.tsx` — Optimize logo loading
8. `src/pages/Home.tsx` — Add lazy loading to images

## Topic Detection Logic
Map question text keywords to SVG icons:
- If text contains "court"/"judge"/"lawyer" → Scale icon
- If text contains "vote"/"election" → VoteBallot icon
- If text contains "king"/"queen"/"monarch" → Crown icon
- etc.

This runs client-side with zero network requests.
