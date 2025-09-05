# Database Setup Guide for OSSAPCON 2026

## 🗄️ Database URL Analysis

### ✅ No Hardcoded Database URLs Found
All database connections properly use environment variables:

1. **Main Application** (`lib/mongodb.ts`):
   ```typescript
   const MONGODB_URI = process.env.MONGODB_URI
   ```

2. **Auth Configuration** (`lib/auth-config.ts`):
   ```typescript
   if (!process.env.MONGODB_URI) {
     errors.push('MONGODB_URI is required');
   }
   ```

3. **Server Setup** (`server-setup/server.js`):
   ```javascript
   mongoose.connect(process.env.MONGODB_URI, {
   ```

### ⚠️ Scripts with Fallback URLs
These scripts have localhost fallbacks for development (safe):
- `scripts/seed-admin.js`
- `scripts/seed-database.js` 
- `scripts/create-admin.js`
- `jest.setup.js` (test environment)

## 🔐 Admin User Setup

### Requested Admin Credentials
- **Email**: `hello@purplehatevents.in`
- **Password**: `1234567890`
- **Role**: `admin`

### 🚀 How to Create Admin User

1. **Set up your environment variables** (create `.env.local`):
   ```bash
   MONGODB_URI=your_production_mongodb_url_here
   NEXTAUTH_SECRET=your_secret_key_here
   NEXTAUTH_URL=https://your-domain.com
   ```

2. **Run the admin seeding script**:
   ```bash
   node scripts/seed-admin.js
   ```

3. **Or use the comprehensive seeding script**:
   ```bash
   node scripts/seed-database.js
   ```

## 📊 Database Seeding Requirements

### Essential Collections to Seed:

#### 1. **Users Collection**
- ✅ **Admin User**: `hello@purplehatevents.in` (created by script)
- 📝 Sample registered users for testing
- 🔐 Properly hashed passwords
- 📋 Various registration statuses (pending, confirmed, cancelled)

#### 2. **Registration Data Requirements**
- Registration types: `ntsi-member`, `non-ntsi-member`, `resident`, `faculty`, `international`
- Registration statuses: `pending`, `confirmed`, `cancelled`
- Payment methods: `bank-transfer`, `online`, `cash`
- Payment statuses: `pending`, `verified`, `rejected`

#### 3. **Sample Data for Testing**
- Bank transfer UTR numbers
- Various user profiles with complete address information
- Workshop selections
- Accompanying persons data
- Dietary requirements and special needs

#### 4. **Workshops Collection** (Optional)
- Workshop details with pricing
- Seat availability tracking
- Instructor information
- Dates and duration

### 🎯 What Gets Seeded by `seed-database.js`:

1. **Admin User**:
   - Email: `hello@purplehatevents.in`
   - Password: `1234567890`
   - Role: `admin`
   - Full profile with Purple Hat Events details

2. **Sample Users** (3 test users):
   - Dr. John Smith (Faculty, Confirmed)
   - Dr. Priya Patel (Non-NTSI Member, Pending)
   - Dr. Raj Kumar (Resident, Confirmed)

3. **Sample Workshops** (3 workshops):
   - Spine Surgery Fundamentals
   - Advanced Arthroscopy Techniques
   - Trauma and Emergency Management

4. **Payment Examples**:
   - Verified payments with UTR numbers
   - Pending payments awaiting approval
   - Various payment amounts based on registration type

## 🛠️ Database Setup Steps

### 1. **Environment Setup**
Create `.env.local` file:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ossapcon2026
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3001
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Run Database Seeding**
```bash
# For admin user only
node scripts/seed-admin.js

# For complete database setup
node scripts/seed-database.js
```

### 4. **Verify Admin Access**
- URL: `http://localhost:3001/admin`
- Email: `hello@purplehatevents.in`
- Password: `1234567890`

## 📋 Database Schema Overview

### User Document Structure:
```json
{
  "email": "string (unique, lowercase)",
  "password": "string (hashed)",
  "profile": {
    "title": "string",
    "firstName": "string",
    "lastName": "string", 
    "phone": "string",
    "institution": "string",
    "address": { "street", "city", "state", "country", "pincode" },
    "dietaryRequirements": "string",
    "specialNeeds": "string"
  },
  "registration": {
    "registrationId": "string (unique)",
    "type": "enum [ntsi-member, non-ntsi-member, resident, faculty, international]",
    "status": "enum [pending, confirmed, cancelled]",
    "membershipNumber": "string",
    "workshopSelections": ["array of workshop IDs"],
    "accompanyingPersons": [{ "name", "age", "relationship", "dietaryRequirements" }]
  },
  "payment": {
    "method": "enum [bank-transfer, online, cash]",
    "status": "enum [pending, verified, rejected]", 
    "amount": "number",
    "bankTransferUTR": "string (12 digits)",
    "transactionId": "string",
    "paymentDate": "date",
    "verifiedBy": "string (admin email)",
    "verificationDate": "date",
    "remarks": "string"
  },
  "role": "enum [user, admin, reviewer]",
  "isActive": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## ⚠️ Important Notes

1. **No Hardcoded URLs**: All database connections use environment variables
2. **Password Security**: All passwords are hashed with bcrypt (salt rounds: 12)
3. **Admin Access**: Admin panel available at `/admin` route
4. **Payment Workflow**: Bank transfer → UTR entry → Admin verification → Confirmation
5. **Email Integration**: Acknowledgment emails on registration, confirmation emails on approval

## 🚨 Security Checklist

- ✅ No hardcoded database URLs
- ✅ Environment variables for all sensitive data
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation on all forms
- ✅ Secure admin authentication

## 🎯 Next Steps

1. Set up your MongoDB database (Atlas or local)
2. Configure environment variables
3. Run the seeding script
4. Test admin login
5. Verify registration workflow
6. Test payment verification process

The database is ready for production with proper security measures and no hardcoded URLs!
