import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signupSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.json()
    const result = signupSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      )
    }

    const { name, email, password, phone } = result.data

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: 'CUSTOMER',
    })

    return NextResponse.json({
      user: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
