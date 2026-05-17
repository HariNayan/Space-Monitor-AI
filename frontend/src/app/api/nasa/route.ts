import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path param' }, { status: 400 });
  }

  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'path') params.set(key, value);
  });
  params.set('api_key', apiKey);

  const res = await fetch(`https://api.nasa.gov/${path}?${params}`, {
    headers: { 'User-Agent': 'space-monitor/1.0' },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
