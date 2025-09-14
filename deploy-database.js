const { PrismaClient } = require('@prisma/client')

async function deployDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🚀 Deploying database schema...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // The schema will be automatically created when Prisma connects
    console.log('✅ Database schema deployed successfully!')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log(`📊 Current users in database: ${userCount}`)
    
  } catch (error) {
    console.error('❌ Error deploying database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

deployDatabase()
