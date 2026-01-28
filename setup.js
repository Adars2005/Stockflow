const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up StockFlow database...');

// Ensure DATABASE_URL is set
process.env.DATABASE_URL = 'file:./prisma/dev.db';

try {
    //  Ensure prisma directory exists
    const prismaDir = path.join(__dirname, 'prisma');
    if (!fs.existsSync(prismaDir)) {
        fs.mkdirSync(prismaDir, { recursive: true });
    }

    // Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: 'file:./prisma/dev.db' } });

    // Push schema to database
    console.log('🗄️  Creating database schema...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: { ...process.env, DATABASE_URL: 'file:./prisma/dev.db' } });

    console.log('✅ Database setup complete!');
} catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
}
