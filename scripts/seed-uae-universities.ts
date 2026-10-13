import { prisma } from '../src/lib/prisma';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log('🌱 Seeding 5 Top UAE Medical Universities with Accurate Coordinates...');

  const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const universities = [
    {
      name: 'Gulf Medical University (GMU)',
      uniqueId: 'UAE-GMU-001',
      city: 'Ajman',
      establishedYear: 1998,
      students: '3,000+',
      tuitionFee: '$35,000',
      globalRanking: 'Top Medical University in UAE & Region',
      nationalRanking: '1',
      shortnote: 'UAE’s leading private medical university affiliated with the Thumbay network of academic hospitals.',
      aboutNote: 'Gulf Medical University (GMU), established in 1998, is one of the premier medical universities in the Middle East. Located in Ajman, GMU operates Thumbay University Hospital, providing clinical training with American and British standard curricula recognized by WHO, NMC, ECFMG, and MOHAP.',
      tuitionFeeAnnual: '$35,000',
      courseDuration: '6 Years (including Clinical Rotations & Internship)',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (60%+), NEET Qualified (for Indian students)',
      status: true,
      isFeatured: true,
      provinceId: 4, // Emirate of Ajman
      cityId: 5, // Ajman
      instituteTypeId: 2, // Private
      latitude: 25.4052,
      longitude: 55.5136,
    },
    {
      name: 'Mohammed Bin Rashid University of Medicine and Health Sciences (MBRU)',
      uniqueId: 'UAE-MBRU-002',
      city: 'Dubai',
      establishedYear: 2016,
      students: '1,500+',
      tuitionFee: '$42,000',
      globalRanking: 'Top 150 Young Universities in Asia',
      nationalRanking: '2',
      shortnote: 'World-class academic health center located inside Dubai Healthcare City (DHCC).',
      aboutNote: 'MBRU is a world-class academic institution situated in the heart of Dubai Healthcare City. It offers integrated clinical clerkships in collaboration with Dubai Academic Health Corporation (DAHC) and Rashid Hospital, featuring high-fidelity simulation and robotic surgical research.',
      tuitionFeeAnnual: '$42,000',
      courseDuration: '6 Years',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (65%+), NEET Qualified',
      status: true,
      isFeatured: true,
      provinceId: 2, // Emirate of Dubai
      cityId: 3, // Dubai
      instituteTypeId: 2, // Private / Specialized
      latitude: 25.2315,
      longitude: 55.3225,
    },
    {
      name: 'United Arab Emirates University College of Medicine (UAEU)',
      uniqueId: 'UAE-UAEU-003',
      city: 'Al Ain',
      establishedYear: 1976,
      students: '14,000+',
      tuitionFee: '$38,000',
      globalRanking: 'Ranked #290 in QS World University Rankings',
      nationalRanking: '1 (Federal)',
      shortnote: 'UAE’s first and premier national federal university with world-class Tawam Teaching Hospital.',
      aboutNote: 'The College of Medicine and Health Sciences at UAEU in Al Ain is the nation’s flagship medical school. Affiliated with Tawam Hospital and Al Ain Hospital, it provides high-quality clinical clerkships and postgraduate medical pathways recognized across the UK, USA, and India.',
      tuitionFeeAnnual: '$38,000',
      courseDuration: '6 Years',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (65%+), NEET Qualified',
      status: true,
      isFeatured: true,
      provinceId: 1, // Emirate of Abu Dhabi
      cityId: 2, // Al Ain
      instituteTypeId: 1, // Public / Federal
      latitude: 24.1989,
      longitude: 55.6791,
    },
    {
      name: 'University of Sharjah College of Medicine',
      uniqueId: 'UAE-UOS-004',
      city: 'Sharjah',
      establishedYear: 2004,
      students: '16,000+',
      tuitionFee: '$30,000',
      globalRanking: 'Top 400 World Universities (THE Rankings)',
      nationalRanking: 'Top Regional Flagship',
      shortnote: 'Leading medical campus in University City Sharjah with University Hospital Sharjah (UHS).',
      aboutNote: 'University of Sharjah College of Medicine provides a patient-centered, problem-based medical curriculum. With University Hospital Sharjah and University Dental Hospital on campus, it provides students with exceptional clinical and surgical exposure.',
      tuitionFeeAnnual: '$30,000',
      courseDuration: '6 Years',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (60%+), NEET Qualified',
      status: true,
      isFeatured: false,
      provinceId: 3, // Emirate of Sharjah
      cityId: 4, // Sharjah
      instituteTypeId: 2, // Private
      latitude: 25.2917,
      longitude: 55.4746,
    },
    {
      name: 'RAK Medical and Health Sciences University (RAKMHSU)',
      uniqueId: 'UAE-RAK-005',
      city: 'Ras Al Khaimah',
      establishedYear: 2006,
      students: '2,000+',
      tuitionFee: '$28,000',
      globalRanking: 'Pioneer Medical University in Northern Emirates',
      nationalRanking: 'Premier Regional Health Hub',
      shortnote: 'First comprehensive health sciences university established by the Government of Ras Al Khaimah.',
      aboutNote: 'RAKMHSU offers CAA and MOHAP accredited medical programs with clinical training in Saqr Hospital and Ibrahim Bin Hamad Obaidullah Hospital. It is a preferred destination for international Indian students seeking NMC-compliant MBBS abroad in UAE.',
      tuitionFeeAnnual: '$28,000',
      courseDuration: '5.5 - 6 Years',
      mediumOfInstruction: 'English',
      eligibility: '12th Grade with PCB (60%+), NEET Qualified',
      status: true,
      isFeatured: false,
      provinceId: 5, // Emirate of Ras Al Khaimah
      cityId: 6, // Ras Al Khaimah
      instituteTypeId: 2, // Private
      latitude: 25.7953,
      longitude: 55.9769,
    },
  ];

  for (const u of universities) {
    const slug = slugify(u.name);

    // 1. Create/Update University
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
        provinceId: u.provinceId,
        cityId: u.cityId,
        instituteTypeId: u.instituteTypeId,
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
        provinceId: u.provinceId,
        cityId: u.cityId,
        instituteTypeId: u.instituteTypeId,
        latitude: u.latitude,
        longitude: u.longitude,
      },
    });

    console.log(`✅ Seeded University: ${university.name} (${u.city}) [${u.latitude}, ${u.longitude}]`);
  }

  console.log('🎉 5 UAE Universities with Real Coordinates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding universities:', e);
    process.exit(1);
  });
