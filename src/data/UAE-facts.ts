import {
  Building,
  Users,
  Languages,
  DollarSign,
  MapPin,
  Clock,
  Flag,
  Mountain,
  TreePine,
  Landmark,
  Globe,
  SunMedium,
  Snowflake,
  Calendar,
  Sun,
  Compass,
  Plane,
  Heart,
  Car,
  Wifi,
  Award,
  Stethoscope,
} from "lucide-react";

export const essentialFacts = [
  { icon: Building, color: "blue", label: "Capital", value: "Abu Dhabi" },
  { icon: Users, color: "green", label: "Population", value: "9.5 Million+" },
  {
    icon: Languages,
    color: "purple",
    label: "Languages",
    value: "Arabic, English (Academic)",
  },
  {
    icon: DollarSign,
    color: "orange",
    label: "Currency",
    value: "UAE Dirham (AED)",
  },
  { icon: MapPin, color: "red", label: "Location", value: "Middle East" },
  { icon: Clock, color: "teal", label: "Timezone", value: "UTC+4 (GST)" },
  {
    icon: Flag,
    color: "yellow",
    label: "National Day",
    value: "December 2, 1971 (UAE National Day)",
  },
  {
    icon: Mountain,
    color: "indigo",
    label: "Highest Peak",
    value: "Jebel Jais (1,934 m)",
  },
];

export const geographyPoints = [
  {
    icon: Mountain,
    color: "text-red-600",
    text: "Located on the Arabian Peninsula bordered by the Persian Gulf and Gulf of Oman",
  },
  {
    icon: TreePine,
    color: "text-green-600",
    text: "Pristine coastlines, majestic desert dunes, and modern oasis landscapes",
  },
  {
    icon: Landmark,
    color: "text-purple-600",
    text: "Home to iconic architectural wonders, historical forts, and cultural landmarks",
  },
  {
    icon: Globe,
    color: "text-cyan-600",
    text: "Global trade, financial, and healthcare hub bridging East and West",
  },
];

export const climateZones = [
  {
    icon: SunMedium,
    color: "text-orange-500",
    text: "Mild, comfortable winters perfect for student outdoor activities (18°C – 26°C)",
  },
  {
    icon: Sun,
    color: "text-red-500",
    text: "Warm, sunny summers with 100% climate-controlled modern campus facilities",
  },
  {
    icon: Calendar,
    color: "text-green-500",
    text: "Pleasant autumn and spring seasons with clear blue skies year-round",
  },
  {
    icon: Sun,
    color: "text-red-600",
    text: "Cosmopolitan lifestyle with year-round sunshine and beachside leisure",
  },
];

export const attractions = [
  {
    icon: Landmark,
    color: "text-slate-600",
    name: "Burj Khalifa & Downtown Dubai",
    desc: "The world's tallest architectural icon and vibrant global lifestyle center",
  },
  {
    icon: Landmark,
    color: "text-green-200",
    name: "Sheikh Zayed Grand Mosque",
    desc: "Magnificent architectural masterpiece in Abu Dhabi welcoming visitors globally",
  },
  {
    icon: Compass,
    color: "text-purple-200",
    name: "Louvre Abu Dhabi & Cultural District",
    desc: "World-class universal museum celebrating art, civilization, and culture",
  },
  {
    icon: Mountain,
    color: "text-red-600",
    name: "Palm Jumeirah & Dubai Marina",
    desc: "World-renowned waterfront development offering stunning coastal living",
  },
];

export const majorCities = [
  {
    name: "Dubai",
    gradient: " ",
    textMain: "text-slate-600",
    textSub: "text-slate-600",
    desc: "The hyper-modern metropolis and primary hub of world-ranked medical universities, healthcare cities, and international connectivity.",
    pop: "3,600,000+",
    highlight: "Global Medical & Lifestyle Hub",
  },
  {
    name: "Abu Dhabi",
    gradient: " ",
    textMain: "text-green-100",
    textSub: "text-green-200",
    desc: "UAE's prestigious federal capital, home to top national universities, premier tertiary hospitals, and rich cultural heritage.",
    pop: "1,800,000+",
    highlight: "Capital & Academic Center",
  },
  {
    name: "Sharjah",
    gradient: " ",
    textMain: "text-orange-100",
    textSub: "text-orange-200",
    desc: "The educational and cultural capital of the UAE, renowned for University City and specialized medical complexes.",
    pop: "1,700,000+",
    highlight: "University City & Cultural Hub",
  },
];

