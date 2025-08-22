# Next.js Cart - E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 15, featuring authentication, product management, and a responsive design.

## 🚀 Features

### Public Features
- **Homepage**: Modern hero section with call-to-action
- **Products**: Browse and view product listings
- **Product Details**: Comprehensive product information with features
- **About Page**: Company information and team details
- **Contact Page**: Contact form and company information
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Authentication & User Management
- **Multiple Auth Providers**: Google OAuth, GitHub OAuth, and email/password
- **User Registration**: Sign up with email or OAuth
- **User Login**: Secure authentication with multiple options
- **User Profiles**: Personal information and preferences
- **Role-based Access**: Admin and user roles

### Admin Dashboard
- **Dashboard Overview**: Statistics, recent orders, and quick actions
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **User Management**: Manage customer accounts
- **Protected Routes**: Secure admin-only access

### Technical Features
- **MongoDB Integration**: Scalable database with Mongoose ODM
- **NextAuth.js**: Secure authentication and session management
- **Image Upload**: ImgBB integration for product images
- **API Routes**: RESTful API for all operations
- **Form Validation**: Client and server-side validation
- **Responsive UI**: Modern design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Image Storage**: ImgBB API
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- Google OAuth credentials
- GitHub OAuth credentials
- ImgBB API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-cart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   DB_NAME=products_app
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   IMGBB_API_KEY=your_imgbb_api_key
   NEXTAUTH_SECRET=your_super_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up OAuth applications**
   - **Google**: Create OAuth 2.0 credentials in Google Cloud Console
   - **GitHub**: Create OAuth App in GitHub Developer Settings
   - **ImgBB**: Get API key from ImgBB

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The application uses MongoDB with the following collections:

### Users Collection
- User profiles with authentication details
- Role-based access control
- OAuth provider information

### Products Collection
- Product information and details
- Image URLs and features
- Stock and pricing information

## 🔐 Authentication Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 📱 Usage

### For Customers
1. **Browse Products**: Visit `/products` to see all available products
2. **View Details**: Click on any product to see detailed information
3. **Create Account**: Sign up using email or OAuth providers
4. **Contact Support**: Use the contact form for inquiries

### For Administrators
1. **Access Dashboard**: Login and navigate to `/dashboard`
2. **Manage Products**: Add, edit, or remove products
3. **View Orders**: Monitor customer orders and status
4. **User Management**: Manage customer accounts

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Set production environment variables
4. Configure your hosting platform

## 🔒 Security Features

- **JWT Tokens**: Secure session management
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configured for production use
- **Environment Variables**: Secure credential management

## 📁 Project Structure

```
next-cart/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── products/      # Product management
│   │   │   └── upload/        # Image upload
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── products/          # Product pages
│   │   ├── login/             # Authentication pages
│   │   └── signup/            # User registration
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions
│   └── models/                # Database models
├── public/                    # Static assets
├── .env.local                 # Environment variables
└── package.json               # Dependencies
```

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (when implemented)
npm test

# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Stay updated with the latest features and security patches by:

1. Following the repository
2. Checking release notes
3. Updating dependencies regularly

---

**Built with ❤️ using Next.js and modern web technologies**
