import { Metadata } from "next"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PaymentForm } from "@/components/payment/PaymentForm"
import { MainLayout } from "@/components/layout/MainLayout"

export const metadata: Metadata = {
  title: "Payment | OSSAPCON 2026",
  description: "Complete your OSSAPCON 2026 conference registration payment",
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <MainLayout currentPage="payment" showSearch={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Payment Information</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Complete your conference registration payment
              </p>
            </div>
            
            <PaymentForm />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}