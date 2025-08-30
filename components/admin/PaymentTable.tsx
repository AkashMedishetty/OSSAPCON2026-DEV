"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  MoreVertical
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PaymentData {
  _id: string
  userId: string
  registrationId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  amount: {
    total: number
    currency: string
    registration: number
    workshops: number
    accompanyingPersons: number
    discount: number
  }
  breakdown: {
    registrationType: string
    baseAmount: number
    workshopFees: Array<{
      name: string
      amount: number
    }>
    accompanyingPersonFees: number
    discountsApplied: Array<{
      type: string
      code?: string
      percentage: number
      amount: number
    }>
  }
  status: string
  transactionDate: string
  invoiceGenerated: boolean
  userDetails: {
    name: string
    email: string
    phone: string
    institution: string
  }
}

interface PaymentTableProps {
  searchTerm?: string
  statusFilter?: string
  dateFilter?: string
}

export function PaymentTable({ 
  searchTerm = "",
  statusFilter = "all",
  dateFilter = "all"
}: PaymentTableProps) {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([])
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [error, setError] = useState("")
  
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, dateFilter])

  const fetchPayments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/payments")
      const data = await response.json()

      if (data.success) {
        setPayments(data.data)
      } else {
        setError(data.message || "Failed to fetch payments")
      }
    } catch (error) {
      console.error("Payments fetch error:", error)
      setError("An error occurred while fetching payments")
    } finally {
      setIsLoading(false)
    }
  }

  const filterPayments = () => {
    let filtered = [...payments]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.userDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.userDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(payment => 
            new Date(payment.transactionDate) >= filterDate
          )
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(payment => 
            new Date(payment.transactionDate) >= filterDate
          )
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(payment => 
            new Date(payment.transactionDate) >= filterDate
          )
          break
      }
    }

    // Sort by transaction date (newest first)
    filtered.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())

    setFilteredPayments(filtered)
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/export/payments")
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        
        toast({
          title: "Export Started",
          description: "Payment data is being downloaded."
        })
      } else {
        toast({
          title: "Export Failed",
          description: "Unable to export payment data",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during export",
        variant: "destructive"
      })
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`
    }
    return `₹${amount.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "failed":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getTotalRevenue = () => {
    const completedPayments = filteredPayments.filter(p => p.status === 'completed')
    return completedPayments.reduce((sum, payment) => sum + payment.amount.total, 0)
  }

  const getAverageAmount = () => {
    const completedPayments = filteredPayments.filter(p => p.status === 'completed')
    if (completedPayments.length === 0) return 0
    return getTotalRevenue() / completedPayments.length
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                Payment Transactions ({filteredPayments.length})
              </CardTitle>
              <CardDescription>
                Manage and track all payment transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPayments}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredPayments.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredPayments.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(getTotalRevenue(), filteredPayments[0]?.amount.currency || 'INR')}
                </div>
                <div className="text-xs text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(getAverageAmount(), filteredPayments[0]?.amount.currency || 'INR')}
                </div>
                <div className="text-xs text-gray-600">Average Amount</div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {payment.registrationId}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {payment.razorpayPaymentId}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.breakdown.registrationType.charAt(0).toUpperCase() + payment.breakdown.registrationType.slice(1)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {payment.userDetails.name}
                            </div>
                            <div className="text-xs text-gray-600">{payment.userDetails.email}</div>
                            <div className="text-xs text-gray-500">{payment.userDetails.institution}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(payment.amount.total, payment.amount.currency)}
                          </div>
                          {payment.breakdown.workshopFees.length > 0 && (
                            <div className="text-xs text-gray-500">
                              +{payment.breakdown.workshopFees.length} workshops
                            </div>
                          )}
                          {payment.breakdown.discountsApplied.length > 0 && (
                            <div className="text-xs text-green-600">
                              -{formatCurrency(payment.amount.discount, payment.amount.currency)} discount
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(payment.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(payment.status)}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {new Date(payment.transactionDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.transactionDate).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={payment.invoiceGenerated ? "default" : "secondary"}>
                          {payment.invoiceGenerated ? "Generated" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/api/payment/invoice/${payment._id}`, '_blank')}
                              disabled={!payment.invoiceGenerated}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No payments found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Transaction Details</DialogTitle>
            <DialogDescription>
              Complete payment information for {selectedPayment?.userDetails.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* Transaction Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Transaction Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Registration ID:</span>
                    <p className="font-medium">{selectedPayment.registrationId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <p className="font-mono text-xs">{selectedPayment.razorpayPaymentId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <p className="font-mono text-xs">{selectedPayment.razorpayOrderId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Transaction Date:</span>
                    <p>{new Date(selectedPayment.transactionDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Invoice Status:</span>
                    <Badge variant={selectedPayment.invoiceGenerated ? "default" : "secondary"}>
                      {selectedPayment.invoiceGenerated ? "Generated" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{selectedPayment.userDetails.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p>{selectedPayment.userDetails.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p>{selectedPayment.userDetails.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Institution:</span>
                    <p>{selectedPayment.userDetails.institution}</p>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Registration Fee ({selectedPayment.breakdown.registrationType}):</span>
                    <span>{formatCurrency(selectedPayment.breakdown.baseAmount, selectedPayment.amount.currency)}</span>
                  </div>

                  {selectedPayment.breakdown.workshopFees.length > 0 && (
                    <>
                      <div className="font-medium text-gray-700 dark:text-gray-300 mt-3">Workshop Fees:</div>
                      {selectedPayment.breakdown.workshopFees.map((workshop, index) => (
                        <div key={index} className="flex justify-between ml-4">
                          <span>• {workshop.name}:</span>
                          <span>{formatCurrency(workshop.amount, selectedPayment.amount.currency)}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {selectedPayment.breakdown.accompanyingPersonFees > 0 && (
                    <div className="flex justify-between">
                      <span>Accompanying Person Fees:</span>
                      <span>{formatCurrency(selectedPayment.breakdown.accompanyingPersonFees, selectedPayment.amount.currency)}</span>
                    </div>
                  )}

                  {selectedPayment.breakdown.discountsApplied.length > 0 && (
                    <>
                      <div className="font-medium text-green-700 dark:text-green-300 mt-3">Discounts Applied:</div>
                      {selectedPayment.breakdown.discountsApplied.map((discount, index) => (
                        <div key={index} className="flex justify-between ml-4 text-green-600">
                          <span>
                            • {discount.type} {discount.code ? `(${discount.code})` : ''} - {discount.percentage}%:
                          </span>
                          <span>-{formatCurrency(discount.amount, selectedPayment.amount.currency)}</span>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedPayment.amount.total, selectedPayment.amount.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}