"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  DollarSign, 
  Tag,
  Mail,
  Calendar,
  Plus,
  Minus,
  Save,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  X
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PricingConfig {
  registration_categories: {
    [key: string]: {
      amount: number
      currency: string
      label: string
    }
  }
  workshops: Array<{
    id: string
    name: string
    amount: number
  }>
}

interface DiscountConfig {
  active_discounts: Array<{
    id: string
    name: string
    type: 'time-based' | 'code-based'
    percentage: number
    startDate?: string
    endDate?: string
    code?: string
    applicableCategories: string[]
    isActive: boolean
  }>
}

interface EmailConfig {
  fromName: string
  fromEmail: string
  replyTo: string
  templates: {
    registration: { enabled: boolean; subject: string }
    payment: { enabled: boolean; subject: string }
    passwordReset: { enabled: boolean; subject: string }
    bulkEmail: { enabled: boolean; subject: string }
  }
  rateLimiting: {
    batchSize: number
    delayBetweenBatches: number
  }
}

export function ConfigManager() {
  const [activeTab, setActiveTab] = useState("pricing")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  
  // Configuration states
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null)
  const [discountConfig, setDiscountConfig] = useState<DiscountConfig | null>(null)
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(null)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchConfigurations()
  }, [])

  const fetchConfigurations = async () => {
    setIsLoading(true)
    try {
      const [pricingRes, discountRes, emailRes] = await Promise.all([
        fetch('/api/admin/config/pricing'),
        fetch('/api/admin/config/discounts'),
        fetch('/api/admin/config/email')
      ])

      const [pricingData, discountData, emailData] = await Promise.all([
        pricingRes.json(),
        discountRes.json(),
        emailRes.json()
      ])

      if (pricingData.success) setPricingConfig(pricingData.data)
      if (discountData.success) setDiscountConfig(discountData.data)
      if (emailData.success) setEmailConfig(emailData.data)

    } catch (error) {
      console.error('Config fetch error:', error)
      setError('Failed to load configurations')
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfiguration = async (type: string, data: any) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/config/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Configuration Saved",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} configuration has been updated successfully.`
        })
        fetchConfigurations() // Refresh data
      } else {
        toast({
          title: "Save Failed",
          description: result.message || "Failed to save configuration",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Config save error:', error)
      toast({
        title: "Error",
        description: "An error occurred while saving configuration",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Pricing configuration handlers
  const updateRegistrationCategory = (type: string, field: string, value: any) => {
    if (!pricingConfig) return
    
    setPricingConfig(prev => ({
      ...prev!,
      registration_categories: {
        ...prev!.registration_categories,
        [type]: {
          ...prev!.registration_categories[type],
          [field]: value
        }
      }
    }))
  }

  const addWorkshop = () => {
    if (!pricingConfig) return
    
    const newWorkshop = {
      id: `workshop-${Date.now()}`,
      name: "",
      amount: 0
    }
    
    setPricingConfig(prev => ({
      ...prev!,
      workshops: [...prev!.workshops, newWorkshop]
    }))
  }

  const updateWorkshop = (index: number, field: string, value: any) => {
    if (!pricingConfig) return
    
    setPricingConfig(prev => ({
      ...prev!,
      workshops: prev!.workshops.map((workshop, i) => 
        i === index ? { ...workshop, [field]: value } : workshop
      )
    }))
  }

  const removeWorkshop = (index: number) => {
    if (!pricingConfig) return
    
    setPricingConfig(prev => ({
      ...prev!,
      workshops: prev!.workshops.filter((_, i) => i !== index)
    }))
  }

  // Discount configuration handlers
  const addDiscount = () => {
    if (!discountConfig) return
    
    const newDiscount = {
      id: `discount-${Date.now()}`,
      name: "",
      type: 'time-based' as const,
      percentage: 10,
      applicableCategories: ['all'],
      isActive: true
    }
    
    setDiscountConfig(prev => ({
      ...prev!,
      active_discounts: [...prev!.active_discounts, newDiscount]
    }))
  }

  const updateDiscount = (index: number, field: string, value: any) => {
    if (!discountConfig) return
    
    setDiscountConfig(prev => ({
      ...prev!,
      active_discounts: prev!.active_discounts.map((discount, i) => 
        i === index ? { ...discount, [field]: value } : discount
      )
    }))
  }

  const removeDiscount = (index: number) => {
    if (!discountConfig) return
    
    setDiscountConfig(prev => ({
      ...prev!,
      active_discounts: prev!.active_discounts.filter((_, i) => i !== index)
    }))
  }

  const updateEmailTemplate = (template: string, field: string, value: any) => {
    if (!emailConfig) return
    
    setEmailConfig(prev => ({
      ...prev!,
      templates: {
        ...prev!.templates,
        [template]: {
          ...(prev?.templates[template as keyof typeof prev.templates] || {}),
          [field]: value
        }
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
          <p className="text-gray-600">Loading configurations...</p>
        </div>
      </div>
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
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Manage pricing, discounts, email settings, and other system configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="discounts" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Discounts
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
            </TabsList>

            {/* Pricing Configuration */}
            <TabsContent value="pricing" className="space-y-6">
              {pricingConfig && (
                <>
                  {/* Registration Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Registration Categories</h3>
                    <div className="grid gap-4">
                      {Object.entries(pricingConfig.registration_categories).map(([type, config]) => (
                        <Card key={type}>
                          <CardHeader>
                            <CardTitle className="capitalize">{config.label}</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Label</Label>
                              <Input
                                value={config.label}
                                onChange={(e) => updateRegistrationCategory(type, 'label', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Amount</Label>
                              <Input
                                type="number"
                                value={config.amount}
                                onChange={(e) => updateRegistrationCategory(type, 'amount', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Currency</Label>
                              <Select 
                                value={config.currency} 
                                onValueChange={(value) => updateRegistrationCategory(type, 'currency', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INR">INR (₹)</SelectItem>
                                  <SelectItem value="USD">USD ($)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Workshops */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Workshops</h3>
                      <Button onClick={addWorkshop} size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Workshop
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {pricingConfig.workshops.map((workshop, index) => (
                        <Card key={workshop.id}>
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                              <div className="space-y-2">
                                <Label>Workshop Name</Label>
                                <Input
                                  value={workshop.name}
                                  onChange={(e) => updateWorkshop(index, 'name', e.target.value)}
                                  placeholder="Enter workshop name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input
                                  type="number"
                                  value={workshop.amount}
                                  onChange={(e) => updateWorkshop(index, 'amount', parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeWorkshop(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => saveConfiguration('pricing', pricingConfig)}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Pricing
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Discount Configuration */}
            <TabsContent value="discounts" className="space-y-6">
              {discountConfig && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Active Discounts</h3>
                    <Button onClick={addDiscount} size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Discount
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {discountConfig.active_discounts.map((discount, index) => (
                      <Card key={discount.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              {discount.name || 'New Discount'}
                              <Badge variant={discount.isActive ? "default" : "secondary"}>
                                {discount.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </CardTitle>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeDiscount(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Discount Name</Label>
                              <Input
                                value={discount.name}
                                onChange={(e) => updateDiscount(index, 'name', e.target.value)}
                                placeholder="Enter discount name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select 
                                value={discount.type} 
                                onValueChange={(value) => updateDiscount(index, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="time-based">Time-based</SelectItem>
                                  <SelectItem value="code-based">Code-based</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Percentage</Label>
                              <Input
                                type="number"
                                value={discount.percentage}
                                onChange={(e) => updateDiscount(index, 'percentage', parseFloat(e.target.value) || 0)}
                                min="0"
                                max="100"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={discount.isActive}
                                  onCheckedChange={(checked) => updateDiscount(index, 'isActive', checked)}
                                />
                                <span className="text-sm">{discount.isActive ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                          </div>

                          {discount.type === 'code-based' && (
                            <div className="space-y-2">
                              <Label>Discount Code</Label>
                              <Input
                                value={discount.code || ''}
                                onChange={(e) => updateDiscount(index, 'code', e.target.value)}
                                placeholder="Enter discount code"
                              />
                            </div>
                          )}

                          {discount.type === 'time-based' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                  type="date"
                                  value={discount.startDate || ''}
                                  onChange={(e) => updateDiscount(index, 'startDate', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                  type="date"
                                  value={discount.endDate || ''}
                                  onChange={(e) => updateDiscount(index, 'endDate', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label>Applicable Categories</Label>
                            <div className="flex flex-wrap gap-2">
                              {['all', 'regular', 'student', 'international', 'faculty'].map(category => (
                                <Button
                                  key={category}
                                  variant={discount.applicableCategories.includes(category) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => {
                                    const categories = discount.applicableCategories.includes(category)
                                      ? discount.applicableCategories.filter(c => c !== category)
                                      : [...discount.applicableCategories, category]
                                    updateDiscount(index, 'applicableCategories', categories)
                                  }}
                                >
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => saveConfiguration('discounts', discountConfig)}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Discounts
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Email Configuration */}
            <TabsContent value="email" className="space-y-6">
              {emailConfig && (
                <>
                  {/* Basic Email Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Email Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>From Name</Label>
                        <Input
                          value={emailConfig.fromName}
                          onChange={(e) => setEmailConfig(prev => ({ ...prev!, fromName: e.target.value }))}
                          placeholder="NeuroTrauma 2026"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>From Email</Label>
                        <Input
                          type="email"
                          value={emailConfig.fromEmail}
                          onChange={(e) => setEmailConfig(prev => ({ ...prev!, fromEmail: e.target.value }))}
                          placeholder="noreply@neurotrauma2026.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reply To</Label>
                        <Input
                          type="email"
                          value={emailConfig.replyTo}
                          onChange={(e) => setEmailConfig(prev => ({ ...prev!, replyTo: e.target.value }))}
                          placeholder="support@neurotrauma2026.com"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Email Templates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Email Templates</h3>
                    <div className="space-y-4">
                      {Object.entries(emailConfig.templates).map(([template, config]) => (
                        <Card key={template}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="capitalize">{template.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                              <Switch
                                checked={config.enabled}
                                onCheckedChange={(checked) => updateEmailTemplate(template, 'enabled', checked)}
                              />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Label>Subject</Label>
                              <Input
                                value={config.subject}
                                onChange={(e) => updateEmailTemplate(template, 'subject', e.target.value)}
                                placeholder="Enter email subject"
                                disabled={!config.enabled}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Rate Limiting */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Rate Limiting</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Batch Size</Label>
                        <Input
                          type="number"
                          value={emailConfig.rateLimiting.batchSize}
                          onChange={(e) => setEmailConfig(prev => ({
                            ...prev!,
                            rateLimiting: {
                              ...prev!.rateLimiting,
                              batchSize: parseInt(e.target.value) || 10
                            }
                          }))}
                          min="1"
                          max="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delay Between Batches (ms)</Label>
                        <Input
                          type="number"
                          value={emailConfig.rateLimiting.delayBetweenBatches}
                          onChange={(e) => setEmailConfig(prev => ({
                            ...prev!,
                            rateLimiting: {
                              ...prev!.rateLimiting,
                              delayBetweenBatches: parseInt(e.target.value) || 1000
                            }
                          }))}
                          min="100"
                          max="10000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => saveConfiguration('email', emailConfig)}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Email Settings
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}