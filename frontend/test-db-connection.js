// Test database connection
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:CmIXM3To4DzP8bTES2Bp@foundry-database.cihg6s2a4gb2.us-east-1.rds.amazonaws.com:5432/MyDB';

console.log("Testing database connection...");
console.log("Database URL:", databaseUrl.replace(/:[^:@]+@/, ':****@')); // Hide password

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log("\n1. Testing connection...");
        const client = await pool.connect();
        console.log("✅ Connection successful!");

        console.log("\n2. Testing query...");
        const result = await client.query('SELECT NOW()');
        console.log("✅ Query successful:", result.rows[0]);

        console.log("\n3. Checking users table...");
        const usersCheck = await client.query("SELECT COUNT(*) FROM users");
        console.log("✅ Users table exists, count:", usersCheck.rows[0].count);

        console.log("\n4. Checking table structure...");
        const tableInfo = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);
        console.log("✅ Users table structure:");
        console.table(tableInfo.rows);

        client.release();
        await pool.end();
        
        console.log("\n✅ All tests passed! Database is working correctly.");
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Database test failed:");
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
        console.error("Error detail:", err.detail);
        
        if (err.code === '28P01') {
            console.error("\n🔑 AUTHENTICATION FAILED!");
            console.error("The password is incorrect or the user 'postgres' doesn't have access.");
            console.error("\nPossible fixes:");
            console.error("1. Check if the password in .env.local is correct");
            console.error("2. Verify the RDS instance security group allows your IP");
            console.error("3. Check if the master password was changed in AWS RDS console");
            console.error("4. Try resetting the master password in AWS RDS console");
        }
        
        await pool.end();
        process.exit(1);
    }
}

testConnection();
