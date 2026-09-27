export const IMAGES = {
  hero: require("../../assets/images/hero-portrait.jpg"),
  studio: require("../../assets/images/studio-interior.jpg"),
  tools: require("../../assets/images/craft-tools.jpg"),
  apothecary: require("../../assets/images/apothecary-ritual.jpg"),
};

export const TREATMENTS = [
  {
    id: "architectural-cut",
    index: "01",
    title: "The Architectural Cut",
    subtitle: "Bone-structure mapping & dry scissor finish",
    duration: "55 min",
    price: "$95",
    numericPrice: 95,
    category: "Precision Sculpting",
    description:
      "A quiet, diagnostic session beginning with anatomical head-mapping and dry analysis. Tailored weight removal and scissor-over-comb detailing designed to grow out effortlessly for 8 to 10 weeks.",
    formulations: ["Wild Cedar Finishing Mist", "Cold-Pressed Jojoba Tonic"],
    steps: [
      "Diagnostic structural consultation (10 min)",
      "Clarifying botanical wash with bergamot & hinoki (15 min)",
      "Anatomical dry cut & weight distribution (25 min)",
      "Cold-towel compress & matte texture finish (5 min)",
    ],
    image: IMAGES.hero,
    imageAlt: "Documentary portrait of client post-treatment at Redband",
  },
  {
    id: "botanical-scalp-ritual",
    index: "02",
    title: "Botanical Scalp & Follicle Ritual",
    subtitle: "Micro-circulation, herbal steam & meridian massage",
    duration: "70 min",
    price: "$145",
    numericPrice: 145,
    category: "Restorative Apothecary",
    description:
      "A clinical trichology treatment combining rosemary-infused scalp oil, low-pressure ozone herbal steam, and targeted occipital pressure-point massage to oxygenate roots and reverse urban environmental stress.",
    formulations: [
      "Artisanal Scalp Elixir No. 3",
      "Rosemary & Blue Chamomile Steam",
      "Cold-Filtered Birch Sap",
    ],
    steps: [
      "Micro-camera trichological scalp assessment (10 min)",
      "Custom botanical oil infusion & warm stone massage (25 min)",
      "Deep ultrasonic ozone steam vapor bath (20 min)",
      "Rinse with iced green tea infusion & light blowout (15 min)",
    ],
    image: IMAGES.apothecary,
    imageAlt: "Artisanal amber dropper bottles and botanical scalp oils",
  },
  {
    id: "texture-mastery-session",
    index: "03",
    title: "Texture Mastery & Movement",
    subtitle: "Pattern hydration, curl geometry & weight liberation",
    duration: "85 min",
    price: "$175",
    numericPrice: 175,
    category: "Curvature & Pattern",
    description:
      "Engineered specifically for curls, waves, coils, and heavy straight hair that requires internal movement. We carve negative space into the hair architecture while infusing bio-lipid moisture.",
    formulations: [
      "Meadowfoam Seed Emulsion",
      "Raw Murumuru Butter",
      "Yuzu Hydrosol",
    ],
    steps: [
      "Dry silhouette consultation in natural state (15 min)",
      "Targeted curl-by-curl architectural carve (35 min)",
      "Deep moisture-locking mask under infrared heat (20 min)",
      "Natural diffuser set with zero heat damage (15 min)",
    ],
    image: IMAGES.tools,
    imageAlt: "Handcrafted matte black shears and horn comb on travertine",
  },
  {
    id: "complete-restoration",
    index: "04",
    title: "The Atelier Restoration Suite",
    subtitle: "Cut, complete scalp reset, and apothecary prescription",
    duration: "115 min",
    price: "$235",
    numericPrice: 235,
    category: "Full Atelier Experience",
    description:
      "The definitive Redband experience. Unhurried, single-chair privacy covering full structural haircutting, therapeutic follicle rejuvenation, and a personalized 30-day apothecary maintenance bottle compounded on site.",
    formulations: [
      "Custom Blended Follicle Serum",
      "Smoked Vetiver Scalp Butter",
      "Pure Rain Hydrosol",
    ],
    steps: [
      "Comprehensive consultation with Master Practitioner (15 min)",
      "Thermal scalp purification & therapeutic meridian ritual (40 min)",
      "Complete bespoke architectural cut & shape refinement (45 min)",
      "Personalized apothecary blend compounding & takeaway bottle (15 min)",
    ],
    image: IMAGES.studio,
    imageAlt: "Quiet monolithic travertine basin and minimalist studio",
  },
];

