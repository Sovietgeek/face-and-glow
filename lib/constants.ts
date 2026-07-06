export const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
] as const

export const CATEGORIES = [
  { name: 'Hair', image: '/images/cat-hair.png' },
  { name: 'Skin & Facial', image: '/images/cat-facial.png' },
  { name: 'Makeup', image: '/images/cat-makeup.png' },
  { name: 'Mehndi', image: '/images/cat-mehndi.png' },
  { name: 'Nails', image: '/images/cat-nails.png' },
  { name: 'Waxing & Threading', image: '/images/cat-waxing.png' },
  { name: 'Spa & Body', image: '/images/cat-spa.png' },
  { name: 'Bridal Packages', image: '/images/cat-bridal.png' },
] as const

export const categoryImage = (category: string) =>
  CATEGORIES.find((c) => c.name === category)?.image ?? '/images/cat-facial.png'

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

export const SALON_INFO = {
  name: 'Face and Glow',
  tagline: 'Where Beauty Meets Elegance',
  phone: '+91 98765 43210',
  address: 'Shop No. 12, Beauty Plaza, Main Market Road',
  hours: 'Open Daily: 10:00 AM - 8:00 PM',
  email: 'hello@faceandglow.in',
}
