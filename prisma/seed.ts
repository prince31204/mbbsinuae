import "dotenv/config";
import {
  ApplicationStatus,
  CountryDocType,
  LeadStatus,
  NeetStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import * as bcrypt from "bcryptjs";

const SHOULD_SEED_SAMPLE_LEADS =
  (process.env.SEED_SAMPLE_LEADS || "false").toLowerCase() === "true";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function upsertByWhere(
  delegate: any,
  where: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  const existing = await delegate.findFirst({ where });
  if (existing) {
    return delegate.update({ where: { id: existing.id }, data });
  }
  return delegate.create({ data });
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name: "Super Admin",
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in UAE.",
      status: true,
    },
    create: {
      name: "Super Admin",
      email,
      role: UserRole.admin,
      password: hashedPassword,
      designation: "Administrator",
      description: "Platform administrator for MBBS in UAE.",
      status: true,
    },
  });
}

async function seedWebsiteSettings() {
  const settings = [
    { key: "site_name", value: "MBBS in UAE", type: "text", group: "general" },
    { key: "support_email", value: "admissions@mbbsinuae.com", type: "text", group: "contact" },
    { key: "support_phone", value: "+971-4-245-8899", type: "text", group: "contact" },
    { key: "stats_total_students", value: "3000+", type: "text", group: "stats" },
    { key: "stats_total_universities", value: "8+", type: "text", group: "stats" },
    { key: "stats_total_scholarships", value: "15+", type: "text", group: "stats" },
    { key: "stats_annual_aid", value: "$1.5M+", type: "text", group: "stats" },
    { key: "stats_admission_support", value: "100%", type: "text", group: "stats" },
    { key: "stats_merit_label", value: "Merit", type: "text", group: "stats" },
    { key: "stats_verified_label", value: "MOHAP / WHO / NMC", type: "text", group: "stats" },
  ];

  for (const item of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }
}

async function seedReferenceData() {
  const instituteTypes = ["Public / Federal", "Private", "Specialized Medical Institute"];
  for (const name of instituteTypes) {
    await upsertByWhere(prisma.instituteType, { name }, { name, status: true });
  }

  const provinceNames = [
    "Emirate of Abu Dhabi",
    "Emirate of Dubai",
    "Emirate of Sharjah",
    "Emirate of Ajman",
    "Emirate of Ras Al Khaimah",
    "Emirate of Fujairah",
    "Emirate of Umm Al Quwain",
  ];
  const provinceIds = new Map<string, number>();
  for (const name of provinceNames) {
    const p = await upsertByWhere(prisma.province, { name }, { name, status: true });
    provinceIds.set(name, p.id);
  }

  const cities = [
    { name: "Abu Dhabi", province: "Emirate of Abu Dhabi" },
    { name: "Al Ain", province: "Emirate of Abu Dhabi" },
    { name: "Dubai", province: "Emirate of Dubai" },
    { name: "Sharjah", province: "Emirate of Sharjah" },
    { name: "Ajman", province: "Emirate of Ajman" },
    { name: "Ras Al Khaimah", province: "Emirate of Ras Al Khaimah" },
    { name: "Fujairah", province: "Emirate of Fujairah" },
    { name: "Umm Al Quwain", province: "Emirate of Umm Al Quwain" },
  ];

  const cityIds = new Map<string, number>();
  for (const item of cities) {
    const provinceId = provinceIds.get(item.province);
    if (!provinceId) continue;
    const c = await upsertByWhere(
      prisma.city,
      { name: item.name, provinceId },
      { name: item.name, provinceId, status: true },
    );
    cityIds.set(item.name, c.id);
  }

  const levels = [
    {
      name: "Undergraduate",
      slug: "undergraduate",
      description: "Bachelor-level programs including MBBS and MD.",
      status: true,
    },
    {
      name: "Postgraduate",
      slug: "postgraduate",
      description: "Advanced clinical specialization and residency pathways.",
      status: true,
    },
  ];
  for (const item of levels) {
    await prisma.level.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }

  for (const name of [
    "Indian Mess & Halal Dining",
    "Modern Student Dormitories",
    "24x7 Campus Security",
    "High-Fidelity Simulation Labs",
    "Clinical Skills & Anatomy Center",
    "Sports & Recreation Center",
  ]) {
    await upsertByWhere(prisma.facility, { name }, { name, status: true });
  }

  const hospitals = [
    { name: "Thumbay University Hospital", city: "Ajman", beds: 350 },
    { name: "Rashid Hospital - DAHC", city: "Dubai", beds: 780 },
    { name: "Tawam Teaching Hospital", city: "Al Ain", beds: 500 },
    { name: "University Hospital Sharjah", city: "Sharjah", beds: 325 },
    { name: "Saqr Hospital", city: "Ras Al Khaimah", beds: 400 },
  ];
  for (const item of hospitals) {
    const slug = slugify(item.name);
    await prisma.hospital.upsert({
      where: { slug },
      update: { ...item, slug, state: "UAE", status: true },
      create: { ...item, slug, state: "UAE", status: true },
    });
  }

  for (const studyMode of ["Full-time", "On-campus", "English Medium"]) {
    await upsertByWhere(prisma.studyMode, { studyMode }, { studyMode });
  }

  return { provinceIds, cityIds };
}

