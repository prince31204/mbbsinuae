import { prisma } from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('🌱 Starting Comprehensive UAE Seeding...');

  // 1. Initialize Admin User
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your .env file'
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword as string, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: true,
    },
  });
  console.log(`✅ Admin initialized: ${admin.email}`);

  // 2. Seed Institute Types
  const instituteTypes = ['Public / Federal', 'Private', 'Specialized Medical Institute'];
  for (const name of instituteTypes) {
    await prisma.instituteType.upsert({
      where: { id: instituteTypes.indexOf(name) + 1 },
      update: { name },
      create: { name },
    });
  }
  console.log('✅ Institute types seeded.');

  // 3. Seed Emirates (Provinces) of UAE
  const provinces = [
    'Emirate of Abu Dhabi',
    'Emirate of Dubai',
    'Emirate of Sharjah',
    'Emirate of Ajman',
    'Emirate of Ras Al Khaimah',
    'Emirate of Fujairah',
    'Emirate of Umm Al Quwain',
  ];

  for (const name of provinces) {
    await prisma.province.upsert({
      where: { id: provinces.indexOf(name) + 1 },
      update: { name },
      create: { name },
    });
  }
  console.log('✅ Emirates/Provinces seeded.');

  // 4. Seed Cities of UAE
  const cities = [
    { name: 'Abu Dhabi', provinceId: 1 },
    { name: 'Al Ain', provinceId: 1 },
    { name: 'Dubai', provinceId: 2 },
    { name: 'Sharjah', provinceId: 3 },
    { name: 'Ajman', provinceId: 4 },
    { name: 'Ras Al Khaimah', provinceId: 5 },
    { name: 'Fujairah', provinceId: 6 },
    { name: 'Umm Al Quwain', provinceId: 7 },
  ];

  for (const [index, city] of cities.entries()) {
    await prisma.city.upsert({
      where: { id: index + 1 },
      update: { name: city.name, provinceId: city.provinceId },
      create: { name: city.name, provinceId: city.provinceId },
    });
  }
  console.log('✅ Cities seeded.');

  // 5. Seed About Country Page
  const aboutUAE = await prisma.aboutCountryPage.upsert({
    where: { id: 1 },
    update: {
      name: 'United Arab Emirates',
      tagline: 'World-Class Healthcare and Modern Medical Education Hub in the Middle East',
      capital: 'Abu Dhabi',
      population: '10.2 Million+',
      languages: 'Arabic (Official), English (Widely Spoken & Medium of Instruction)',
      currency: 'AED (UAE Dirham)',
      location: 'Arabian Peninsula, Middle East',
      timezone: 'UTC+4 (GST - Gulf Standard Time)',
      independenceDay: new Date('1971-12-02'),
      highestPeak: 'Jebel Jais',
      highestPeakHeight: '1,934 m',
      whoRecognized: true,
      mbbsAffordableEducation: 'World-leading medical infrastructure, modern teaching hospitals, and NMC/WHO/MOHAP recognized medical programs.',
      englishMedium: true,
      academicExcellence: 'UAE features globally recognized medical universities affiliated with modern clinical hospital networks and American/British curricula.',
      studentLife: 'World-renowned ultra-safe, cosmopolitan lifestyle with modern student residences, state-of-the-art public transport, and multicultural community.',
      visaConnectivity: 'Streamlined UAE Student Visa process, easy Golden Visa eligibility for high achievers, and direct 3-4 hour flights from India.',
      publicHealthcare: 'World-class healthcare system regulated by MOHAP, DHA, and DOH with JCI-accredited tertiary teaching hospitals.',
      tourismGrowth: 'Global hub for innovation, iconic landmarks, luxury lifestyle, and cultural diversity.',
    },
    create: {
      id: 1,
      name: 'United Arab Emirates',
      tagline: 'World-Class Healthcare and Modern Medical Education Hub in the Middle East',
      capital: 'Abu Dhabi',
      population: '10.2 Million+',
      languages: 'Arabic (Official), English (Widely Spoken & Medium of Instruction)',
      currency: 'AED (UAE Dirham)',
      location: 'Arabian Peninsula, Middle East',
      timezone: 'UTC+4 (GST - Gulf Standard Time)',
      independenceDay: new Date('1971-12-02'),
      highestPeak: 'Jebel Jais',
      highestPeakHeight: '1,934 m',
      whoRecognized: true,
      mbbsAffordableEducation: 'World-leading medical infrastructure, modern teaching hospitals, and NMC/WHO/MOHAP recognized medical programs.',
      englishMedium: true,
      academicExcellence: 'UAE features globally recognized medical universities affiliated with modern clinical hospital networks and American/British curricula.',
      studentLife: 'World-renowned ultra-safe, cosmopolitan lifestyle with modern student residences, state-of-the-art public transport, and multicultural community.',
      visaConnectivity: 'Streamlined UAE Student Visa process, easy Golden Visa eligibility for high achievers, and direct 3-4 hour flights from India.',
      publicHealthcare: 'World-class healthcare system regulated by MOHAP, DHA, and DOH with JCI-accredited tertiary teaching hospitals.',
      tourismGrowth: 'Global hub for innovation, iconic landmarks, luxury lifestyle, and cultural diversity.',
    },
  });

  // Seed Major Cities in About Country
  const majorCitiesAbout = [
    { cityName: 'Dubai', description: 'Global healthcare metropolis home to Dubai Healthcare City (DHCC) and premier medical colleges.', population: '3.6 Million+' },
    { cityName: 'Abu Dhabi', description: 'The vibrant capital city offering cutting-edge medical research and federal universities.', population: '1.8 Million+' },
    { cityName: 'Ajman', description: 'Renowned education hub housing Gulf Medical University and Thumbay Hospital network.', population: '500,000+' },
  ];

  for (const city of majorCitiesAbout) {
    await prisma.countryMajorCity.upsert({
      where: { id: majorCitiesAbout.indexOf(city) + 1 },
      update: { ...city, pageId: aboutUAE.id },
      create: { ...city, pageId: aboutUAE.id },
    });
  }

  // Seed Cuisines
  const cuisines = [
    { dishName: 'Al Machboos', dishDescription: 'UAE’s signature spiced rice dish cooked with tender meat or chicken, dried lime, and aromatic spices.' },
    { dishName: 'Al Harees', dishDescription: 'Traditional Emirati slow-cooked wheat and meat dish known for its rich flavor and nutritious value.' },
    { dishName: 'Luqaimat', dishDescription: 'Beloved Emirati golden fried dough dumplings drizzled with rich date syrup and toasted sesame.' },
  ];

  for (const cuisine of cuisines) {
    await prisma.countryCuisineLifestyle.upsert({
      where: { id: cuisines.indexOf(cuisine) + 1 },
      update: { ...cuisine, pageId: aboutUAE.id },
      create: { ...cuisine, pageId: aboutUAE.id },
    });
  }

  // Seed Attractions
  const attractions = [
    { attractionName: 'Burj Khalifa & Downtown Dubai', description: 'The world’s tallest tower and an architectural wonder set at the heart of Dubai.' },
    { attractionName: 'Sheikh Zayed Grand Mosque', description: 'One of the world’s largest and most breathtaking mosques located in Abu Dhabi.' },
    { attractionName: 'Louvre Abu Dhabi', description: 'Iconic universal museum on Saadiyat Island showcasing civilizational art and history.' },
  ];

  for (const attraction of attractions) {
    await prisma.countryTouristAttraction.upsert({
      where: { id: attractions.indexOf(attraction) + 1 },
      update: { ...attraction, pageId: aboutUAE.id },
      create: { ...attraction, pageId: aboutUAE.id },
    });
  }

  // Seed Lifestyles/Culture
  const lifestyles = [
    { title: 'World-Class Safety', description: 'Ranked among the safest countries globally with zero-tolerance crime policy and 24/7 security.' },
    { title: 'Tax-Free & Thriving Economy', description: 'High standard of living, tax-free income opportunities for doctors, and rapid career growth.' },
    { title: 'Multicultural Student Environment', description: 'Home to 200+ nationalities, vibrant Indian diaspora, authentic Indian food, and festive celebrations.' },
  ];

  for (const lifestyle of lifestyles) {
    await prisma.countryLifestyleCulture.upsert({
      where: { id: lifestyles.indexOf(lifestyle) + 1 },
      update: { ...lifestyle, pageId: aboutUAE.id },
      create: { ...lifestyle, pageId: aboutUAE.id },
    });
  }
  console.log('✅ About UAE content seeded.');

  // 6. Seed Education System
  const eduSystem = await prisma.educationSystem.upsert({
    where: { id: 1 },
    update: {
      title: 'Education System in UAE',
      description: 'The UAE medical education framework complies with international guidelines from WHO, WFME, and NMC, regulated by CAA and MOHAP.',
      introductionTitle: 'A Global Benchmark in Modern Healthcare Education',
      introductionDescription: 'UAE offers world-class medical education featuring American and British clinical curriculum models, advanced simulation labs, and JCI-accredited hospital training.',
      literacyRate: 98.2,
      higherEducationDescription: 'The UAE higher education ecosystem features leading federal and accredited private medical universities offering globally valid MBBS/MD degrees.',
      universitiesCount: 15,
      universitiesNote: 'Including top CAA-accredited medical colleges and internationally affiliated teaching hospitals.',
      officialLanguage: 'Arabic',
      officialLanguageNote: 'Official language of the country, while 100% of medical education is delivered in English.',
      foreignLanguage: 'English',
      foreignLanguageNote: 'Primary medium of instruction, clinical lectures, medical textbooks, and examinations.',
    },
    create: {
      id: 1,
      title: 'Education System in UAE',
      description: 'The UAE medical education framework complies with international guidelines from WHO, WFME, and NMC, regulated by CAA and MOHAP.',
      introductionTitle: 'A Global Benchmark in Modern Healthcare Education',
      introductionDescription: 'UAE offers world-class medical education featuring American and British clinical curriculum models, advanced simulation labs, and JCI-accredited hospital training.',
      literacyRate: 98.2,
      higherEducationDescription: 'The UAE higher education ecosystem features leading federal and accredited private medical universities offering globally valid MBBS/MD degrees.',
      universitiesCount: 15,
      universitiesNote: 'Including top CAA-accredited medical colleges and internationally affiliated teaching hospitals.',
      officialLanguage: 'Arabic',
      officialLanguageNote: 'Official language of the country, while 100% of medical education is delivered in English.',
      foreignLanguage: 'English',
      foreignLanguageNote: 'Primary medium of instruction, clinical lectures, medical textbooks, and examinations.',
    },
  });

  // Seed School Levels
  const schoolLevels = [
    { level: 'Pre-Clinical Phase', ageRange: '18-20', durationYears: 2, title: 'Anatomy, Physiology, Biochemistry & Medical Sciences' },
    { level: 'Clinical Sciences Phase', ageRange: '20-23', durationYears: 3, title: 'Pathology, Pharmacology, Medicine, Surgery & Hospital Rotations' },
    { level: 'Compulsory Rotating Internship', ageRange: '23+', durationYears: 1, title: 'Hands-on Clinical Internship in JCI-Accredited Teaching Hospitals' },
  ];

  for (const level of schoolLevels) {
    await prisma.educationSchoolLevel.upsert({
      where: { id: schoolLevels.indexOf(level) + 1 },
      update: { ...level, pageId: eduSystem.id },
      create: { ...level, pageId: eduSystem.id },
    });
  }

  // Seed Degrees
  const degrees = [
    { degree: 'MBBS / MD General Medicine', duration: '5 - 6 Years', recognition: 'Recognized by NMC (India), WHO (WDOMS), ECFMG (USA), GMC (UK), and MOHAP (UAE)' },
    { degree: 'Bachelor of Dental Surgery (BDS)', duration: '5 Years', recognition: 'Global Dental Council & MOHAP Accreditation' },
    { degree: 'Doctor of Pharmacy (PharmD)', duration: '5 Years', recognition: 'Leading International Pharmacy Education Standards' },
  ];

  for (const deg of degrees) {
    await prisma.educationDegree.upsert({
      where: { id: degrees.indexOf(deg) + 1 },
      update: { ...deg, pageId: eduSystem.id },
      create: { ...deg, pageId: eduSystem.id },
    });
  }

  // Seed Popular Fields
  const fields = [
    { field: 'General Medicine & Surgery (MBBS)', description: 'Complete medical qualification with extensive clinical rotations in JCI-accredited hospital networks.', durationYears: '5-6 Years', numberOfInstitutions: 'Leading Medical Colleges' },
    { field: 'Clinical Simulation & Emergency Medicine', description: 'Advanced training in high-fidelity simulation centers and emergency care.', durationYears: 'Specialization Track', numberOfInstitutions: 'Teaching Hospitals' },
    { field: 'Biomedical & Genomic Research', description: 'Innovative medical sciences training aligned with UAE National Genome Strategy.', durationYears: '4 Years', numberOfInstitutions: 'Top Research Universities' },
  ];

  for (const field of fields) {
    await prisma.educationPopularField.upsert({
      where: { id: fields.indexOf(field) + 1 },
      update: { ...field, pageId: eduSystem.id },
      create: { ...field, pageId: eduSystem.id },
    });
  }

  console.log('✅ Education system content seeded.');
  console.log('🎉 Comprehensive UAE Seeding Finished Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  });
