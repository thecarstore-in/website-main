'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSetupPage() {
  const [key, setKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (!key.trim()) {
      setError('Please enter an API key');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Set the cookie via API route
      const response = await fetch('/api/admin/set-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key.trim() })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to admin panel
        router.push('/admin-upload-secret');
      } else {
        setError(data.error || 'Invalid API key');
        setSaving(false);
      }
    } catch (err) {
      setError('Failed to save API key');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Admin Access Setup</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your admin API key once. It will be saved securely in your browser.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              disabled={saving}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Verifying...' : 'Save & Continue'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Your API key will be stored as a secure cookie. You won't need to enter it again unless you clear your browser data.
        </p>
      </div>
    </div>
  );
}