export const defaultCuisines = [
  {
    id: 0,
    iconClass: "🫓",
    dishName: "Shawarma",
    dishDescription:
      "Tender spiced meat wrapped in warm flatbread with garlic sauce, popular across the UAE",
    dishImage: null,
  },
  {
    id: 1,
    iconClass: "🍚",
    dishName: "Machboos",
    dishDescription:
      "Fragrant basmati rice slow-cooked with aromatic Arabian spices, dried lime, and tender meat",
    dishImage: null,
  },
  {
    id: 2,
    iconClass: "🍯",
    dishName: "Luqaimat",
    dishDescription:
      "Golden crispy fried dough dumplings drizzled with date syrup and toasted sesame seeds",
  dishImage: null,
  },
  {
    id: 3,
    iconClass: "🍲",
    dishName: "Al Harees",
    dishDescription:
      "Traditional nourishing slow-cooked wheat and meat delicacy served during festive occasions",
    dishImage: null,
  },
];

export const transportOptions = [
  {
    icon: Plane,
    color: "text-red-600",
    text: "Dubai (DXB) & Abu Dhabi (AUH) International Airports — world-leading global hubs with 3-4 hr flights from India",
  },
  {
    icon: MapPin,
    color: "text-orange-600",
    text: "Dubai Metro & modern tram systems offering fully air-conditioned, driverless connectivity",
  },
  {
    icon: Car,
    color: "text-purple-600",
    text: "Etihad Rail and extensive 8-lane highways connecting all 7 Emirates seamlessly",
  },
  {
    icon: Wifi,
    color: "text-green-600",
    text: "Nol Card and Careem integration for effortless, cashless transport across the country",
  },
];

export const visaFacts = [
  {
    icon: Award,
    color: "text-green-600",
    text: "UAE Student Residence Visa sponsored directly by your recognized medical university",
  },
  {
    icon: Calendar,
    color: "text-orange-600",
    text: "Streamlined online visa application with rapid processing within 2-3 weeks",
  },
  {
    icon: Plane,
    color: "text-red-600",
    text: "Emirates ID issued upon arrival for official resident identification and banking",
  },
  {
    icon: Heart,
    color: "text-red-600",
    text: "Easy Golden Visa pathway for high-achieving medical students and graduates",
  },
];

export const mbbsHighlights = [
  {
    icon: Stethoscope,
    label: "International Recognition",
    desc: "Degrees recognized by NMC, WHO (WDOMS), ECFMG, GMC, and UAE Ministry of Health (MOH/DHA/DOH).",
  },
  {
    icon: DollarSign,
    label: "World-Class Clinical Training",
    desc: "State-of-the-art simulation centers, JCI-accredited academic hospitals, and English-taught curriculum.",
  },
  {
    icon: Languages,
    label: "100% English Medium",
    desc: "Complete 5 to 6-year medical degree taught entirely in English with international faculties.",
  },
];

export const economyStats = [
  { label: "Stability", value: "Top Global Economy" },
  { label: "Main Industries", value: "Healthcare, Bio-Pharma, AI & Tech, Aviation, Finance" },
  { label: "Health Hub", value: "Premier Healthcare Destination in the Middle East" },
  { label: "Quality of Life", value: "Ranked Among Top 3 Safest Countries Worldwide" },
];

export const quickFacts = [
  {
    icon: Calendar,
    label: "National Day",
    value: "December 2, 1971",
    color: "text-indigo-200",
  },
  {
    icon: Mountain,
    label: "Land Area",
    value: "83,600 km²",
    color: "text-slate-600",
  },
  {
    icon: Globe,
    label: "Region",
    value: "Middle East",
    color: "text-green-200",
  },
  {
    icon: Award,
    label: "Healthcare System",
    value: "Top Tier Global Health Index",
    color: "text-red-600",
  },
];

export const healthcare = [
  {
    title: "Comprehensive Health Coverage",
    desc: "International students receive mandatory premium medical insurance covering inpatient and outpatient care.",
    color: "border-gray-200",
  },
  {
    title: "JCI-Accredited Teaching Hospitals",
    desc: "Clinical training in internationally accredited hospitals including Thumbay Hospital, Sheikh Shakhbout Medical City, and Cleveland Clinic.",
    color: "border-green-200",
  },
  {
    title: "Advanced Clinical Simulation Exposure",
    desc: "Direct rotations in smart ICUs, robotic surgery suites, and Middle East's premier clinical training facilities.",
    color: "border-purple-200",
  },
];

export const mbbsWhyStats = [
  { val: "5-6 Years", label: "Course Duration" },
  { val: "NMC + WHO", label: "Recognition" },
  { val: "JCI Accredited", label: "Hospital Infrastructure" },
  { val: "English", label: "Instruction Medium" },
];

export const studentLifeCards = [
  {
    icon: Heart,
    label: "Exceptional Safety",
    desc: "UAE consistently ranks among the top 3 safest nations worldwide with zero tolerance for crime and 24/7 security.",
  },
  {
    icon: Building,
    label: "Hyper-Modern Campuses",
    desc: "Smart labs, cutting-edge medical libraries, high-speed 5G connectivity, and fully air-conditioned student residences.",
  },
  {
    icon: Users,
    label: "Global Community",
    desc: "Vibrant multicultural society with huge Indian community, familiar food, cultural celebrations, and 3-hour flight to India.",
  },
];
