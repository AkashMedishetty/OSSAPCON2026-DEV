"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FloatingInput } from "@/components/ui/floating-input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress, StepProgress } from "@/components/ui/progress"
import { Calendar, FileText, Award, Users, CheckCircle, CreditCard, Eye, EyeOff, Loader2, AlertCircle, CheckIcon, UserPlus, MapPin, Phone, Mail, Building, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import dynamic from "next/dynamic"
import { useToast } from "@/hooks/use-toast"
import { getCurrentTier, getTierSummary, getTierPricing } from "@/lib/registration"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [priceCalculation, setPriceCalculation] = useState<any>(null)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailCheckTimeout, setEmailCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  // Step configuration for the new design
  const steps = [
    { label: "Personal Info", completed: step > 1, current: step === 1 },
    { label: "Registration", completed: step > 2, current: step === 2 },
    { label: "Payment", completed: step > 3, current: step === 3 },
  ]

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout)
      }
    }
  }, [emailCheckTimeout])

  // Load dynamic pricing data and workshops
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingPricing(true)
        // Use centralized config instead of API to avoid drift
        const tierName = getCurrentTier()
        const pricing = getTierPricing(tierName)
        setCurrentTier({ name: tierName, description: getTierSummary(), endDate: new Date() })
        setNextTier(null)

        const updatedTypes = [
          { value: "ossap-member", label: "OSSAP Member", price: 0, currency: "INR", description: `${tierName} (Inclusive 18% GST)` },
          { value: "non-member", label: "OSSAP Non-Member", price: 0, currency: "INR", description: `${tierName} (Inclusive 18% GST)` },
          { value: "pg-student", label: "PG Student", price: 0, currency: "INR", description: `${tierName} (Inclusive 18% GST)` }
        ].map(type => ({
          ...type,
          price: pricing[type.value]?.amount ?? 0,
          currency: pricing[type.value]?.currency ?? "INR"
        }))
        setRegistrationTypes(updatedTypes)

        // Load workshops data
        const workshopsResponse = await fetch('/api/workshops')
        if (workshopsResponse.ok) {
          const workshopsResult = await workshopsResponse.json()
          if (workshopsResult.success && workshopsResult.data) {
            const updatedWorkshops = workshopsResult.data.map((workshop: any) => ({
              id: workshop.id,
              label: workshop.name,
              price: workshop.price,
              maxSeats: workshop.maxSeats,
              availableSeats: workshop.availableSeats,
              canRegister: workshop.canRegister
            }))
            setWorkshops(updatedWorkshops)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoadingPricing(false)
      }
    }

    loadData()
  }, [])

  const [formData, setFormData] = useState({
    // Personal Information
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    password: "",
    confirmPassword: "",
    institution: "",
    mciNumber: "",
    
    // Address
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    
    // Registration Details
    registrationType: "",
    membershipNumber: "",
    dietaryRequirements: "",
    specialNeeds: "",
    workshopSelection: [] as string[],
    accompanyingPersons: [] as Array<{
      name: string
      relationship: string
      dietaryRequirements?: string
    }>,
    discountCode: "",
    
    // Payment
    paymentMethod: "bank-transfer",
    bankTransferUTR: "",
    agreeTerms: false,
  })

  // State for dynamic data - Updated OSSAP Pricing
  const [registrationTypes, setRegistrationTypes] = useState([
    { value: "ossap-member", label: "OSSAP Member", price: 8250, currency: "INR", description: "Early Bird (Inclusive 18% GST)" },
    { value: "non-member", label: "OSSAP Non-Member", price: 9440, currency: "INR", description: "Early Bird (Inclusive 18% GST)" },
    { value: "pg-student", label: "PG Student", price: 5900, currency: "INR", description: "Early Bird (Inclusive 18% GST)" }
  ])
  const [workshops, setWorkshops] = useState<Array<{
    id: string
    label: string
    price: number
    maxSeats?: number
    availableSeats?: number
    canRegister?: boolean
  }>>([
    { id: "joint-replacement", label: "Advanced Joint Replacement Techniques", price: 2000, canRegister: true },
    { id: "spinal-surgery", label: "Spine Surgery and Instrumentation", price: 2500, canRegister: true },
    { id: "pediatric-orthopedics", label: "Pediatric Orthopedics", price: 2000, canRegister: true },
    { id: "arthroscopy", label: "Arthroscopic Surgery Techniques", price: 1500, canRegister: true },
    { id: "orthopedic-rehab", label: "Orthopedic Rehabilitation", price: 1800, canRegister: true },
    { id: "trauma-surgery", label: "Orthopedic Trauma Surgery", price: 2200, canRegister: true }
  ])
  const [currentTier, setCurrentTier] = useState<any>(null)
  const [nextTier, setNextTier] = useState<any>(null)
  const [loadingPricing, setLoadingPricing] = useState(true)

  // Calculate price when registration type, workshops, accompanying persons, or discount code change
  useEffect(() => {
    if (formData.registrationType || formData.workshopSelection.length > 0 || formData.accompanyingPersons.length > 0) {
      calculatePrice()
    }
  }, [formData.registrationType, formData.workshopSelection, formData.accompanyingPersons, formData.discountCode])

  const calculatePrice = async () => {
    if (!formData.registrationType) return

    try {
      const response = await fetch('/api/payment/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationType: formData.registrationType,
          workshopSelections: formData.workshopSelection,
          accompanyingPersons: formData.accompanyingPersons,
          discountCode: formData.discountCode || undefined
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPriceCalculation(result.data)
        }
      }
    } catch (error) {
      console.error('Price calculation error:', error)
    }
  }

  const checkEmailUniqueness = async (email: string) => {
    // Validate email format first
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) return
    
    setIsCheckingEmail(true)
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })
      
      if (!response.ok) {
        console.error('Email check failed:', response.status, response.statusText)
        return
      }
      
      const result = await response.json()
      console.log('Email check result:', result)
      
      if (!result.available) {
        console.log('Email not available, showing toast...')
        setEmailAvailable(false)
        toast({
          title: "Email Already Registered",
          description: "This email is already registered. Please use a different email or sign in.",
          variant: "destructive"
        })
      } else {
        console.log('Email is available')
        setEmailAvailable(true)
      }
    } catch (error) {
      console.error('Email check error:', error)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      
      // Auto-select registration type based on designation
      if (field === 'designation') {
        if (value === 'PG/Student') {
          newData.registrationType = 'pg-student'
        } else if (value === 'Consultant' && prev.registrationType === 'pg-student') {
          // Clear pg-student if consultant is selected
          newData.registrationType = ''
        }
      }
      
      return newData
    })
    
    // Check email uniqueness when email field changes with proper debouncing
    if (field === 'email' && typeof value === 'string') {
      // Reset email availability when email changes
      setEmailAvailable(null)
      
      // Clear existing timeout
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout)
      }
      
      // Only check if email looks valid
      if (value.includes('@') && value.includes('.')) {
        const timeoutId = setTimeout(() => checkEmailUniqueness(value), 1000) // Increased delay
        setEmailCheckTimeout(timeoutId)
      }
    }
  }

  const handleWorkshopToggle = (workshop: string) => {
    setFormData((prev) => {
      const workshops = [...prev.workshopSelection]
      if (workshops.includes(workshop)) {
        return { ...prev, workshopSelection: workshops.filter((w) => w !== workshop) }
      } else {
        return { ...prev, workshopSelection: [...workshops, workshop] }
      }
    })
  }

  const addAccompanyingPerson = () => {
    setFormData((prev) => ({
      ...prev,
      accompanyingPersons: [...prev.accompanyingPersons, {
        name: "",
        relationship: "",
        dietaryRequirements: ""
      }]
    }))
  }

  const removeAccompanyingPerson = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      accompanyingPersons: prev.accompanyingPersons.filter((_, i) => i !== index)
    }))
  }

  const updateAccompanyingPerson = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      accompanyingPersons: prev.accompanyingPersons.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      )
    }))
  }

  const validateStep = (currentStep: number) => {
    console.log(`Validating step ${currentStep}...`)
    console.log(`Current form data:`, JSON.stringify(formData, null, 2))
    
    switch (currentStep) {
      case 1:
        // Check all required fields for step 1
        const requiredFields = {
          title: formData.title,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          designation: formData.designation,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          institution: formData.institution
        }
        
        console.log('Checking required fields:', requiredFields)
        
        const missingFields = Object.entries(requiredFields).filter(([key, value]) => {
          const isEmpty = !value || (typeof value === 'string' && value.trim() === '')
          if (isEmpty) {
            console.log(`Missing field: ${key} = "${value}"`)
          }
          return isEmpty
        })
        
        if (missingFields.length > 0) {
          const missingFieldNames = missingFields.map(([key]) => {
            // Convert camelCase to readable format
            return key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())
          }).join(', ')
          
          console.log('Missing fields detected:', missingFieldNames)
          
          toast({
            title: "Missing Required Fields",
            description: `Please fill in the following fields: ${missingFieldNames}`,
            variant: "destructive",
            duration: 5000 // Show for 5 seconds
          })
          
          // Scroll to the first missing field
          const fieldElement = document.querySelector(`[name="${missingFields[0][0]}"], #${missingFields[0][0]}`)
          if (fieldElement) {
            fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          
          return false
        }
        // Password validation
        if (!formData.password || formData.password.length < 8) {
          console.log('Password validation failed:', formData.password?.length || 0)
          toast({
            title: "Password Requirements",
            description: "Password must be at least 8 characters long.",
            variant: "destructive",
            duration: 5000
          })
          document.querySelector('input[type="password"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
          console.log('Password confirmation failed')
          toast({
            title: "Passwords Don't Match",
            description: "Please ensure both password fields contain the same value.",
            variant: "destructive",
            duration: 5000
          })
          document.querySelector('input[placeholder*="Confirm"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
        
        // Email availability validation
        if (emailAvailable === false) {
          console.log('Email already registered')
          toast({
            title: "Email Already Registered",
            description: "This email is already registered. Please use a different email or sign in with your existing account.",
            variant: "destructive",
            duration: 7000
          })
          document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
        
        // Check if email verification is still pending
        if (emailAvailable === null && formData.email.includes('@') && formData.email.includes('.')) {
          console.log('Email verification still pending')
          // Trigger email check again
          setTimeout(() => checkEmailUniqueness(formData.email), 100)
          toast({
            title: "Email Verification Pending",
            description: "Please wait a moment while we verify your email address is available.",
            variant: "destructive",
            duration: 5000
          })
          return false
        }
        
        console.log('✅ Step 1 validation passed successfully!')
        return true
      case 2:
        console.log('Step 2 validation - checking registration details...')
        console.log('Step 2 form data:', {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          registrationType: formData.registrationType
        })
        
        // Check address fields
        const addressFields = {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
        
        const missingAddressFields = Object.entries(addressFields).filter(([key, value]) => {
          return !value || (typeof value === 'string' && value.trim() === '')
        })
        
        if (missingAddressFields.length > 0) {
          const missingNames = missingAddressFields.map(([key]) => 
            key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())
          ).join(', ')
          
          console.log('Missing address fields:', missingNames)
          toast({
            title: "Missing Address Information", 
            description: `Please fill in the following address fields: ${missingNames}`,
            variant: "destructive",
            duration: 5000
          })
          return false
        }
        
        // Check registration type
        if (!formData.registrationType) {
          console.log('Missing registration type')
          toast({
            title: "Registration Type Required",
            description: "Please select your registration type (OSSAP Member, Non Member, or PG Student).",
            variant: "destructive",
            duration: 5000
          })
          document.querySelector('input[name="registrationType"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
        
        console.log('✅ Step 2 validation passed!')
        return true
        
      case 3:
        console.log('Step 3 validation - checking payment and terms...')
        console.log('Step 3 form data:', {
          agreeTerms: formData.agreeTerms,
          paymentMethod: formData.paymentMethod,
          bankTransferUTR: formData.bankTransferUTR
        })
        
        if (!formData.bankTransferUTR) {
          console.log('UTR number missing')
          toast({
            title: "UTR Number Required",
            description: "Please enter the UTR number from your bank transfer.",
            variant: "destructive",
            duration: 6000
          })
          return false
        }
        
        if (formData.bankTransferUTR.length < 12) {
          console.log('UTR number too short')
          toast({
            title: "Invalid UTR Number",
            description: "UTR number must be 12 digits long.",
            variant: "destructive",
            duration: 6000
          })
          return false
        }
        
        if (!formData.agreeTerms) {
          console.log('Terms not agreed')
          toast({
            title: "Terms and Conditions Required",
            description: "Please read and agree to the terms and conditions before proceeding.",
            variant: "destructive",
            duration: 6000
          })
          document.querySelector('#terms')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
        
        console.log('✅ Step 3 validation passed!')
        return true
      default:
        console.log(`Default validation for step ${currentStep}`)
        return true
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔄 Form submitted! Current step:', step)
    console.log('📋 Complete form data:', JSON.stringify(formData, null, 2))
    
    if (step < 3) {
      console.log('➡️ Attempting to move to next step...')
      console.log('📊 Email availability status:', emailAvailable)
      
      const isValid = validateStep(step)
      console.log(`✅ Step ${step} validation result:`, isValid)
      
      if (isValid) {
        console.log(`🎉 Moving from step ${step} to step ${step + 1}`)
        setStep(step + 1)
        
        // Show success toast for step completion
        toast({
          title: "Step Completed",
          description: `Step ${step} completed successfully. Moving to step ${step + 1}.`,
          variant: "default",
          duration: 2000
        })
      } else {
        console.log(`❌ Step ${step} validation failed - staying on current step`)
      }
      return
    }

    // Final submission when on step 3
    if (step === 3) {
      console.log('Final submission - validating step 3...')
      if (!validateStep(3)) {
        console.log('Step 3 validation failed!')
        return
      }

      console.log('Starting registration API call...')
      setLoading(true)
      try {
      console.log('Making API call to /api/auth/register...')
      
      const requestBody = {
        email: formData.email,
        password: formData.password,
        profile: {
          title: formData.title,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          designation: formData.designation,
          institution: formData.institution,
          mciNumber: formData.mciNumber,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode
          },
          dietaryRequirements: formData.dietaryRequirements,
          specialNeeds: formData.specialNeeds
        },
        registration: {
          type: formData.registrationType,
          membershipNumber: formData.membershipNumber,
          workshopSelections: formData.workshopSelection,
          accompanyingPersons: formData.accompanyingPersons
        },
        payment: {
          method: "bank-transfer",
          bankTransferUTR: formData.bankTransferUTR,
          amount: priceCalculation?.total || 0,
          tier: priceCalculation?.currentTier?.name || undefined,
          status: "pending"
        }
      }
      
      console.log('Request body being sent:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Your account has been created. Please check your email for confirmation."
        })

        console.log('Payment method:', formData.paymentMethod)
        console.log('Price calculation:', priceCalculation)
        console.log('Should redirect to payment:', formData.paymentMethod === 'pay-now' && priceCalculation)

        // Show success page - bank transfer payment pending approval
          setStep(4)
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Error",
        description: "An error occurred during registration. Please check the console for details.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`
    }
    return `₹${amount.toLocaleString()}`
  }
  
  // Validation helper component
  const ValidationSummary = ({ currentStep }: { currentStep: number }) => {
    let missingFields: string[] = []
    
    if (currentStep === 1) {
      const requiredFields = {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        designation: formData.designation,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        institution: formData.institution,
        mciNumber: formData.mciNumber
      }
      
      missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase()))
    }
    
    if (missingFields.length === 0) return null
    
    return (
      <Alert className="mb-4 border-ossapcon-200 bg-ossapcon-50">
        <AlertCircle className="h-4 w-4 text-ossapcon-700" />
        <AlertDescription className="text-ossapcon-800">
          <strong>Please complete the following required fields:</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {missingFields.map(field => (
              <li key={field} className="text-sm">{field}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    )
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 md:p-8 lg:p-12"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-ocean-500 to-sapphire-600 text-white">
                  <UserPlus className="w-8 h-8" />
                </div>
              </div>
              <h2 className="font-display text-fluid-4xl font-bold text-midnight-800 dark:text-midnight-200 mb-4">
                Personal Information
              </h2>
              <p className="text-fluid-lg text-midnight-600 dark:text-midnight-400 max-w-2xl mx-auto">
                Let's start with your basic information to create your conference account.
              </p>
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-fluid-sm font-semibold text-midnight-700 dark:text-midnight-300 mb-3">Title *</label>
                  <Select value={formData.title} onValueChange={(value) => handleInputChange("title", value)}>
                    <SelectTrigger className="h-14">
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                      <SelectItem value="Prof.">Prof.</SelectItem>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FloatingInput
                    label="First Name *"
                    variant="glass"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <FloatingInput
                    label="Last Name *"
                    variant="glass"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <div className="relative">
                    <FloatingInput
                      label="Email Address *"
                      type="email"
                      variant="glass"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className={
                        isCheckingEmail ? "border-sapphire-300" :
                        emailAvailable === true ? "border-emerald-300" :
                        emailAvailable === false ? "border-coral-300" : ""
                      }
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {isCheckingEmail && <Loader2 className="w-4 h-4 animate-spin text-sapphire-500" />}
                      {emailAvailable === true && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {emailAvailable === false && <AlertCircle className="w-4 h-4 text-coral-500" />}
                    </div>
                  </div>
                  {emailAvailable === true && (
                    <p className="text-fluid-xs text-emerald-600 mt-2 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Email is available
                    </p>
                  )}
                  {emailAvailable === false && (
                    <p className="text-fluid-xs text-coral-600 mt-2 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Email already registered
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-midnight-400 z-10" />
                    <FloatingInput
                      label="Phone Number *"
                      type="tel"
                      variant="glass"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-12"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-fluid-sm font-semibold text-midnight-700 dark:text-midnight-300 mb-3">Designation *</label>
                  <Select value={formData.designation} onValueChange={(value) => handleInputChange("designation", value)}>
                    <SelectTrigger className="h-14">
                      <SelectValue placeholder="Select your designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                      <SelectItem value="PG/Student">PG/Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-midnight-400 z-10" />
                    <FloatingInput
                      label="Institution/Hospital *"
                      variant="glass"
                      value={formData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                      className="pl-12"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t border-midnight-200/50 dark:border-midnight-700/50 pt-8">
                <h3 className="font-display text-fluid-2xl font-bold text-midnight-800 dark:text-midnight-200 mb-6 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-ocean-600" />
                  Account Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <div className="relative">
                      <FloatingInput
                        label="Password *"
                        type={showPassword ? "text" : "password"}
                        variant="glass"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-fluid-xs text-midnight-500 mt-2">
                      Minimum 8 characters required
                    </p>
                  </div>
                  
                  <div>
                    <div className="relative">
                      <FloatingInput
                        label="Confirm Password *"
                        type={showConfirmPassword ? "text" : "password"}
                        variant="glass"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t border-midnight-200/50 dark:border-midnight-700/50 pt-8">
                <h3 className="font-display text-fluid-2xl font-bold text-midnight-800 dark:text-midnight-200 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-emerald-600" />
                  Address Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-fluid-sm font-semibold text-midnight-700 dark:text-midnight-300 mb-3">Address</label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your complete address"
                      className="min-h-[100px] rounded-xl border-midnight-200 focus:border-ocean-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FloatingInput
                      label="City"
                      variant="glass"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                    
                    <FloatingInput
                      label="State/Province"
                      variant="glass"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                    
                    <FloatingInput
                      label="Country"
                      variant="glass"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                    
                    <FloatingInput
                      label="Postal/ZIP Code"
                      variant="glass"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Validation Summary */}
              <ValidationSummary currentStep={1} />

              {/* Action Buttons */}
              <div className="flex justify-end pt-8 border-t border-midnight-200/50 dark:border-midnight-700/50">
                <Button 
                  type="submit" 
                  size="lg"
                  className="min-w-[150px]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Next Step
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-4 sm:space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Registration Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Type *</label>
              {/* Special Offer Banner */}
              {currentTier && (
                <div className="bg-gradient-to-r from-ossapcon-600 to-ossapcon-800 text-white p-4 rounded-lg mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{currentTier.name}</h3>
                      <p className="text-sm opacity-90">{getTierSummary()}</p>
                    </div>
                    <div className="text-right"></div>
                  </div>
                </div>
              )}

              <RadioGroup
                value={formData.registrationType}
                onValueChange={(value) => handleInputChange("registrationType", value)}
                className="space-y-4"
              >
                {registrationTypes
                  .filter(type => {
                    // If designation is PG/Student, only show pg-student option
                    if (formData.designation === 'PG/Student') {
                      return type.value === 'pg-student'
                    }
                    // If designation is Consultant, show all except pg-student
                    if (formData.designation === 'Consultant') {
                      return type.value !== 'pg-student'
                    }
                    // If no designation selected yet, show all
                    return true
                  })
                  .map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <Label htmlFor={type.value}>
                      {type.label} ({type.currency === 'USD' ? '$' : '₹'}{type.price.toLocaleString()})
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OSSAP Membership Number (if applicable)</label>
              <Input
                value={formData.membershipNumber}
                onChange={(e) => handleInputChange("membershipNumber", e.target.value)}
                placeholder="Enter your membership number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">MCI Number *</label>
              <Input
                value={formData.mciNumber}
                onChange={(e) => handleInputChange("mciNumber", e.target.value)}
                placeholder="Enter your MCI number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Workshop Selection (Optional)</label>
              <div className="space-y-3">
                {workshops.map((workshop) => (
                  <div key={workshop.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                    !workshop.canRegister ? 'opacity-60 bg-gray-50' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={workshop.id}
                        checked={formData.workshopSelection.includes(workshop.id)}
                        onCheckedChange={() => handleWorkshopToggle(workshop.id)}
                        disabled={!workshop.canRegister}
                      />
                      <div>
                        <label
                          htmlFor={workshop.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {workshop.label}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ₹{workshop.price.toLocaleString()}
                          {workshop.availableSeats !== undefined && (
                            <span className={`ml-2 ${
                              workshop.availableSeats > 10 ? 'text-green-600' : 
                              workshop.availableSeats > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              • {workshop.availableSeats > 0 ? `${workshop.availableSeats} seats left` : 'Fully Booked'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary Requirements</label>
              <Select
                value={formData.dietaryRequirements}
                onValueChange={(value) => handleInputChange("dietaryRequirements", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select if applicable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Special Requirements</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten-free">Gluten Free</SelectItem>
                  <SelectItem value="halal">Halal</SelectItem>
                  <SelectItem value="other">Other (Please specify)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Needs/Accessibility Requirements
              </label>
              <Textarea
                value={formData.specialNeeds}
                onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                placeholder="Please let us know if you have any special needs or accessibility requirements"
              />
            </div>

            {/* Accompanying Persons Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Accompanying Persons (Optional)</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAccompanyingPerson}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Add Person</span>
                </Button>
              </div>

              {formData.accompanyingPersons.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No accompanying persons added yet.</p>
                  <p className="text-xs">Click "Add Person" to include family or colleagues.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.accompanyingPersons.map((person, index) => (
                    <div key={index} className="border dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Person {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAccompanyingPerson(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                          <Input
                            value={person.name}
                            onChange={(e) => updateAccompanyingPerson(index, 'name', e.target.value)}
                            placeholder="Full name"
                          />
                        </div>
                        {/* Age field removed intentionally */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship *</label>
                          <Select
                            value={person.relationship}
                            onValueChange={(value) => updateAccompanyingPerson(index, 'relationship', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="colleague">Colleague</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Requirements</label>
                        <Input
                          value={person.dietaryRequirements || ''}
                          onChange={(e) => updateAccompanyingPerson(index, 'dietaryRequirements', e.target.value)}
                          placeholder="Any dietary requirements (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount Code Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Discount Code (Optional)</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    value={formData.discountCode}
                    onChange={(e) => handleInputChange("discountCode", e.target.value)}
                    placeholder="Enter discount code (e.g., EARLY2025, STUDENT10)"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={calculatePrice}
                  disabled={!formData.discountCode}
                >
                  Apply
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Available discounts: Early Bird, Student discounts, Independence Day offers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">
                Previous
              </Button>
              <Button type="submit" className="bg-ossapcon-700 hover:bg-ossapcon-800 w-full sm:w-auto">
                Next Step
              </Button>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-4 sm:space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Payment Information</h2>
            
            {/* Price Summary */}
            {priceCalculation && (
              <div className="bg-ossapcon-50 dark:bg-ossapcon-900/20 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Registration Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Registration Fee:</span>
                    <span className="font-medium">
                      {formatCurrency(priceCalculation.registrationFee, priceCalculation.currency)}
                    </span>
                  </div>
                  {priceCalculation.workshopFees > 0 && (
                    <div className="flex justify-between">
                      <span>Workshop Fees ({formData.workshopSelection.length} workshops):</span>
                      <span className="font-medium">
                        {formatCurrency(priceCalculation.workshopFees, priceCalculation.currency)}
                      </span>
                    </div>
                  )}
                  {priceCalculation.accompanyingPersonFees > 0 && (
                    <div className="flex justify-between">
                      <span>Accompanying Persons ({formData.accompanyingPersons.length} persons):</span>
                      <span className="font-medium">
                        {formatCurrency(priceCalculation.accompanyingPersonFees, priceCalculation.currency)}
                      </span>
                    </div>
                  )}
                  {priceCalculation.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied{formData.discountCode ? ` (${formData.discountCode})` : ''}:</span>
                      <span className="font-medium">
                        -{formatCurrency(priceCalculation.discount, priceCalculation.currency)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-ossapcon-700">
                        {formatCurrency(priceCalculation.total, priceCalculation.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Bank Transfer Payment Details
              </h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">Account Name:</span>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded border">
                      <p className="text-gray-800 dark:text-gray-200 font-medium break-all">OSSAPCON 2026</p>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('OSSAPCON 2026')
                          toast({ title: "Copied!", description: "Account name copied to clipboard" })
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex-shrink-0"
                      >
                        Copy
                      </button>
                </div>
                </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">Account Number:</span>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded border">
                      <p className="text-gray-800 dark:text-gray-200 font-mono break-all">13731201000140</p>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('13731201000140')
                          toast({ title: "Copied!", description: "Account number copied to clipboard" })
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex-shrink-0"
                      >
                        Copy
                      </button>
                </div>
                </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">IFSC Code:</span>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded border">
                      <p className="text-gray-800 dark:text-gray-200 font-mono">AUBL0003173</p>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('AUBL0003173')
                          toast({ title: "Copied!", description: "IFSC code copied to clipboard" })
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex-shrink-0"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">Branch:</span>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded border">
                      <p className="text-gray-800 dark:text-gray-200 break-all">Kurnool Medical College</p>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('Kurnool Medical College')
                          toast({ title: "Copied!", description: "Branch name copied to clipboard" })
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex-shrink-0"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-blue-200 dark:border-blue-700 pt-3 mt-4">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    💡 Transfer Amount: ₹{priceCalculation?.finalAmount || 'TBD'}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                    Please transfer the exact amount and enter the UTR number below
                  </p>
                </div>
              </div>
            </div>

            {/* UTR Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bank Transfer UTR Number *
              </label>
              <Input
                type="text"
                value={formData.bankTransferUTR}
                onChange={(e) => handleInputChange("bankTransferUTR", e.target.value)}
                placeholder="Enter 12-digit UTR number from your bank transfer"
                className="dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                maxLength={12}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The UTR (Unique Transaction Reference) number is provided by your bank after successful transfer
              </p>
            </div>
            
            <div className="flex items-start space-x-2 mt-6">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleInputChange("agreeTerms", checked === true)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the{" "}
                <Link href="#" className="text-ossapcon-700 dark:text-ossapcon-400 hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-ossapcon-700 dark:text-ossapcon-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full sm:w-auto">
                Previous
              </Button>
              <Button
                type="submit"
                className="bg-ossapcon-700 hover:bg-ossapcon-800 w-full sm:w-auto"
                disabled={!formData.agreeTerms || !formData.bankTransferUTR || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-12"
          >
            <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Registration Application Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for registering for OSSAPCON 2026. Your registration application has been submitted successfully.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              An acknowledgment email has been sent to <span className="font-semibold">{formData.email}</span> with your
              application details.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-6 text-left">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">What happens next?</h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p>• Our team will verify your bank transfer within 10 business days</p>
                <p>• You will receive a confirmation email once your payment is verified</p>
                <p>• Your registration will be confirmed and dashboard access will be activated</p>
                <p>• Conference materials and updates will be shared via email</p>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Important:</strong> Your registration is currently under review. Please allow up to 10 business days for verification.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 sm:justify-center">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button className="bg-ossapcon-700 hover:bg-ossapcon-800 w-full sm:w-auto">
                  Sign In Now
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">Return to Home</Button>
              </Link>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 via-white to-sapphire-50 text-midnight-800 dark:from-midnight-900 dark:to-midnight-800 dark:text-midnight-100">
      <Navigation currentPage="register" />

      <div className="pt-16 md:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Completely New Design */}
        <section className="relative py-20 md:py-32 lg:py-40 overflow-visible">
          {/* Dynamic Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 via-sapphire-50/50 to-emerald-50/30 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-ocean-400/20 to-sapphire-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-ocean-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-sapphire-300/10 to-emerald-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 max-w-7xl">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-6xl mx-auto"
            >
              {/* Conference Info Badge */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Badge variant="glass" size="lg" className="text-ocean-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  OSSAPCON 2026 • February 6-8, 2026
                </Badge>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-display text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight break-normal whitespace-normal hyphens-none overflow-visible tracking-tight pr-1"
              >
                <span className="block bg-gradient-to-r from-ocean-600 via-sapphire-600 to-emerald-600 bg-clip-text text-transparent">
                  CONFERENCE
                </span>
                <span className="block bg-gradient-to-r from-emerald-600 via-ocean-600 to-sapphire-600 bg-clip-text text-transparent">
                  REGISTRATION
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-fluid-xl text-midnight-600 dark:text-midnight-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                Join the premier orthopedic conference in Kurnool. Register now to secure your place among leading medical professionals.
              </motion.p>

              {/* Key Info Cards */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12"
              >
                {[
                  { icon: UserPlus, title: "Easy Registration", desc: "Simple 3-step process", color: "ocean" },
                  { icon: Shield, title: "Secure Payment", desc: "Protected transactions", color: "emerald" },
                  { icon: Sparkles, title: "Instant Confirmation", desc: "Immediate access", color: "sapphire" },
                ].map((item, index) => (
                  <Card key={index} variant="glass" padding="lg" interactive="hover" className="text-center group bg-white/90 dark:bg-midnight-800/90 backdrop-blur-sm border border-white/50 dark:border-midnight-700/50">
                    <CardContent>
                      <item.icon className={`w-12 h-12 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 ${
                        item.color === 'ocean' ? 'text-ocean-600 dark:text-ocean-400' :
                        item.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-sapphire-600 dark:text-sapphire-400'
                      }`} />
                      <h3 className="font-display text-fluid-lg font-bold text-midnight-800 dark:text-midnight-200 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-fluid-sm text-midnight-600 dark:text-midnight-400">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* Sign In Link */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-fluid-base text-midnight-600 dark:text-midnight-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-ocean-600 hover:text-ocean-700 font-semibold hover:underline transition-colors">
                    Sign in here
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Progress Indicator - New Design */}
        {step < 4 && (
          <section className="py-12 md:py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-ocean-50/20 to-sapphire-50/30 dark:from-midnight-800 dark:to-midnight-900"></div>
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto"
              >
                <StepProgress steps={steps} className="mb-8" />
                
                {/* Current Step Info */}
                <div className="text-center">
                  <Badge variant="glass" size="lg">
                    Step {step} of 3
                  </Badge>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Registration Form - Completely New Design */}
        <section className="py-12 md:py-20 relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-sapphire-50/30 via-white to-ocean-50/20 dark:from-midnight-800 dark:to-midnight-900"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-ocean-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-sapphire-300/20 to-ocean-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
              <Card variant="glass" padding="none" className="shadow-2xl bg-white/95 dark:bg-midnight-800/95 backdrop-blur-md border border-white/50 dark:border-midnight-700/50">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <form onSubmit={handleSubmit}>
                    {renderStepContent()}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Registration Benefits */}
        {step < 4 && (
          <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 mx-4 sm:mx-6 lg:mx-8 rounded-lg">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-white">Registration Benefits</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  { icon: Calendar, title: "Full Access", desc: "Access to all sessions and workshops" },
                  { icon: FileText, title: "Conference Materials", desc: "Digital proceedings and certificates" },
                  { icon: Award, title: "CME Credits", desc: "Continuing medical education credits" },
                  { icon: Users, title: "Networking", desc: "Connect with leading professionals" },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-600"
                  >
                    <benefit.icon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}