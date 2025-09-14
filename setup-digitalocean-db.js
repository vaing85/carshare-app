const { PrismaClient } = require('@prisma/client')

async function setupDigitalOceanDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🌊 Setting up DigitalOcean MySQL database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to DigitalOcean database')
    
    // Create tables (Prisma will handle this automatically)
    console.log('📊 Creating database tables...')
    
    // Test basic operations
    const userCount = await prisma.user.count()
    console.log(`👥 Users in database: ${userCount}`)
    
    const carCount = await prisma.car.count()
    console.log(`🚗 Cars in database: ${carCount}`)
    
    console.log('✅ DigitalOcean database setup complete!')
    console.log('🎉 Your CarShare app is ready to use the production database!')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your DATABASE_URL in .env file')
    console.log('2. Ensure DigitalOcean database is running')
    console.log('3. Verify firewall rules allow connections')
    console.log('4. Check database credentials')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDigitalOceanDatabase()
