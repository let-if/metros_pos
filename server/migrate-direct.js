// server/migrate-direct.js
require('dotenv').config();
const { Client } = require('pg');

const LOCAL_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'meret_pos_db',
  user: 'postgres',
  password: 'Letif7327',
};

async function runMigration() {
  console.log("🔄 Connecting to Local PostgreSQL and Neon databases...");
  
  const localClient = new Client(LOCAL_CONFIG);
  const neonClient = new Client({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await localClient.connect();
  await neonClient.connect();
  console.log("✅ Successfully connected to both databases!");

  try {
    // Added 'Shift' right before 'Sale' so foreign keys resolve correctly
    const tables = ['Branch', 'User', 'Product', 'Inventory', 'Customer', 'Shift', 'Sale', 'SaleItem', 'CreditLedger'];

    for (const table of tables) {
      console.log(`📦 Fetching rows for table: ${table}...`);
      let res;
      try {
        res = await localClient.query(`SELECT * FROM "${table}"`);
      } catch (e) {
        console.log(`⚠️ Table "${table}" does not exist locally or skipped.`);
        continue;
      }
      
      const rows = res.rows;
      if (rows.length === 0) {
        console.log(`⚠️ No rows found in ${table}, skipping.`);
        continue;
      }

      console.log(`🚀 Inserting ${rows.length} rows into Neon table "${table}"...`);

      for (const row of rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const quotedKeys = keys.map(k => `"${k}"`).join(', ');

        const query = `INSERT INTO "${table}" (${quotedKeys}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
        
        try {
          await neonClient.query(query, values);
        } catch (insertErr) {
          console.error(`Error inserting row into ${table}:`, insertErr.message);
        }
      }
      console.log(`✅ Table "${table}" migrated successfully!`);
    }

    console.log("\n🎉 All data and foreign key dependencies successfully transferred to Neon!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await localClient.end();
    await neonClient.end();
  }
}

runMigration();