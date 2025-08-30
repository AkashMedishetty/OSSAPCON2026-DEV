"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import useSWR from 'swr'
import Link from 'next/link'
import { AbstractsManager } from '@/components/admin/AbstractsManager'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AdminAbstractsPage() {
  const { data } = useSWR('/api/admin/abstracts/config', fetcher)
  const { data: assignments } = useSWR('/api/admin/abstracts/assignments', fetcher)

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto py-8 space-y-4">
        <h1 className="text-2xl font-semibold">Abstracts Settings</h1>
        <AbstractsManager />
        <h2 className="font-semibold">Settings</h2>
        <pre className="text-xs bg-muted p-3 rounded">{JSON.stringify(data?.data, null, 2)}</pre>
        <h2 className="font-semibold">Reviewer Assignments</h2>
        <pre className="text-xs bg-muted p-3 rounded">{JSON.stringify(assignments?.data, null, 2)}</pre>
        <div className="flex gap-3">
          <a href="/api/admin/abstracts/export" className="inline-block px-4 py-2 bg-gray-800 text-white rounded">Export JSON</a>
          <a href="/api/admin/abstracts/export/zip" className="inline-block px-4 py-2 bg-orange-600 text-white rounded">Export ZIP (Excel + Files)</a>
          <Link href="/admin/abstracts/assignments" className="inline-block px-4 py-2 border rounded">Reviewer Assignments</Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}


