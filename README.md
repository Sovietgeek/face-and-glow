# Face and Glow - Ladies Beauty Parlour Booking System

A complete, professional beauty parlour website built with Next.js 16, Neon PostgreSQL, Better Auth, and Drizzle ORM.

## ✨ Features

### Public Website
- **Elegant Rose Gold & Cream Theme** - Premium, feminine design perfect for a beauty brand
- **Home Page** - Hero section, featured services, customer reviews, and clear CTAs
- **Services Catalog** - 32 services across 8 categories with prices in INR (₹)
  - Hair (Haircut, Color, Spa, etc.)
  - Skin & Facial (Facials, treatments, etc.)
  - Makeup (Party, Bridal HD, Guest, etc.)
  - Mehndi (Bridal, Simple)
  - Nails (Manicure, Pedicure, Extensions, Art)
  - Waxing & Threading
  - Spa & Body
  - Bridal Packages
- **Online Booking** - Add services to cart → Select date/time → Confirm booking with "Pay at Salon"
- **Customer Reviews** - Display approved reviews with ratings (8 pre-seeded reviews)
- **Cart System** - Local storage + real-time updates

### User Features
- **Email/Password Authentication** - Secure signup and login
- **User Account Dashboard** - View booking history, cancel bookings, post reviews
- **Booking Management** - See all past and upcoming appointments with details

### Admin Dashboard
- **Business Overview**
  - Today's appointments count
  - Today's booked value
  - Pending confirmations
  - Total customers
  - Total revenue (completed bookings)
- **Charts & Analytics**
  - Weekly/Monthly bookings & revenue trends
  - Bar charts for visual insights
- **Bookings Management**
  - View all bookings with customer details
  - Update booking status (Pending → Confirmed → In Progress → Completed)
  - Mark payment status (Unpaid/Paid)
  - Search and filter bookings
- **Today's Schedule** - Quick view of appointments with time alerts
- **Services Management**
  - Add/Edit services
  - Manage pricing, duration, category
  - Toggle active/featured status
  - Track service inventory
- **Customer List** - View all registered customers and booking counts
- **Review Moderation** - Approve/reject customer reviews before display

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Authentication**: Better Auth (email + password)
- **UI Components**: shadcn/ui + Tailwind CSS v4
- **Charts**: Recharts
- **State Management**: React Context (Cart), SWR (data fetching)
- **Styling**: Tailwind CSS with semantic design tokens

## 📊 Database Schema

- **user** - User accounts (email, password, role: 'user'/'admin')
- **session** - Better Auth sessions
- **account** - Better Auth accounts
- **verification** - Email verification tokens
- **services** - Service catalog (name, price, duration, category, featured)
- **bookings** - Appointment bookings (date, time, status, payment)
- **booking_items** - Services within each booking
- **reviews** - Customer reviews with approval flag

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- Environment variables set up

### Setup
```bash
pnpm install
pnpm dev
```

### Seeded Admin Account
- **Email**: `admin@faceandglow.in`
- **Password**: `Admin@FaceGlow2026`

### Test User (auto-created on signup)
- Create account via /sign-up
- Book appointments and manage bookings

## 📱 Key Routes

**Public**
- `/` - Home
- `/services` - Service catalog
- `/reviews` - Customer reviews
- `/cart` - Shopping cart
- `/booking` - Booking form
- `/booking/confirmation/[id]` - Confirmation

**Protected (User)**
- `/sign-in` - Login
- `/sign-up` - Register
- `/account` - User profile & bookings

**Protected (Admin)**
- `/admin` - Dashboard
- `/admin/bookings` - Bookings management
- `/admin/services` - Services manager
- `/admin/customers` - Customer list
- `/admin/reviews` - Review moderation

## 🎨 Design

- **Colors**: Rose Gold (#c8645b), Cream (#f5f5f0), Light Rose (#f9ede8)
- **Typography**: Serif headings (font-serif), Sans-serif body (font-sans)
- **Layout**: Mobile-first responsive design
- **Icons**: Lucide React

## ✅ Testing Checklist

- [x] User signup & login
- [x] Add services to cart
- [x] Select booking date/time
- [x] Complete booking confirmation
- [x] View booking history
- [x] Admin login
- [x] Admin dashboard stats
- [x] View today's schedule
- [x] Update booking status
- [x] Services management
- [x] Customer list view
- [x] Review moderation

## 🚀 Deployment

Ready to deploy to Vercel with:
```bash
vercel deploy
```

All environment variables are automatically configured through integrations.

## 📝 License

© 2026 Face and Glow. All rights reserved.
