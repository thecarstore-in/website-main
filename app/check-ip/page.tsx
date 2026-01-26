import { headers } from 'next/headers';

export default async function CheckIP() {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">IP Debug Info</h1>
      <div className="space-y-2">
        <p><strong>Detected IP:</strong> {clientIp}</p>
        <p><strong>X-Forwarded-For:</strong> {forwardedFor || 'Not set'}</p>
        <p><strong>X-Real-IP:</strong> {realIp || 'Not set'}</p>
        <p><strong>All Headers:</strong></p>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(Object.fromEntries(headersList.entries()), null, 2)}
        </pre>
      </div>
    </div>
  );
}