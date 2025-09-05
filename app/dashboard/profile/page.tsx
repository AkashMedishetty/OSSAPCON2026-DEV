import { Metadata } from "next"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { MainLayout } from "@/components/layout/MainLayout"

export const metadata: Metadata = {
  title: "Profile | OSSAPCON 2026",
  description: "Manage your OSSAPCON 2026 conference profile",
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <MainLayout currentPage="profile" showSearch={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your personal information and conference preferences
              </p>
            </div>
            
            <ProfileForm />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}