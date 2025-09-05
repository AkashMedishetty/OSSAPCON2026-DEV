"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function UserAbstractsDashboardPage() {
  const { data } = useSWR('/api/abstracts', fetcher)
  return (
    <ProtectedRoute requiredRole="user">
      <MainLayout currentPage="abstracts" showSearch={true}>
        <div className="container mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">My Abstracts</h1>
            <div className="flex gap-3">
              <Link href="/dashboard/abstracts/submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit Initial Abstract</Link>
              <Link href="/dashboard/abstracts/final" className="px-4 py-2 bg-gray-800 text-white rounded">Submit Final Abstract</Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Your abstracts:</p>
            <ul className="mt-2 space-y-2">
              {(data?.data || []).map((a: any) => (
                <li key={a.final?.abstractId || a.abstractId} className="border rounded p-3 text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-gray-500">{a.final?.abstractId || a.abstractId} · {a.status}</div>
                  </div>
                    {a.final?.displayId && <span className="text-xs text-green-700">Final: {a.final.displayId}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}


