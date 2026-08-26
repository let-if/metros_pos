// server/src/seed.js
require('dotenv').config();
const prisma = require('./config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // 1. Seed Admin Account
    const adminPinHash = await bcrypt.hash('1234', 10);
    const admin = await prisma.user.upsert({
      where: { phone: '0911223344' },
      update: {},
      create: {
        fullName: 'Abebe Kebede (Admin)',
        phone: '0911223344',
        pinHash: adminPinHash,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user ready:', { phone: admin.phone, role: admin.role });

    // 2. Seed Cashier Account
    const cashierPinHash = await bcrypt.hash('5678', 10);
    const cashier = await prisma.user.upsert({
      where: { phone: '0922334455' },
      update: {},
      create: {
        fullName: 'Tigist Mulu (Cashier)',
        phone: '0922334455',
        pinHash: cashierPinHash,
        role: 'CASHIER'
      }
    });
    console.log('✅ Cashier user ready:', { phone: cashier.phone, role: cashier.role });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();