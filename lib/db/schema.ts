import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  date,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  role: text('role').notNull().default('user'),
  phone: text('phone'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  durationMinutes: integer('durationMinutes').notNull(),
  image: text('image'),
  isActive: boolean('isActive').notNull().default(true),
  isFeatured: boolean('isFeatured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  bookingDate: date('bookingDate').notNull(),
  timeSlot: text('timeSlot').notNull(),
  status: text('status').notNull().default('pending'),
  totalAmount: integer('totalAmount').notNull(),
  paymentMethod: text('paymentMethod').notNull().default('pay_at_salon'),
  paymentStatus: text('paymentStatus').notNull().default('unpaid'),
  customerName: text('customerName').notNull(),
  customerPhone: text('customerPhone').notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const bookingItems = pgTable('booking_items', {
  id: serial('id').primaryKey(),
  bookingId: integer('bookingId').notNull(),
  serviceId: integer('serviceId').notNull(),
  serviceName: text('serviceName').notNull(),
  price: integer('price').notNull(),
  durationMinutes: integer('durationMinutes').notNull(),
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  userId: text('userId'),
  customerName: text('customerName').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  serviceName: text('serviceName'),
  isApproved: boolean('isApproved').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
