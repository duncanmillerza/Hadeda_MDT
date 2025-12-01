/**
 * CLI script to create a local user for standalone mode
 * Usage: npm run create-user
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('\n📝 Create Local User for Standalone Mode\n')

  const email = await question('Email: ')
  const name = await question('Name: ')
  const password = await question('Password: ')
  const roleInput = await question('Role (ADMIN/MANAGER/CLINICIAN/VIEWER) [CLINICIAN]: ')
  const discipline = await question('Discipline (optional): ')

  const role = roleInput.toUpperCase() || 'CLINICIAN'

  if (!['ADMIN', 'MANAGER', 'CLINICIAN', 'VIEWER'].includes(role)) {
    console.error('❌ Invalid role. Must be ADMIN, MANAGER, CLINICIAN, or VIEWER')
    process.exit(1)
  }

  // Add to allowlist
  await prisma.clinicianAllowlist.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name,
      discipline: discipline || null,
      role: role as any,
    },
    create: {
      email: email.toLowerCase(),
      name,
      discipline: discipline || null,
      role: role as any,
    },
  })

  // Create user with hashed password
  const hashedPassword = await hash(password, 10)

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      password: hashedPassword,
      name,
      role: role as any,
      discipline: discipline || null,
    },
    create: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role as any,
      discipline: discipline || null,
    },
  })

  console.log(`\n✅ User created successfully!`)
  console.log(`   Email: ${email}`)
  console.log(`   Role: ${role}`)
  console.log(`\nYou can now sign in at http://localhost:3000/auth/sign-in\n`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })
