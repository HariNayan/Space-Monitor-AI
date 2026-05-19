import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json&ver=1.0';
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'space-monitor/1.0' },
      next: { revalidate: 600 },
    });
    if (!res.ok) return NextResponse.json({ error: 'REMS unavailable' }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch REMS' }, { status: 502 });
  }
}
