import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  profile: {
    title: string
    firstName: string
    lastName: string
    phone: string
    designation: string
    institution: string
    address: {
      street: string
      city: string
      state: string
      country: string
      pincode: string
    }
    profilePicture?: string
    dietaryRequirements?: string
    specialNeeds?: string
  }
  reviewer?: {
    expertise?: string[]
    maxConcurrentAssignments?: number
    notes?: string
  }
  registration: {
    registrationId: string
    type: 'ossap-member' | 'non-member' | 'pg-student' | 'complimentary' | 'sponsored'
    status: 'pending' | 'confirmed' | 'paid' | 'cancelled'
    membershipNumber?: string
    workshopSelections: string[]
    accompanyingPersons: Array<{
      name: string
      age: number
      dietaryRequirements?: string
      relationship: string
    }>
    registrationDate: Date
    paymentDate?: Date
    paymentType?: 'regular' | 'complementary' | 'sponsored'
    sponsorName?: string
    sponsorCategory?: string
    paymentRemarks?: string
  }
  payment?: {
    method: 'bank-transfer' | 'online' | 'cash'
    status: 'pending' | 'verified' | 'rejected'
    amount: number
    bankTransferUTR?: string
    transactionId?: string
    paymentDate?: Date
    verifiedBy?: string
    verificationDate?: Date
    remarks?: string
  }
  activeSessions: Array<{
    sessionId: string
    deviceId: string
    deviceFingerprint: string
    loginTime: Date
    lastActivity: Date
    userAgent?: string
    ipAddress?: string
  }>
  role: 'user' | 'admin' | 'reviewer'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profile: {
    title: {
      type: String,
      required: true,
      enum: ['Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Ms.']
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    designation: {
      type: String,
      required: true,
      enum: ['Consultant', 'PG/Student'],
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
      pincode: { type: String, default: '' }
    },
    profilePicture: String,
    dietaryRequirements: String,
    mciNumber: { type: String, required: true },
    specialNeeds: String
  },
  reviewer: {
    expertise: { type: [String], default: [] },
    maxConcurrentAssignments: { type: Number, default: 5 },
    notes: { type: String, default: '' }
  },
  registration: {
    registrationId: {
      type: String,
      unique: true,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['ossap-member', 'non-member', 'pg-student', 'complimentary', 'sponsored']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'paid', 'cancelled'],
      default: 'pending'
    },
    tier: { type: String },
    membershipNumber: String,
    workshopSelections: [String],
    accompanyingPersons: [{
      name: { type: String, required: true },
      dietaryRequirements: String,
      relationship: { type: String, required: true }
    }],
    registrationDate: {
      type: Date,
      default: Date.now
    },
    paymentDate: Date,
    paymentType: {
      type: String,
      enum: ['regular', 'complementary', 'sponsored'],
      default: 'regular'
    },
    sponsorName: String,
    sponsorCategory: {
      type: String,
      enum: ['platinum', 'gold', 'silver', 'bronze', 'exhibitor', 'other']
    },
    paymentRemarks: String
  },
  payment: {
    method: {
      type: String,
      enum: ['bank-transfer', 'online', 'cash'],
      default: 'bank-transfer'
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: function() { return this.payment != null; }
    },
    bankTransferUTR: String,
    transactionId: String,
    paymentDate: {
      type: Date,
      default: Date.now
    },
    verifiedBy: String,
    verificationDate: Date,
    remarks: String
  },
  activeSessions: [{
    sessionId: {
      type: String,
      required: true
    },
    deviceId: {
      type: String,
      required: true
    },
    deviceFingerprint: {
      type: String,
      required: true
    },
    loginTime: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    userAgent: String,
    ipAddress: String
  }],
  role: {
    type: String,
    enum: ['user', 'admin', 'reviewer'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Create indexes for better performance (email and registrationId already have unique indexes)
UserSchema.index({ 'registration.status': 1 })
UserSchema.index({ role: 1 })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)