# Redband Mobile (Expo 57.0.25)

The native mobile application for **Redband Atelier & Apothecary**, mirroring the luxury editorial landing page and complete 5-step private suite booking ledger experience.

## Tech Stack
- **Framework**: Expo `~57.0.25`
- **React**: `19.2.3`
- **React Native**: `0.86.3`
- **Expo Status Bar**: `~57.0.1`

## Project Structure
```
mobile/
├── assets/
│   └── images/
│       ├── hero-portrait.jpg
│       ├── studio-interior.jpg
│       ├── craft-tools.jpg
│       └── apothecary-ritual.jpg
├── src/
│   ├── components/
│   │   ├── Header.js               # Top notice, brand lockup, studio switcher & drawer toggle
│   │   ├── DrawerMenu.js           # Editorial modal navigation drawer with studio switcher
│   │   ├── HeroSection.js          # Hero headline, lead copy, meta pills & portrait tags
│   │   ├── Ticker.js               # Horizontal philosophy ticker track
│   │   ├── AtelierStory.js         # Editorial story, Elena Vane pullquote & pillars
│   │   ├── TreatmentLookbook.js    # 4 curated disciplines, preview stage & suite guarantee
│   │   ├── ApothecaryChapter.js    # Midnight obsidian dark chapter with verified additions
│   │   ├── StudioSanctuaries.js    # NoHo NYC & Mayfair LDN studio sanctuaries & phone links
│   │   ├── FooterSection.js        # Dispatch subscription, ethos & full directory
│   │   └── BookingModal.js         # Accessible 5-step guided booking modal & confirmation ticket
│   ├── data/
│   │   └── bookingData.js          # Treatments, practitioners, dates, slots & local assets
│   └── theme/
│       └── colors.js               # Warm paper, obsidian inks, crimson accents & typography
├── App.js                          # Root mobile screen with smooth section scrolling
└── package.json
```

## Running the App

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Start the Expo development server:
```bash
npx expo start
```

3. Open on your device or simulator:
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Scan the QR code using the **Expo Go** app on iOS or Android.
