import { NextResponse } from 'next/server'
import { getProperty } from '@/lib/supabase/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await getProperty(params.id)
    
    if (!property) {
      return new NextResponse('Property not found', { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
