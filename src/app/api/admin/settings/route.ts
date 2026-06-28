import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

// Store settings — simple key-value config
// For production, add a StoreSettings Mongoose model in src/models/
const defaultSettings = {
  storeName: 'Mithai 2.0',
  storeEmail: 'hello@mithai2.com',
  storePhone: '+91 98765 43210',
  currency: 'INR',
  freeShippingMinimum: 500,
  taxRate: 0,
  maintenanceMode: false,
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    return NextResponse.json({ settings: defaultSettings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const settings = { ...defaultSettings, ...body }
    return NextResponse.json({ settings })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
