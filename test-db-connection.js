const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔌 Testing DigitalOcean PostgreSQL connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to DigitalOcean PostgreSQL!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('📊 PostgreSQL version:', result[0].version)
    
    console.log('🎉 Database connection test successful!')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check if the database is running in DigitalOcean')
    console.log('2. Verify the connection string is correct')
    console.log('3. Check firewall rules allow connections')
    console.log('4. Ensure SSL is properly configured')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
