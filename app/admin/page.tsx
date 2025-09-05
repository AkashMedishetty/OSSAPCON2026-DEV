import { Metadata } from "next"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ComprehensiveAdminPanel } from "@/components/admin/ComprehensiveAdminPanel"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Admin Dashboard | OSSAPCON 2026",
  description: "Comprehensive administrative dashboard for OSSAPCON 2026 conference management",
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Navigation />
        
        <main className="pt-16">
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900">Comprehensive Admin Panel (Current)</h2>
              <p className="text-blue-700 text-sm mt-1">
                You're viewing the comprehensive admin dashboard. 
                <a href="/admin/1" className="text-blue-600 hover:underline ml-2 font-medium">
                  Compare with alternative dashboard →
                </a>
              </p>
            </div>
          </div>
          <ComprehensiveAdminPanel />
        </main>
      </div>
    </ProtectedRoute>
  )
}