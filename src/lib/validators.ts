import { z } from 'zod'

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
})

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
})

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const addressSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(2, 'Name is required').max(100),
  phone: z.string().min(10, 'Valid phone required').max(15),
  line1: z.string().min(5, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().min(5, 'PIN code is required').max(10),
  isDefault: z.boolean().optional().default(false),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required').max(255),
  slug: z.string().min(2).max(255),
  groupSlug: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  foodType: z.string().optional().nullable(),
  popularTags: z.array(z.string()).default([]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(160).optional(),
  price: z.number().min(0, 'Price must be positive'),
  comparePrice: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  sku: z.string().optional(),
  weight: z.string().optional(),
  tags: z.array(z.string()).default([]),
  ingredients: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  bestSeller: z.boolean().default(false),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email required'),
  customerPhone: z.string().min(10, 'Valid phone required'),
  shippingAddress: z.object({
    street: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(5, 'PIN code is required'),
  }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    image: z.string().default(''),
    price: z.number().min(0),
    quantity: z.number().int().min(1),
  })).min(1, 'At least one item is required'),
  subtotal: z.number().min(0),
  shippingCharge: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0),
  paymentMethod: z.string().default('COD'),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  phone: z.string().min(10).max(15).regex(/^[0-9+\-\s()]+$/).optional(),
})

export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(30).toUpperCase(),
  description: z.string().max(255).optional(),
  discountType: z.enum(['percentage', 'flat'], { errorMap: () => ({ message: 'Must be "percentage" or "flat"' }) }),
  value: z.number().min(0.01, 'Value must be greater than 0'),
  minOrder: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  perUserLimit: z.number().int().min(1).default(1),
  active: z.boolean().default(true),
  expiryDate: z.string().or(z.date()).transform((val) => new Date(val)),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type ProductInput = z.infer<typeof productSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type CouponInput = z.infer<typeof couponSchema>