async function seedCountryAndEducationPages() {
  const aboutCountry = await prisma.aboutCountryPage.upsert({
    where: { id: 1 },
    update: {
      name: "United Arab Emirates",
      tagline: "World-Class Healthcare and Modern Medical Education Hub in the Middle East",
      capital: "Abu Dhabi",
      population: "10.2 Million+",
      languages: "Arabic (Official), English (Academic & Clinical)",
      currency: "AED",
      location: "Arabian Peninsula, Middle East",
      timezone: "UTC+4 (GST)",
      independenceDay: new Date("1971-12-02"),
      highestPeak: "Jebel Jais",
      highestPeakHeight: "1,934 m",
      whoRecognized: true,
      englishMedium: true,
      mbbsAffordableEducation:
        "World-leading medical infrastructure, modern teaching hospitals, and NMC/WHO/MOHAP accredited degree pathways.",
      academicExcellence:
        "Globally accredited medical colleges offering US/UK-aligned curriculum models, advanced simulation facilities, and JCI-accredited clinical rotations.",
      studentLife:
        "Ultra-safe, cosmopolitan lifestyle with state-of-the-art campus residences, world-class transit, and a thriving international student community.",
      visaConnectivity:
        "Streamlined UAE student visa with Golden Visa prospects for top academic performers, and convenient 3-4 hour direct flight connectivity from India.",
      publicHealthcare:
        "Premier healthcare infrastructure governed by MOHAP, DHA, and DOH featuring world-renowned JCI-accredited tertiary teaching hospitals.",
      privateHealthcare:
        "Top-tier academic health systems and hospital networks including Thumbay Healthcare and American Hospital Dubai.",
      studentHealthcare:
        "Comprehensive medical insurance coverage providing seamless care across top teaching hospitals and campus clinics.",
      tourismGrowth:
        "Global hub for innovation, iconic landmarks, safety, and cultural diversity.",
      bannerImage: "/uploads/about-country/uae-banner.jpg",
    },
    create: {
      id: 1,
      name: "United Arab Emirates",
      tagline: "World-Class Healthcare and Modern Medical Education Hub in the Middle East",
      capital: "Abu Dhabi",
      population: "10.2 Million+",
      languages: "Arabic (Official), English (Academic & Clinical)",
      currency: "AED",
      location: "Arabian Peninsula, Middle East",
      timezone: "UTC+4 (GST)",
      independenceDay: new Date("1971-12-02"),
      highestPeak: "Jebel Jais",
      highestPeakHeight: "1,934 m",
      whoRecognized: true,
      englishMedium: true,
      mbbsAffordableEducation:
        "World-leading medical infrastructure, modern teaching hospitals, and NMC/WHO/MOHAP accredited degree pathways.",
      academicExcellence:
        "Globally accredited medical colleges offering US/UK-aligned curriculum models, advanced simulation facilities, and JCI-accredited clinical rotations.",
      studentLife:
        "Ultra-safe, cosmopolitan lifestyle with state-of-the-art campus residences, world-class transit, and a thriving international student community.",
      visaConnectivity:
        "Streamlined UAE student visa with Golden Visa prospects for top academic performers, and convenient 3-4 hour direct flight connectivity from India.",
      publicHealthcare:
        "Premier healthcare infrastructure governed by MOHAP, DHA, and DOH featuring world-renowned JCI-accredited tertiary teaching hospitals.",
      privateHealthcare:
        "Top-tier academic health systems and hospital networks including Thumbay Healthcare and American Hospital Dubai.",
      studentHealthcare:
        "Comprehensive medical insurance coverage providing seamless care across top teaching hospitals and campus clinics.",
      tourismGrowth:
        "Global hub for innovation, iconic landmarks, safety, and cultural diversity.",
      bannerImage: "/uploads/about-country/uae-banner.jpg",
    },
  });

  const cityCards = [
    {
      cityName: "Dubai",
      description: "Global healthcare metropolis home to Dubai Healthcare City (DHCC) and premier medical colleges.",
      population: "3.6 Million+",
    },
    {
      cityName: "Abu Dhabi",
      description: "The vibrant capital city offering cutting-edge medical research and federal universities.",
      population: "1.8 Million+",
    },
    {
      cityName: "Ajman",
      description: "Renowned education hub housing Gulf Medical University and Thumbay Hospital network.",
      population: "500,000+",
    },
    {
      cityName: "Sharjah",
      description: "Cultural and academic center housing University of Sharjah College of Medicine.",
      population: "1.8 Million+",
    },
  ];
  for (const item of cityCards) {
    await upsertByWhere(
      prisma.countryMajorCity,
      { pageId: aboutCountry.id, cityName: item.cityName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const cuisines = [
    {
      dishName: "Al Machboos",
      dishDescription: "UAE’s signature spiced rice dish cooked with tender meat or chicken, dried lime, and aromatic spices.",
      dishImage: "/uploads/about-country/machboos.jpg",
    },
    {
      dishName: "Al Harees",
      dishDescription: "Traditional Emirati slow-cooked wheat and meat dish known for its rich flavor and nutritious value.",
      dishImage: "/uploads/about-country/harees.jpg",
    },
    {
      dishName: "Luqaimat",
      dishDescription: "Beloved Emirati golden fried dough dumplings drizzled with rich date syrup and toasted sesame.",
      dishImage: "/uploads/about-country/luqaimat.jpg",
    },
  ];
  for (const item of cuisines) {
    await upsertByWhere(
      prisma.countryCuisineLifestyle,
      { pageId: aboutCountry.id, dishName: item.dishName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const lifestyles = [
    {
      title: "World-Class Safety",
      description: "Ranked among the safest countries globally with zero-tolerance crime policy and 24/7 security.",
    },
    {
      title: "Tax-Free & Thriving Economy",
      description: "High standard of living, tax-free income opportunities for doctors, and rapid career growth.",
    },
    {
      title: "Multicultural Student Environment",
      description: "Home to 200+ nationalities, vibrant Indian diaspora, authentic Indian food, and festive celebrations.",
    },
  ];
  for (const item of lifestyles) {
    await upsertByWhere(
      prisma.countryLifestyleCulture,
      { pageId: aboutCountry.id, title: item.title },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const attractions = [
    {
      attractionName: "Burj Khalifa & Downtown Dubai",
      description: "The world’s tallest tower and an architectural wonder set at the heart of Dubai.",
      ordering: 1,
      isActive: true,
    },
    {
      attractionName: "Sheikh Zayed Grand Mosque",
      description: "One of the world’s largest and most breathtaking mosques located in Abu Dhabi.",
      ordering: 2,
      isActive: true,
    },
    {
      attractionName: "Louvre Abu Dhabi",
      description: "Iconic universal museum on Saadiyat Island showcasing civilizational art and history.",
      ordering: 3,
      isActive: true,
    },
  ];
  for (const item of attractions) {
    await upsertByWhere(
      prisma.countryTouristAttraction,
      { pageId: aboutCountry.id, attractionName: item.attractionName },
      { ...item, pageId: aboutCountry.id },
    );
  }

  const educationSystem = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: {
      title: "Education System in UAE",
      description:
        "The UAE medical education framework complies with international guidelines from WHO, WFME, and NMC, regulated by CAA and MOHAP.",
      introductionTitle: "A Global Benchmark in Modern Healthcare Education",
      introductionDescription:
        "UAE offers world-class medical education featuring American and British clinical curriculum models, advanced simulation labs, and JCI-accredited hospital training.",
      literacyRate: 98.2,
      officialLanguage: "Arabic",
      officialLanguagePercentage: 100,
      officialLanguageNote: "Official language of the country, while 100% of medical education is delivered in English.",
      foreignLanguage: "English",
      foreignLanguagePercentage: 90,
      foreignLanguageNote: "Primary medium of instruction, clinical lectures, medical textbooks, and examinations.",
      universitiesCount: 15,
      universitiesNote: "Including top CAA-accredited medical colleges and internationally affiliated teaching hospitals.",
      higherEducationDescription:
        "The UAE higher education ecosystem features leading federal and accredited private medical universities offering globally valid MBBS/MD degrees.",
    },
    create: {
      id: 1,
      title: "Education System in UAE",
      description:
        "The UAE medical education framework complies with international guidelines from WHO, WFME, and NMC, regulated by CAA and MOHAP.",
      introductionTitle: "A Global Benchmark in Modern Healthcare Education",
      introductionDescription:
        "UAE offers world-class medical education featuring American and British clinical curriculum models, advanced simulation labs, and JCI-accredited hospital training.",
      literacyRate: 98.2,
      officialLanguage: "Arabic",
      officialLanguagePercentage: 100,
      officialLanguageNote: "Official language of the country, while 100% of medical education is delivered in English.",
      foreignLanguage: "English",
      foreignLanguagePercentage: 90,
      foreignLanguageNote: "Primary medium of instruction, clinical lectures, medical textbooks, and examinations.",
      universitiesCount: 15,
      universitiesNote: "Including top CAA-accredited medical colleges and internationally affiliated teaching hospitals.",
      higherEducationDescription:
        "The UAE higher education ecosystem features leading federal and accredited private medical universities offering globally valid MBBS/MD degrees.",
    },
  });

  const schoolLevels = [
    { level: "Pre-Clinical Phase", ageRange: "18-20", durationYears: 2, isCompulsory: true, title: "Anatomy, Physiology, Biochemistry & Medical Sciences" },
    { level: "Clinical Sciences Phase", ageRange: "20-23", durationYears: 3, isCompulsory: true, title: "Pathology, Pharmacology, Medicine, Surgery & Hospital Rotations" },
    { level: "Compulsory Rotating Internship", ageRange: "23+", durationYears: 1, isCompulsory: false, title: "Hands-on Clinical Internship in JCI-Accredited Teaching Hospitals" },
  ];
  for (const item of schoolLevels) {
    await upsertByWhere(
      prisma.educationSchoolLevel,
      { pageId: educationSystem.id, level: item.level },
      { ...item, pageId: educationSystem.id },
    );
  }

  const degrees = [
    { degree: "MBBS / MD General Medicine", duration: "5 - 6 Years", recognition: "Recognized by NMC (India), WHO (WDOMS), ECFMG (USA), GMC (UK), and MOHAP (UAE)" },
    { degree: "Bachelor of Dental Surgery (BDS)", duration: "5 Years", recognition: "Global Dental Council & MOHAP Accreditation" },
    { degree: "Doctor of Pharmacy (PharmD)", duration: "5 Years", recognition: "Leading International Pharmacy Education Standards" },
  ];
  for (const item of degrees) {
    await upsertByWhere(
      prisma.educationDegree,
      { pageId: educationSystem.id, degree: item.degree },
      { ...item, pageId: educationSystem.id },
    );
  }

  const fields = [
    { field: "General Medicine & Surgery (MBBS)", description: "Complete medical qualification with extensive clinical rotations in JCI-accredited hospital networks.", numberOfInstitutions: "Leading Medical Colleges", durationYears: "5-6" },
    { field: "Clinical Simulation & Emergency Medicine", description: "Advanced training in high-fidelity simulation centers and emergency care.", numberOfInstitutions: "Teaching Hospitals", durationYears: "Specialization Track" },
    { field: "Biomedical & Genomic Research", description: "Innovative medical sciences training aligned with UAE National Genome Strategy.", numberOfInstitutions: "Top Research Universities", durationYears: "4" },
  ];
  for (const item of fields) {
    await upsertByWhere(
      prisma.educationPopularField,
      { pageId: educationSystem.id, field: item.field },
      { ...item, pageId: educationSystem.id },
    );
  }

  await prisma.aboutUs.upsert({
    where: { id: 1 },
    update: {
      heroTitle: "Your Trusted MBBS in UAE Advisory Team",
      heroDescription:
        "Guiding aspiring doctors toward accredited, world-class medical universities in the United Arab Emirates with complete transparency.",
      partnerUniversities: 8,
      studentsPlaced: 3000,
      channelPartners: 45,
      yearsExperience: 12,
      mission: "Ethical and transparent MBBS counseling for students and parents aiming for international medical careers.",
      vision: "To be the most trusted UAE medical admission and student advisory platform for international students.",
      contact1: "+91-11-2410-2161",
      contact2: "+971-4-245-8899",
      email1: "admissions@mbbsinuae.com",
      email2: "support@mbbsinuae.com",
      address: "New Delhi, India and Building 64, Dubai Healthcare City (DHCC), Dubai, UAE",
    },
    create: {
      id: 1,
      heroTitle: "Your Trusted MBBS in UAE Advisory Team",
      heroDescription:
        "Guiding aspiring doctors toward accredited, world-class medical universities in the United Arab Emirates with complete transparency.",
      partnerUniversities: 8,
      studentsPlaced: 3000,
      channelPartners: 45,
      yearsExperience: 12,
      mission: "Ethical and transparent MBBS counseling for students and parents aiming for international medical careers.",
      vision: "To be the most trusted UAE medical admission and student advisory platform for international students.",
      contact1: "+91-11-2410-2161",
      contact2: "+971-4-245-8899",
      email1: "admissions@mbbsinuae.com",
      email2: "support@mbbsinuae.com",
      address: "New Delhi, India and Building 64, Dubai Healthcare City (DHCC), Dubai, UAE",
    },
  });

  await upsertByWhere(
    prisma.educationSystemPage,
    { title: "MBBS Curriculum Overview in UAE" },
    {
      title: "MBBS Curriculum Overview in UAE",
      subtitle: "Pre-clinical foundation to hands-on JCI hospital clerkships",
      description: "A structured, US/UK-modeled curriculum combining basic medical sciences, advanced simulation, and hospital rotations.",
      highlights: ["Integrated Medical Sciences", "High-Fidelity Simulation", "JCI Hospital Postings", "NEXT / USMLE Preparation"],
      position: 1,
      status: true,
    },
  );
}

async function seedContentAndMisc(adminId: number) {
  const staticSeoPages = [
    { page: "home", metaTitle: "Study MBBS in UAE 2026", metaDescription: "Admission guidance, university comparison, and fee details for MBBS in UAE." },
    { page: "about-us", metaTitle: "About MBBS in UAE Team", metaDescription: "Meet the counselors and operations team supporting students in UAE." },
    { page: "about-uae", metaTitle: "About UAE for Students", metaDescription: "Understand student lifestyle, safety, and world-class healthcare ecosystem in UAE." },
    { page: "education-system", metaTitle: "Education System in UAE", metaDescription: "Academic structure and MBBS medical training overview in UAE." },
    { page: "universities", metaTitle: "Medical Universities in UAE", metaDescription: "Compare UAE medical colleges, tuition fees, and hospital affiliations." },
    { page: "blog", metaTitle: "MBBS UAE Blog", metaDescription: "Guides for admission, student visa, and life in UAE." },
    { page: "news", metaTitle: "MBBS UAE News", metaDescription: "Education and policy updates for medical aspirants in UAE." },
    { page: "articles", metaTitle: "MBBS UAE Articles", metaDescription: "Long-form practical planning guides for studying MBBS in UAE." },
    { page: "contact-us", metaTitle: "Contact MBBS UAE Advisors", metaDescription: "Book counseling with India and UAE admissions teams." },
    { page: "scholarships", metaTitle: "MBBS Scholarships in UAE", metaDescription: "Merit and tuition fee support opportunities in UAE." },
  ];
  for (const item of staticSeoPages) {
    await prisma.staticPageSeo.upsert({
      where: { page: item.page },
      update: { ...item, status: true, ogImagePath: "/og-default.jpg" },
      create: { ...item, status: true, ogImagePath: "/og-default.jpg" },
    });
  }

  for (const item of [
    "universities/[slug]",
    "blog/[categorySlug]/[blogSlug]",
    "news/[categorySlug]/[slug]",
    "articles/[categorySlug]/[slug]",
    "scholarships/[slug]",
  ]) {
    await prisma.dynamicPageSeo.upsert({
      where: { page: item },
      update: {
        page: item,
        metaTitle: "MBBS in UAE",
        metaDescription: "Dynamic page SEO baseline for UAE-focused content.",
        status: true,
      },
      create: {
        page: item,
        metaTitle: "MBBS in UAE",
        metaDescription: "Dynamic page SEO baseline for UAE-focused content.",
        status: true,
      },
    });
  }

  await upsertByWhere(prisma.defaultOgImage, { name: "UAE Default OG" }, {
    name: "UAE Default OG",
    imageName: "og-default.jpg",
    imagePath: "/og-default.jpg",
    status: true,
  });

  const faqCategory = await prisma.faqCategory.upsert({
    where: { slug: "homepage" },
    update: { name: "Homepage", slug: "homepage", status: true },
    create: { name: "Homepage", slug: "homepage", status: true },
  });
  await upsertByWhere(prisma.faq, { question: "Is MBBS in UAE taught in English?" }, {
    question: "Is MBBS in UAE taught in English?",
    answer: "Yes, all accredited medical universities in the UAE deliver MBBS and MD programs entirely in English.",
    categoryId: faqCategory.id,
    position: 1,
    status: true,
  });
  await upsertByWhere(prisma.faq, { question: "Is NEET mandatory for Indian students to study in UAE?" }, {
    question: "Is NEET mandatory for Indian students to study in UAE?",
    answer: "Yes, NEET qualification is mandatory as per NMC guidelines for Indian students who intend to practice in India or appear for NEXT.",
    categoryId: faqCategory.id,
    position: 2,
    status: true,
  });
  await upsertByWhere(prisma.faq, { question: "Are UAE medical degrees recognized worldwide?" }, {
    question: "Are UAE medical degrees recognized worldwide?",
    answer: "Yes, UAE medical colleges are accredited by CAA and MOHAP, and recognized by WHO (WDOMS), NMC (India), ECFMG (USA), and GMC (UK).",
    categoryId: faqCategory.id,
    position: 3,
    status: true,
  });

  await upsertByWhere(prisma.office, { name: "India Head Office" }, {
    name: "India Head Office",
    address: "EP-41, Jesus and Mary Marg, Chanakyapuri",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    phone: "+91-11-2410-2161",
    email: "india@mbbsinuae.com",
    mapEmbed: "https://maps.google.com/?q=Chanakyapuri+New+Delhi",
    imageName: "office-india.jpg",
    imagePath: "/uploads/offices/india-head-office.jpg",
    position: 1,
    status: true,
  });
  await upsertByWhere(prisma.office, { name: "UAE Support Office" }, {
    name: "UAE Support Office",
    address: "Building 64, Dubai Healthcare City (DHCC)",
    city: "Dubai",
    state: "Emirate of Dubai",
    country: "United Arab Emirates",
    phone: "+971-4-245-8899",
    email: "admissions@mbbsinuae.com",
    mapEmbed: "https://maps.google.com/?q=Dubai+Healthcare+City+Dubai",
    imageName: "office-uae.jpg",
    imagePath: "/uploads/offices/uae-office.jpg",
    position: 2,
    status: true,
  });

  await upsertByWhere(prisma.expertTeam, { name: "Dr. Meera Nair" }, {
    name: "Dr. Meera Nair",
    designation: "Senior Admission Counselor",
    description: "Supports profile evaluation, university selection, and admission planning for UAE MBBS aspirants.",
    photoName: "dr-meera-nair.jpg",
    photoPath: "/uploads/experts/dr-meera-nair.jpg",
    position: 1,
    status: true,
  });

  const links = [
    {
      name: "Ministry of Health and Prevention (MOHAP) - UAE",
      url: "https://www.mohap.gov.ae",
      category: "uae-government",
      position: 1,
    },
    {
      name: "Commission for Academic Accreditation (CAA) - UAE",
      url: "https://www.caa.ae",
      category: "uae-government",
      position: 2,
    },
    {
      name: "Dubai Health Authority (DHA) - UAE",
      url: "https://www.dha.gov.ae",
      category: "uae-government",
      position: 3,
    },
    {
      name: "National Medical Commission (NMC) - India",
      url: "https://www.nmc.org.in",
      category: "india-regulatory",
      position: 4,
    },
    {
      name: "World Health Organization (WHO)",
      url: "https://www.who.int",
      category: "global-health",
      position: 5,
    },
  ];
  for (const item of links) {
    await upsertByWhere(prisma.officialGovernmentLink, { name: item.name }, {
      ...item,
      description: "Official reference portal.",
      status: true,
    });
  }

  await upsertByWhere(prisma.countryDocument, { country: "UAE", type: CountryDocType.embassy_letter }, {
    country: "UAE",
    type: CountryDocType.embassy_letter,
    title: "UAE Student Visa Guidance",
    fileName: "uae-student-visa-guide.pdf",
    filePath: "/uploads/country-documents/uae-student-visa-guide.pdf",
    isActive: true,
  });
  await upsertByWhere(prisma.countryDocument, { country: "UAE", type: CountryDocType.nmc_guidelines }, {
    country: "UAE",
    type: CountryDocType.nmc_guidelines,
    title: "NMC Foreign Medical Graduate Guidelines",
    fileName: "nmc-guidelines-reference.pdf",
    filePath: "/uploads/country-documents/nmc-guidelines-reference.pdf",
    isActive: true,
  });

  await upsertByWhere(prisma.pageContent, { pageSlug: "about-us", title: "Why Study MBBS in UAE" }, {
    pageSlug: "about-us",
    title: "Why Study MBBS in UAE",
    content: "World-class hospitals, English-medium education, American/British curriculum standards, extreme safety, and proximity to India.",
    position: 1,
    status: true,
  });

  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "admission-guides" },
    update: { name: "Admission Guides", slug: "admission-guides", status: true },
    create: { name: "Admission Guides", slug: "admission-guides", status: true },
  });
  const blog = await upsertByWhere(prisma.blog, { slug: "mbbs-in-uae-admission-roadmap-2026" }, {
    categoryId: blogCategory.id,
    authorId: adminId,
    title: "MBBS in UAE Admission Roadmap 2026",
    slug: "mbbs-in-uae-admission-roadmap-2026",
    shortnote: "A practical timeline from counseling and NEET validation to UAE student visa.",
    description: "Stepwise checklist for profile review, documents, entrance interviews, and travel readiness.",
    status: true,
    homeView: true,
    trending: true,
  });
  await upsertByWhere(prisma.blogContent, { blogId: blog.id, slug: "profile-review" }, {
    blogId: blog.id,
    title: "Profile Review",
    slug: "profile-review",
    description: "Start with eligibility checks and shortlist CAA/MOHAP recognized UAE medical universities.",
    position: 1,
  });
  await upsertByWhere(prisma.blogFaq, { blogId: blog.id, question: "When should I start applying for UAE medical colleges?" }, {
    blogId: blog.id,
    question: "When should I start applying for UAE medical colleges?",
    answer: "Start planning at least 4-6 months before the September intake window.",
    position: 1,
    status: true,
  });

  const newsCategory = await prisma.newsCategory.upsert({
    where: { slug: "policy-and-admissions" },
    update: { name: "Policy and Admissions", slug: "policy-and-admissions", status: true },
    create: { name: "Policy and Admissions", slug: "policy-and-admissions", status: true },
  });
  const news = await upsertByWhere(prisma.news, { slug: "uae-medical-intake-advisory-2026" }, {
    categoryId: newsCategory.id,
    authorId: adminId,
    title: "UAE Medical University Intake Advisory 2026",
    slug: "uae-medical-intake-advisory-2026",
    description: "Admissions open for UAE medical universities for the 2026 academic intake.",
    status: true,
    homeView: true,
  });
  await upsertByWhere(prisma.newsContent, { newsId: news.id, slug: "timeline-advisory" }, {
    newsId: news.id,
    title: "Timeline Advisory",
    slug: "timeline-advisory",
    description: "Begin shortlisting and document attestation before university application deadlines.",
    position: 1,
  });
  await upsertByWhere(prisma.newsFaq, { newsId: news.id, question: "Do all UAE universities have the same intake schedule?" }, {
    newsId: news.id,
    question: "Do all UAE universities have the same intake schedule?",
    answer: "Most UAE universities have a primary September intake, with rolling applications opening early in the spring.",
    position: 1,
    status: true,
  });

  const articleCategory = await prisma.articleCategory.upsert({
    where: { slug: "mbbs-planning" },
    update: { name: "MBBS Planning", slug: "mbbs-planning", status: true },
    create: { name: "MBBS Planning", slug: "mbbs-planning", status: true },
  });
  const article = await upsertByWhere(prisma.article, { slug: "realistic-cost-breakdown-mbbs-uae" }, {
    categoryId: articleCategory.id,
    authorId: adminId,
    title: "Realistic Cost Breakdown for MBBS in UAE",
    slug: "realistic-cost-breakdown-mbbs-uae",
    description: "Understand tuition fees, accommodation options, and annual budget planning for UAE medical universities.",
    status: true,
    homeView: true,
  });
  await upsertByWhere(prisma.articleContent, { articleId: article.id, slug: "tuition-and-living" }, {
    articleId: article.id,
    title: "Tuition and Living",
    slug: "tuition-and-living",
    description: "Budget should include tuition, university accommodation, food, visa, and insurance costs.",
    position: 1,
  });
  await upsertByWhere(prisma.articleFaq, { articleId: article.id, question: "Is on-campus accommodation available in UAE universities?" }, {
    articleId: article.id,
    question: "Is on-campus accommodation available in UAE universities?",
    answer: "Yes, all major medical universities in the UAE provide furnished air-conditioned hostels with security and meal plans.",
    position: 1,
    status: true,
  });

  const scholarship = await prisma.scholarship.upsert({
    where: { slug: "uae-merit-scholarship-mbbs" },
    update: {
      title: "UAE Merit Scholarship for MBBS",
      slug: "uae-merit-scholarship-mbbs",
      scholarshipType: "Merit-based",
      amountMin: 2000,
      amountMax: 5000,
      discountPercentage: 20,
      availableSeats: 30,
      program: "MBBS",
      applicationMode: "Online",
      shortnote: "Partial tuition fee scholarship for qualifying academic achievers.",
      isActive: true,
    },
    create: {
      title: "UAE Merit Scholarship for MBBS",
      slug: "uae-merit-scholarship-mbbs",
      scholarshipType: "Merit-based",
      amountMin: 2000,
      amountMax: 5000,
      discountPercentage: 20,
      availableSeats: 30,
      program: "MBBS",
      applicationMode: "Online",
      shortnote: "Partial tuition fee scholarship for qualifying academic achievers.",
      isActive: true,
    },
  });
  await upsertByWhere(prisma.scholarshipFaq, { scholarshipId: scholarship.id, question: "Can I apply before final admission?" }, {
    scholarshipId: scholarship.id,
    question: "Can I apply before final admission?",
    answer: "You can submit scholarship eligibility forms concurrently with your initial application.",
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.testimonial, { name: "Arjun Sharma", designation: "MBBS Graduate" }, {
    name: "Arjun Sharma",
    designation: "MBBS Graduate",
    description: "Smooth admission support and top-notch clinical exposure in Thumbay University Hospital in the UAE.",
    rating: 4.9,
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.gallery, { imagePath: "/uploads/gallery/campus-orientation.jpg" }, {
    title: "Campus Orientation",
    imageName: "campus-orientation.jpg",
    imagePath: "/uploads/gallery/campus-orientation.jpg",
    position: 1,
    status: true,
  });

  await upsertByWhere(prisma.partnerInquiry, { email: "partners@globalcareerpathways.com" }, {
    name: "Global Career Pathways",
    email: "partners@globalcareerpathways.com",
    phone: "+91-98100-45678",
    company: "Global Career Pathways",
    city: "Ahmedabad",
    partnerType: "Counseling Partner",
    message: "Interested in channel partnership for UAE medical college counseling.",
    status: "converted",
    studentsPlaced: 180,
    experience: 7,
    rating: 4.6,
  });
}

async function seedUAEUniversities(provinceIds: Map<string, number>, cityIds: Map<string, number>) {
  const universitiesData = [
    {
      name: "Gulf Medical University (GMU)",
      uniqueId: "UAE-GMU-001",
      city: "Ajman",
      provinceName: "Emirate of Ajman",
      establishedYear: 1998,
      students: "3,000+",
      tuitionFee: "$35,000",
      globalRanking: "Top Medical University in UAE & Region",
      nationalRanking: "1",
      shortnote: "UAE’s leading private medical university affiliated with the Thumbay network of academic hospitals.",
      aboutNote: "Gulf Medical University (GMU), established in 1998, is one of the premier medical universities in the Middle East. Located in Ajman, GMU operates Thumbay University Hospital, providing clinical training with American and British standard curricula recognized by WHO, NMC, ECFMG, and MOHAP.",
      tuitionFeeAnnual: "$35,000",
      courseDuration: "6 Years (including Clinical Rotations & Internship)",
      mediumOfInstruction: "English",
      eligibility: "12th Grade with PCB (60%+), NEET Qualified (for Indian students)",
      status: true,
      isFeatured: true,
      latitude: 25.4052,
      longitude: 55.5136,
    },
    {
      name: "Mohammed Bin Rashid University of Medicine and Health Sciences (MBRU)",
      uniqueId: "UAE-MBRU-002",
      city: "Dubai",
      provinceName: "Emirate of Dubai",
      establishedYear: 2016,
      students: "1,500+",
      tuitionFee: "$42,000",
      globalRanking: "Top 150 Young Universities in Asia",
      nationalRanking: "2",
      shortnote: "World-class academic health center located inside Dubai Healthcare City (DHCC).",
      aboutNote: "MBRU is a world-class academic institution situated in the heart of Dubai Healthcare City. It offers integrated clinical clerkships in collaboration with Dubai Academic Health Corporation (DAHC) and Rashid Hospital, featuring high-fidelity simulation and robotic surgical research.",
      tuitionFeeAnnual: "$42,000",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      eligibility: "12th Grade with PCB (65%+), NEET Qualified",
      status: true,
      isFeatured: true,
      latitude: 25.2315,
      longitude: 55.3225,
    },
    {
      name: "United Arab Emirates University College of Medicine (UAEU)",
      uniqueId: "UAE-UAEU-003",
      city: "Al Ain",
      provinceName: "Emirate of Abu Dhabi",
      establishedYear: 1976,
      students: "14,000+",
      tuitionFee: "$38,000",
      globalRanking: "Ranked #290 in QS World University Rankings",
      nationalRanking: "1 (Federal)",
      shortnote: "UAE’s first and premier national federal university with world-class Tawam Teaching Hospital.",
      aboutNote: "The College of Medicine and Health Sciences at UAEU in Al Ain is the nation’s flagship medical school. Affiliated with Tawam Hospital and Al Ain Hospital, it provides high-quality clinical clerkships and postgraduate medical pathways recognized across the UK, USA, and India.",
      tuitionFeeAnnual: "$38,000",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      eligibility: "12th Grade with PCB (65%+), NEET Qualified",
      status: true,
      isFeatured: true,
      latitude: 24.1989,
      longitude: 55.6791,
    },
    {
      name: "University of Sharjah College of Medicine",
      uniqueId: "UAE-UOS-004",
      city: "Sharjah",
      provinceName: "Emirate of Sharjah",
      establishedYear: 2004,
      students: "16,000+",
      tuitionFee: "$30,000",
      globalRanking: "Top 400 World Universities (THE Rankings)",
      nationalRanking: "Top Regional Flagship",
      shortnote: "Leading medical campus in University City Sharjah with University Hospital Sharjah (UHS).",
      aboutNote: "University of Sharjah College of Medicine provides a patient-centered, problem-based medical curriculum. With University Hospital Sharjah and University Dental Hospital on campus, it provides students with exceptional clinical and surgical exposure.",
      tuitionFeeAnnual: "$30,000",
      courseDuration: "6 Years",
      mediumOfInstruction: "English",
      eligibility: "12th Grade with PCB (60%+), NEET Qualified",
      status: true,
      isFeatured: false,
      latitude: 25.2917,
      longitude: 55.4746,
    },
    {
      name: "RAK Medical and Health Sciences University (RAKMHSU)",
      uniqueId: "UAE-RAK-005",
      city: "Ras Al Khaimah",
      provinceName: "Emirate of Ras Al Khaimah",
      establishedYear: 2006,
      students: "2,000+",
      tuitionFee: "$28,000",
      globalRanking: "Pioneer Medical University in Northern Emirates",
      nationalRanking: "Premier Regional Health Hub",
      shortnote: "First comprehensive health sciences university established by the Government of Ras Al Khaimah.",
      aboutNote: "RAKMHSU offers CAA and MOHAP accredited medical programs with clinical training in Saqr Hospital and Ibrahim Bin Hamad Obaidullah Hospital. It is a preferred destination for international Indian students seeking NMC-compliant MBBS abroad in UAE.",
      tuitionFeeAnnual: "$28,000",
      courseDuration: "5.5 - 6 Years",
      mediumOfInstruction: "English",
      eligibility: "12th Grade with PCB (60%+), NEET Qualified",
      status: true,
      isFeatured: false,
      latitude: 25.7953,
      longitude: 55.9769,
    },
  ];

  let primaryProgramId: number | null = null;

  for (const u of universitiesData) {
    const slug = slugify(u.name);
    const provinceId = provinceIds.get(u.provinceName);
    const cityId = cityIds.get(u.city);

    const university = await prisma.university.upsert({
      where: { slug },
      update: {
        name: u.name,
        uniqueId: u.uniqueId,
        city: u.city,
        establishedYear: u.establishedYear,
        students: u.students,
        tuitionFee: u.tuitionFee,
        globalRanking: u.globalRanking,
        nationalRanking: u.nationalRanking,
        shortnote: u.shortnote,
        aboutNote: u.aboutNote,
        courseDuration: u.courseDuration,
        mediumOfInstruction: u.mediumOfInstruction,
        eligibility: u.eligibility,
        status: u.status,
        isFeatured: u.isFeatured,
        provinceId: provinceId ?? undefined,
        cityId: cityId ?? undefined,
        latitude: u.latitude,
        longitude: u.longitude,
      },
      create: {
        name: u.name,
        slug,
        uniqueId: u.uniqueId,
        city: u.city,
        establishedYear: u.establishedYear,
        students: u.students,
        tuitionFee: u.tuitionFee,
        globalRanking: u.globalRanking,
        nationalRanking: u.nationalRanking,
        shortnote: u.shortnote,
        aboutNote: u.aboutNote,
        courseDuration: u.courseDuration,
        mediumOfInstruction: u.mediumOfInstruction,
        eligibility: u.eligibility,
        status: u.status,
        isFeatured: u.isFeatured,
        provinceId: provinceId ?? undefined,
        cityId: cityId ?? undefined,
        latitude: u.latitude,
        longitude: u.longitude,
      },
    });

    const program = await upsertByWhere(
      prisma.universityProgram,
      { universityId: university.id, programSlug: "mbbs" },
      {
        universityId: university.id,
        programName: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
        programSlug: "mbbs",
        duration: "6 Years",
        mediumOfInstruction: "English",
        annualTuitionFee: u.tuitionFeeAnnual,
        eligibility: u.eligibility,
        overview: "Comprehensive CAA and NMC recognized MBBS program with structured clinical clerkships.",
        isActive: true,
      },
    );

    if (!primaryProgramId && program) {
      primaryProgramId = program.id;
    }

    await upsertByWhere(
      prisma.universityFaq,
      { universityId: university.id, question: "Is clinical training provided in JCI-accredited hospitals?" },
      {
        universityId: university.id,
        question: "Is clinical training provided in JCI-accredited hospitals?",
        answer: "Yes, students receive direct clinical immersion in leading tertiary teaching hospitals affiliated with the university.",
        position: 1,
        status: true,
      },
    );

    await upsertByWhere(
      prisma.universityReview,
      { universityId: university.id, name: "Student Review - Batch 2025" },
      {
        universityId: university.id,
        name: "Student Review - Batch 2025",
        designation: "MBBS Student",
        description: "Outstanding faculty, state-of-the-art simulation labs, and a safe, modern lifestyle in the UAE.",
        rating: 4.8,
        position: 1,
        status: true,
      },
    );

    await upsertByWhere(
      prisma.universityTestimonial,
      { universityId: university.id, name: "Parent Testimonial - 2025" },
      {
        universityId: university.id,
        name: "Parent Testimonial - 2025",
        designation: "Parent",
        description: "Exceptional safety for our daughter, excellent student housing, and direct 3-hour flights from Delhi.",
        rating: 4.9,
        position: 1,
        status: true,
      },
    );

    await upsertByWhere(
      prisma.universityStudent,
      { universityId: university.id, email: `intl.batch@mbbsinuae.com` },
      {
        universityId: university.id,
        name: "International Student Cohort",
        email: `intl.batch@mbbsinuae.com`,
        phone: "+971-4-555-0101",
        country: "India",
        numberOfStudents: 150,
        course: "MBBS",
        year: "2026",
        status: true,
      },
    );
  }

  return { primaryProgramId };
}

async function seedOptionalLeadData(adminId: number, universityProgramId: number | null) {
  if (!SHOULD_SEED_SAMPLE_LEADS) {
    console.log("Skipping sample leads. Set SEED_SAMPLE_LEADS=true to include them.");
    return;
  }

  const lead = await prisma.lead.upsert({
    where: { email: "ravi.kumar@studentmail.com" },
    update: {
      name: "Ravi Kumar",
      phone: "9876501234",
      city: "Pune",
      state: "Maharashtra",
      source: "website",
      sourcePath: "/contact-us",
      status: LeadStatus.active,
      country: "India",
      interestedProgram: "MBBS",
      neetQualificationStatus: NeetStatus.qualified,
      neetScore: 545,
      assignedTo: adminId,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      name: "Ravi Kumar",
      email: "ravi.kumar@studentmail.com",
      phone: "9876501234",
      city: "Pune",
      state: "Maharashtra",
      source: "website",
      sourcePath: "/contact-us",
      status: LeadStatus.active,
      country: "India",
      interestedProgram: "MBBS",
      neetQualificationStatus: NeetStatus.qualified,
      neetScore: 545,
      assignedTo: adminId,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  await upsertByWhere(
    prisma.studentSchool,
    { leadId: lead.id, institutionName: "St. Xavier Higher Secondary School" },
    {
      leadId: lead.id,
      levelOfEducation: "Higher Secondary",
      countryOfEducation: "India",
      institutionName: "St. Xavier Higher Secondary School",
      gradeAverage: "82%",
    },
  );

  await upsertByWhere(
    prisma.studentDocument,
    { leadId: lead.id, documentType: "passport" },
    {
      leadId: lead.id,
      documentType: "passport",
      fileName: "ravi-passport.pdf",
      filePath: "/uploads/student-documents/ravi-passport.pdf",
      isVerified: true,
    },
  );

  await upsertByWhere(
    prisma.leadInquiry,
    { leadId: lead.id, source: "website", message: "Need counseling for September intake." },
    {
      leadId: lead.id,
      universityName: "UAE MBBS options",
      message: "Need counseling for September intake.",
      source: "website",
      status: "pending",
      agentId: adminId,
    },
  );

  if (universityProgramId) {
    await upsertByWhere(
      prisma.studentApplication,
      { leadId: lead.id, universityProgramId },
      {
        leadId: lead.id,
        universityProgramId,
        status: ApplicationStatus.applied,
        notes: "Sample dashboard application record generated by seed.",
      },
    );
  }
}

async function main() {
  console.log("🌱 Starting UAE baseline database seed...");

  const admin = await seedAdminUser();
  await seedWebsiteSettings();
  const { provinceIds, cityIds } = await seedReferenceData();
  await seedCountryAndEducationPages();
  await seedContentAndMisc(admin.id);
  const { primaryProgramId } = await seedUAEUniversities(provinceIds, cityIds);
  await seedOptionalLeadData(admin.id, primaryProgramId);

  console.log("🎉 UAE baseline seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
