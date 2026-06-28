import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Address from '@/models/Address'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    await Address.deleteOne({ _id: params.id, userId: session.user.id })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to delete address:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
