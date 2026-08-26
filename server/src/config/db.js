// server/src/config/db.js
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Initialize the native pg pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter instance
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;