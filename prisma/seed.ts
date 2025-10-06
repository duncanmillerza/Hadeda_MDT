import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create allowlist entries
  const allowlist = await prisma.clinicianAllowlist.createMany({
    data: [
      {
        email: 'admin@hadedahealth.com',
        name: 'Admin User',
        discipline: 'Administration',
        role: 'ADMIN',
      },
      {
        email: 'manager@hadedahealth.com',
        name: 'Manager User',
        discipline: 'Management',
        role: 'MANAGER',
      },
      {
        email: 'clinician@hadedahealth.com',
        name: 'Clinician User',
        discipline: 'Physiotherapy',
        role: 'CLINICIAN',
      },
    ],
    skipDuplicates: true,
  })

  console.log(`✅ Created ${allowlist.count} allowlist entries`)

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        fullName: 'John Doe',
        age: 45,
        diagnosis: 'Post-stroke rehabilitation',
        status: 'ACTIVE',
        disciplines: ['Physiotherapy', 'Occupational Therapy'],
        modality: 'F2F',
        medicalAid: 'Discovery Health',
        lastMeetingComment: 'Progressing well with mobility exercises',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'Jane Smith',
        age: 62,
        diagnosis: 'Total knee replacement',
        status: 'ACTIVE',
        disciplines: ['Physiotherapy'],
        modality: 'HBR',
        medicalAid: 'Momentum Health',
        lastMeetingComment: 'Requires pain management review',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'Robert Johnson',
        age: 38,
        diagnosis: 'Chronic lower back pain',
        status: 'WAITING_AUTH',
        disciplines: ['Physiotherapy', 'Biokineticist'],
        modality: 'F2F',
        medicalAid: 'Bonitas',
        authLeft: 'Waiting for authorization - 12 sessions',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'Mary Williams',
        age: 55,
        diagnosis: 'Shoulder impingement',
        status: 'DISCHARGED',
        disciplines: ['Physiotherapy'],
        modality: 'F2F',
        medicalAid: 'Fedhealth',
        lastMeetingComment: 'Successfully completed treatment plan',
      },
    }),
    prisma.patient.create({
      data: {
        fullName: 'David Brown',
        age: 71,
        diagnosis: 'Traumatic brain injury',
        status: 'HEADWAY',
        disciplines: ['Occupational Therapy', 'Speech Therapy'],
        modality: 'HBR',
        lastMeetingComment: 'Referred to Headway program',
      },
    }),
  ])

  console.log(`✅ Created ${patients.length} sample patients`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
