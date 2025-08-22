# NextCart Setup Guide

## 🔐 Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/nextcart

# Google OAuth (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth (Optional)
GITHUB_ID=your-github-client-id-here
GITHUB_SECRET=your-github-client-secret-here
```

## 🌐 Google OAuth Setup

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret to your `.env.local`

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `nextcart`

### Option 2: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env.local`

## 🚀 Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Visit `http://localhost:3000`

## 🔧 Features Implemented

### ✅ Authentication
- User registration with email/password
- User login with email/password
- Google OAuth login
- Session management
- Protected routes

### ✅ Database
- MongoDB with Mongoose
- User model with proper validation
- Password hashing with bcryptjs

### ✅ UI/UX
- Responsive design
- Dark/light theme support
- Professional login/signup pages
- Animated elements
- Form validation

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid email or password"**
   - Check if user exists in database
   - Verify password was hashed during signup

2. **Google OAuth not working**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Check redirect URIs in Google Cloud Console
   - Ensure NEXTAUTH_URL is correct

3. **MongoDB connection error**
   - Verify MONGODB_URI in .env.local
   - Check if MongoDB is running
   - Ensure network access (for Atlas)

4. **"NEXTAUTH_SECRET is not set"**
   - Add NEXTAUTH_SECRET to .env.local
   - Generate a secure random string

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 📱 Testing

1. **Signup**: Create a new account at `/signup`
2. **Login**: Sign in with existing account at `/login`
3. **Google OAuth**: Click "Continue with Google"
4. **Dashboard**: Access protected dashboard after login

## 🔒 Security Notes

- Change NEXTAUTH_SECRET in production
- Use HTTPS in production
- Set proper CORS policies
- Implement rate limiting
- Add email verification (optional)
