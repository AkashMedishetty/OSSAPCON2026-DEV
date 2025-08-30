"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/navigation'
import { ReviewerManager } from '@/components/admin/ReviewerManager'

export default function AdminReviewersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Navigation />
      <div className="container mx-auto p-4">
        <ReviewerManager />
      </div>
    </ProtectedRoute>
  )
}


