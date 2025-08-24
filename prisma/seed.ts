import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 12);

  // Create sample users
  const host1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Smith',
      password: passwordHash,
      phone: '+1-555-0101',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isHost: true,
      isVerified: true,
    },
  });

  const host2 = await prisma.user.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      password: passwordHash,
      phone: '+1-555-0102',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      isHost: true,
      isVerified: true,
    },
  });

  const renter1 = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      email: 'mike@example.com',
      name: 'Mike Wilson',
      password: passwordHash,
      phone: '+1-555-0103',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      isHost: false,
      isVerified: true,
    },
  });

  console.log('✅ Users created');

  // Create sample cars
  const car1 = await prisma.car.create({
    data: {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      licensePlate: 'ABC123',
      vin: '1HGBH41JXMN109186',
      color: 'Silver',
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      features: 'Bluetooth, Backup Camera, Apple CarPlay',
      description: 'Well-maintained Toyota Camry with excellent fuel economy. Perfect for city driving and road trips.',
      dailyRate: 45.00,
      weeklyRate: 280.00,
      monthlyRate: 1100.00,
      location: 'Downtown New York',
      latitude: 40.7589,
      longitude: -73.9851,
      hostId: host1.id,
    },
  });

  const car2 = await prisma.car.create({
    data: {
      make: 'Honda',
      model: 'CR-V',
      year: 2021,
      licensePlate: 'XYZ789',
      vin: '5FNRL38467B024146',
      color: 'Blue',
      mileage: 22000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      doors: 5,
      features: 'AWD, Apple CarPlay, Android Auto, Heated Seats',
      description: 'Spacious Honda CR-V with all-wheel drive. Great for family trips and outdoor adventures.',
      dailyRate: 55.00,
      weeklyRate: 350.00,
      monthlyRate: 1350.00,
      location: 'Airport Area, Los Angeles',
      latitude: 33.9416,
      longitude: -118.4085,
      hostId: host2.id,
    },
  });

  const car3 = await prisma.car.create({
    data: {
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      licensePlate: 'BMW456',
      vin: 'WBA8E9G50LNT12345',
      color: 'Black',
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      features: 'Leather Seats, Navigation, Premium Sound, Sport Package',
      description: 'Luxury BMW 3 Series with premium features. Perfect for business trips and special occasions.',
      dailyRate: 85.00,
      weeklyRate: 520.00,
      monthlyRate: 2000.00,
      location: 'Uptown New York',
      latitude: 40.7505,
      longitude: -73.9934,
      hostId: host1.id,
    },
  });

  console.log('✅ Cars created');

  // Create sample car images
  await prisma.carImage.createMany({
    data: [
      {
        carId: car1.id,
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
        alt: 'Toyota Camry Silver',
        isPrimary: true,
      },
      {
        carId: car2.id,
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
        alt: 'Honda CR-V Blue',
        isPrimary: true,
      },
      {
        carId: car3.id,
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
        alt: 'BMW 3 Series Black',
        isPrimary: true,
      },
    ],
  });

  console.log('✅ Car images created');

  // Create sample booking
  const booking1 = await prisma.booking.create({
    data: {
      startDate: new Date('2024-12-25'),
      endDate: new Date('2024-12-27'),
      totalPrice: 135.00,
      status: 'CONFIRMED',
      pickupLocation: 'Downtown New York',
      dropoffLocation: 'Downtown New York',
      notes: 'Airport pickup needed',
      userId: renter1.id,
      carId: car1.id,
    },
  });

  console.log('✅ Booking created');

  // Create sample review
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent car and great service! The Toyota Camry was clean and well-maintained. Highly recommend!',
      userId: renter1.id,
      carId: car1.id,
      bookingId: booking1.id,
      reviewedUserId: host1.id,
    },
  });

  console.log('✅ Review created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('📝 Test accounts created:');
  console.log('   - Host: john@example.com / password123');
  console.log('   - Host: sarah@example.com / password123');
  console.log('   - Renter: mike@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