export const SIGNATURE_FAVORITES = [
  {
    code: "RF-01",
    name: "Occipital Tension Release",
    duration: "30 min add-on",
    price: "$55",
    detail: "Targeted sub-occipital cranial pressure points with warm cypress oil.",
    highlight: "Booked by 78% of repeat clients",
  },
  {
    code: "RF-02",
    name: "Seasonal Apothecary Prescriptive",
    duration: "Single flask compounding",
    price: "$68",
    detail:
      "A customized 100ml dropper bottle formulated to match your scalp pH and urban climate.",
    highlight: "Small batch · 40 flasks per week",
  },
  {
    code: "RF-03",
    name: "The Silent Chair Session",
    duration: "Complimentary option",
    price: "$0",
    detail:
      "Zero conversation after initial consultation. Acoustic calm, warm tea, and pure restorative silence.",
    highlight: "Available for all treatments",
  },
];

export const PRACTITIONERS = [
  {
    id: "elena-vane",
    name: "Elena Vane",
    title: "Atelier Director & Master Sculptor",
    experience: "14 yrs craft · Former Vidal Sassoon London Creative Educator",
    specialty: "Architectural precision, dry-cutting, structural grow-out balance",
    days: ["Wed", "Thu", "Fri", "Sat"],
    avatar: "EV",
  },
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    title: "Senior Trichology & Scalp Artisan",
    experience: "11 yrs craft · Certified Clinical Scalp Specialist",
    specialty:
      "Follicle restoration, botanical compounding, meridian pressure massage",
    days: ["Mon", "Tue", "Thu", "Fri"],
    avatar: "MT",
  },
  {
    id: "sora-kato",
    name: "Sora Kato",
    title: "Master Texture & Geometry Specialist",
    experience: "9 yrs craft · Tokyo & Paris Atelier background",
    specialty: "Natural curl movement, dry carving, effortless non-heat styling",
    days: ["Tue", "Wed", "Fri", "Sat", "Sun"],
    avatar: "SK",
  },
];

export const LOCATIONS = [
  {
    id: "noho-nyc",
    city: "New York",
    neighborhood: "NoHo / Bowery",
    address: "312 Lafayette Street, 3rd Floor",
    transit: "B, D, F, M at Broadway-Lafayette · 6 at Bleecker",
    hours: "Tuesday – Saturday: 9:00 AM – 7:30 PM",
    phone: "+1 (212) 844-9120",
    accessibility: "Elevator access, step-free entrance, sensory-calm private suite",
    status: "Chairs Open Today",
  },
  {
    id: "mayfair-ldn",
    city: "London",
    neighborhood: "Mayfair",
    address: "14 Bourdon Street, Ground Floor",
    transit: "Bond Street & Green Park Stations (5 min walk)",
    hours: "Monday – Friday: 8:30 AM – 7:00 PM · Sat: 10:00 AM – 6:00 PM",
    phone: "+44 (0)20 7946 0882",
    accessibility: "Street-level entrance, tactile acoustic dampening",
    status: "Limited Slots This Week",
  },
];

export const AVAILABLE_DATES = [
  { date: "2026-09-17", dayName: "Thu, Sep 17", label: "Tomorrow" },
  { date: "2026-09-18", dayName: "Fri, Sep 18", label: "Friday" },
  { date: "2026-09-19", dayName: "Sat, Sep 19", label: "Saturday" },
  { date: "2026-09-22", dayName: "Tue, Sep 22", label: "Next Tuesday" },
  { date: "2026-09-23", dayName: "Wed, Sep 23", label: "Next Wednesday" },
];

export const TIME_SLOTS = [
  { time: "09:30 AM", period: "Morning", available: true },
  { time: "11:00 AM", period: "Morning", available: true },
  { time: "01:30 PM", period: "Afternoon", available: false, reason: "Reserved" },
  { time: "03:00 PM", period: "Afternoon", available: true },
  { time: "04:45 PM", period: "Late Afternoon", available: true },
  { time: "06:15 PM", period: "Evening", available: true },
];
