import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import connectDB from '@/lib/mongodb'
import NavigationItem from '@/models/NavigationItem'

// Admin: update a navigation item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const body = await req.json()

    const item = await NavigationItem.findByIdAndUpdate(
      params.id,
      {
        $set: {
          title: body.title,
          slug: body.slug,
          destinationType: body.destinationType,
          destinationValue: body.destinationValue,
          order: body.order,
          enabled: body.enabled,
          icon: body.icon ?? null,
        },
      },
      { new: true }
    ).lean()

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({
      item: {
        _id: (item as any)._id.toString(),
        id: (item as any)._id.toString(),
        title: (item as any).title,
        slug: (item as any).slug,
        destinationType: (item as any).destinationType,
        destinationValue: (item as any).destinationValue,
        order: (item as any).order,
        enabled: (item as any).enabled,
        icon: (item as any).icon,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Admin: partially update a navigation item (toggle enabled, reorder)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const body = await req.json()

    const allowedFields = ['enabled', 'order', 'title']
    const updateObj: Record<string, any> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateObj[key] = body[key]
      }
    }

    if (Object.keys(updateObj).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const item = await NavigationItem.findByIdAndUpdate(
      params.id,
      { $set: updateObj },
      { new: true }
    ).lean()

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({
      item: {
        _id: (item as any)._id.toString(),
        id: (item as any)._id.toString(),
        title: (item as any).title,
        slug: (item as any).slug,
        destinationType: (item as any).destinationType,
        destinationValue: (item as any).destinationValue,
        order: (item as any).order,
        enabled: (item as any).enabled,
        icon: (item as any).icon,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Admin: delete a navigation item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await connectDB()
    const result = await NavigationItem.findByIdAndDelete(params.id)

    if (!result) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
