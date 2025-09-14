# CarShare App 🚗

A modern car sharing platform built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

## ✨ Features

- **User Management**: Host and renter accounts with verification system
- **Car Listings**: Browse available cars with detailed information and images
- **Booking System**: Complete booking flow with status tracking
- **Review System**: Rate and review cars and hosts
- **Messaging**: Communication between hosts and renters
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **UI Components**: Class Variance Authority

## 📁 Project Structure

```
car-rental-app/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding script
├── src/
│   ├── app/              # Next.js app router
│   │   ├── cars/         # Cars listing page
│   │   ├── host/         # Host registration page
│   │   ├── about/        # About page
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Homepage
│   └── components/       # Reusable components
│       ├── Navigation.tsx
│       └── Footer.tsx
├── .env                  # Environment variables
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-rental-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The app includes the following main entities:

- **User**: Hosts and renters with profile information
- **Car**: Vehicle listings with details and images
- **Booking**: Rental reservations with status tracking
- **Review**: Ratings and feedback system
- **Message**: Communication between users
- **CarImage**: Multiple images per vehicle

## 🎯 What's Been Built (Week 1)

✅ **Database Setup**
- Prisma schema with all necessary models
- SQLite database with sample data
- Seed script for testing

✅ **Basic Layout & Navigation**
- Responsive navigation component
- Footer component
- Root layout integration

✅ **Core Pages**
- Landing page with hero section and features
- Cars listing page with filters and search
- Host registration page
- About page

✅ **UI Components**
- Modern, responsive design with Tailwind CSS
- Mobile-first approach
- Consistent color scheme and typography

## 🔄 Next Steps

### Week 2: Authentication & User Management
- [ ] Implement NextAuth.js authentication
- [ ] Create login/register forms
- [ ] User profile management
- [ ] Host verification system

### Week 3: Car Management
- [ ] Car detail pages
- [ ] Image upload functionality
- [ ] Host dashboard for managing cars
- [ ] Search and filtering improvements

### Week 4: Booking System
- [ ] Booking creation flow
- [ ] Date picker and availability checking
- [ ] Booking management dashboard
- [ ] Email notifications

### Week 5-6: Advanced Features
- [ ] Review and rating system
- [ ] Messaging between users
- [ ] Payment integration (Stripe)
- [ ] Real-time updates

### Week 7-8: Polish & Deploy
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Testing
- [ ] Deployment preparation

## 🧪 Testing the App

After running the seed script, you can test the app with these sample accounts:

- **Host**: john@example.com (password: any)
- **Host**: sarah@example.com (password: any)
- **Renter**: mike@example.com (password: any)

## 📱 Available Routes

- `/` - Homepage
- `/cars` - Browse available cars
- `/host` - Become a host
- `/about` - About the company

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy coding! 🚀**
