/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:password@localhost:5432/tsl_db',
  });

  const email = 'aslahfarhanma@gmail.com'.toLowerCase();
  const password = 'Aslah@8525';
  
  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const res = await pool.query(
      'UPDATE "User" SET role = $1, password = $2 WHERE email = $3 RETURNING email, role',
      ['admin', hashedPassword, email]
    );

    if (res.rows.length > 0) {
      console.log('User updated via pg:', res.rows[0]);
    } else {
      console.log('User not found in DB! Trying to create...');
      // Need to insert if not exists
      const insert = await pool.query(
        'INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING email, role',
        ['user_' + Date.now(), email, 'Aslah Farhan', hashedPassword, 'admin']
      );
      console.log('User created:', insert.rows[0]);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
