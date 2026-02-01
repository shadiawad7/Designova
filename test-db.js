require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conectado a la base de datos (NEON)");
    console.log("Hora del servidor:", res.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error conectando a la base de datos");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
