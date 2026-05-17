export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('http://api.open-notify.org/iss-now.json');
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Failed to fetch ISS data' }, { status: 500 });
  }
}