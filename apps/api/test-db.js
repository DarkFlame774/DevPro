const { Client } = require('pg');
require('dotenv').config();

async function testDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to devpro database successfully.');

    // 1. Insert a mock user
    const insertRes = await client.query(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, created_at;
    `, ['test@example.com', 'sreuktrjh']);
    
    const user = insertRes.rows[0];
    console.log('Inserted Mock User:', user);

    // 2. Fetch the user back to verify
    const selectRes = await client.query('SELECT * FROM users WHERE email = $1', ['test@example.com']);
    console.log('Fetched Mock User:', selectRes.rows[0]);

    // 3. Clean up the test user
    await client.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
    console.log('Cleaned up test user.');

  } catch (error) {
    console.error('Database Test Failed:', error);
  } finally {
    await client.end();
  }
}

testDatabase();
