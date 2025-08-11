import { NextResponse } from 'next/server'
import { mockDb } from '../_mock/db'

function toCardDTO(facility) {
  return {
    id: facility.id,
    name: facility.name,
    description: facility.description,
    sports: facility.sports.map((s) => s.name),
    price: facility.card?.price ?? Math.min(
      ...facility.sports.flatMap((s) => s.courts.map((c) => c.price))
    ),
    location: facility.location,
    rating: facility.rating,
    reviews: facility.totalReviews,
    image: facility.card?.image ?? facility.images?.[0] ?? '/placeholder.svg',
    amenities: facility.amenities ?? [],
    distance: facility.card?.distance ?? '—',
    nextSlot: facility.card?.nextSlot ?? '—',
    isOpen: Boolean(facility.card?.isOpen ?? true),
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').toLowerCase()
  const sport = (searchParams.get('sport') || '').toLowerCase()
  const priceRange = searchParams.get('priceRange') || ''
  const minRating = Number(searchParams.get('rating') || '0')
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const limit = Math.max(1, Math.min(50, Number(searchParams.get('limit') || '8')))

  let items = mockDb.publicFacilities.slice()

  // Search
  if (q) {
    items = items.filter(
      (f) => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q) || f.address.toLowerCase().includes(q)
    )
  }

  // Sport filter
  if (sport && sport !== 'all' && sport !== 'all sports') {
    items = items.filter((f) => f.sports.some((s) => s.name.toLowerCase() === sport))
  }

  // Rating filter
  if (minRating > 0) {
    items = items.filter((f) => (f.rating || 0) >= minRating)
  }

  // Price range filter
  if (priceRange && priceRange !== 'All Prices') {
    const getStartPrice = (f) => Math.min(...f.sports.flatMap((s) => s.courts.map((c) => c.price)))
    if (priceRange === '₹0-500') items = items.filter((f) => getStartPrice(f) <= 500)
    else if (priceRange === '₹500-1000') items = items.filter((f) => getStartPrice(f) > 500 && getStartPrice(f) <= 1000)
    else if (priceRange === '₹1000-1500') items = items.filter((f) => getStartPrice(f) > 1000 && getStartPrice(f) <= 1500)
    else if (priceRange === '₹1500+') items = items.filter((f) => getStartPrice(f) > 1500)
  }

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const paged = items.slice(start, start + limit)

  const dto = paged.map(toCardDTO)
  return NextResponse.json({ items: dto, page, limit, total, totalPages })
}


