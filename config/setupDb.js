const db = require("./database"); // Database connection

// Array of table definitions (you can add more tables as needed)
const tables = [
  {
    name: "products",
    createQuery: `
      CREATE TABLE IF NOT EXISTS products (
        p_id SERIAL PRIMARY KEY,
        sku VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        qty INT NOT NULL,
        images TEXT,
        parent_id INT,
        is_configurable BOOLEAN DEFAULT false,
        in_stock BOOLEAN DEFAULT true
      );
    `,
  },
  {
    name: "attributes",
    createQuery: `
      CREATE TABLE IF NOT EXISTS attributes (
        attribute_id SERIAL PRIMARY KEY,
        attribute_name VARCHAR(255) NOT NULL,
        attribute_type VARCHAR(255) NOT NULL
      );
    `,
  },
  {
    name: "attributes_value",
    createQuery: `
      CREATE TABLE IF NOT EXISTS attributes_value (
        value_id SERIAL PRIMARY KEY,
        attribute_id VARCHAR(255) NOT NULL,
        value VARCHAR(255) NOT NULL
      );
    `,
  },
  {
    name: "attributes_entity",
    createQuery: `
      CREATE TABLE IF NOT EXISTS attributes_entity (
        p_id INT NOT NULL,
        attribute_id VARCHAR(255) NOT NULL,
        value_id VARCHAR(255) NOT NULL
      );
    `,
  },
];

async function setupDb() {
  console.log("Starting database setup...\n");

  const totalTables = tables.length;
  let processedTables = 0;

  // Loop through each table in the tables array
  for (const table of tables) {
    processedTables++;

    console.log(`Checking if the "${table.name}" table exists...`);

    try {
      // Check if the table exists
      const checkTableQuery = `
      SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = '${table.name}'
        ) AS table_existence;
      `;

      const res = await db.query(checkTableQuery);

      // If the table doesn't exist, create it
      if (res.rows[0].table_existence === false) {
        console.log(`Table "${table.name}" does not exist. Creating it...`);
        await db.query(table.createQuery);
        console.log(`Table "${table.name}" created successfully.`);
      } else {
        console.log(`Table "${table.name}" already exists.`);
      }
    } catch (error) {
      console.error(
        `Error while checking or creating table "${table.name}":`,
        error.message
      );
    }
    // Calculate the percentage progress
    const progress = Math.round((processedTables / totalTables) * 100);
    console.log(`Progress: ${progress}%\r`);
  }

  console.log("\n\nDatabase setup completed.");
  return;
}

setupDb();
