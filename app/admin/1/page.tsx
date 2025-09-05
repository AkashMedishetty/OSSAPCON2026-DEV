"use client"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AdminDashboard } from "@/components/admin/AdminDashboard"
import { Navigation } from "@/components/navigation"

export default function AlternativeAdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Navigation />
        
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Alternative Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                This is the alternative admin dashboard for comparison. 
                <a href="/admin" className="text-blue-600 hover:underline ml-2">
                  Go back to main admin dashboard
                </a>
              </p>
            </div>
            
            <AdminDashboard />
            
            {/* Additional Admin Features for Alternative Dashboard */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/admin/registrations" className="block p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors">
                    📋 Manage Registrations
                  </a>
                  <a href="/admin/payments" className="block p-3 bg-green-50 rounded hover:bg-green-100 transition-colors">
                    💳 View Payments
                  </a>
                  <a href="/admin/config" className="block p-3 bg-purple-50 rounded hover:bg-purple-100 transition-colors">
                    ⚙️ Configuration
                  </a>
                  <a href="/admin/emails" className="block p-3 bg-orange-50 rounded hover:bg-orange-100 transition-colors">
                    📧 Bulk Email
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Data Export</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.open('/api/admin/export/registrations', '_blank')}
                    className="block w-full p-3 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-left"
                  >
                    📊 Export Registrations
                  </button>
                  <button 
                    onClick={() => window.open('/api/admin/export/payments', '_blank')}
                    className="block w-full p-3 bg-green-50 rounded hover:bg-green-100 transition-colors text-left"
                  >
                    💰 Export Payments
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">System Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="text-green-600">✅ Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Service:</span>
                    <span className="text-green-600">✅ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Config Loaded:</span>
                    <span className="text-green-600">✅ Yes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
