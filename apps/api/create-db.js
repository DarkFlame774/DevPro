const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default database first
  });

  try {
    await client.connect();
    
    // Check if database already exists
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = 'devpro'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE devpro');
      console.log('Database "devpro" created successfully.');
    } else {
      console.log('Database "devpro" already exists.');
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }
}

createDatabase();
