# Next.js Cart - E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 14, featuring user authentication, product management, and a responsive shopping experience.

## 🚀 Project Description

Next.js Cart is a comprehensive e-commerce solution that provides:

- **User Authentication**: Secure login/signup with NextAuth.js and MongoDB
- **Product Management**: Add, edit, and manage products with image uploads
- **Shopping Experience**: Browse products, view details, and manage cart
- **Admin Dashboard**: Dedicated dashboard for product management
- **Responsive Design**: Modern UI that works on all devices
- **Dark/Light Theme**: Toggle between themes for better user experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Git for version control

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/tazminur12/next-cart.git
cd next-cart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Optional: Google OAuth (if using Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Database Setup
- Ensure MongoDB is running
- The application will automatically create collections on first run
- Default collections: `users`, `products`, `sessions`, `accounts`

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm start
```

## 🗺️ Route Summary

### Public Routes
- **`/`** - Home page with featured products
- **`/about`** - About page
- **`/contact`** - Contact page
- **`/products`** - Product listing page
- **`/products/[id]`** - Individual product detail page
- **`/login`** - User login page
- **`/signup`** - User registration page

### Protected Routes (Require Authentication)
- **`/dashboard`** - Main dashboard overview
- **`/dashboard/add-product`** - Add new product form
- **`/dashboard/my-products`** - View and manage user's products
- **`/dashboard/edit-product/[id]`** - Edit existing product

### API Routes
- **`/api/auth/[...nextauth]`** - NextAuth.js authentication endpoints
- **`/api/auth/signup`** - User registration endpoint
- **`/api/products`** - Product CRUD operations
- **`/api/products/[id]`** - Individual product operations
- **`/api/products/my-products`** - Get user's products
- **`/api/upload`** - Image upload endpoint
- **`/api/email`** - Email functionality

## 🔐 Authentication Features

- **Local Authentication**: Email/password registration and login
- **Session Management**: Secure session handling with NextAuth.js
- **Protected Routes**: Automatic redirect for unauthenticated users
- **User Roles**: Basic user management system

## 📱 Features

### For Users
- Browse and search products
- View detailed product information
- User registration and login
- Personal dashboard

### For Product Owners
- Add new products with images
- Edit existing products
- Manage product inventory
- View product analytics

## 🎨 UI Components

- **Navbar**: Responsive navigation with theme toggle
- **Footer**: Site information and links
- **Product Cards**: Attractive product display
- **Forms**: User-friendly input forms
- **Theme Toggle**: Dark/light mode switch

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
- **Netlify**: Build and deploy from GitHub
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: Custom server deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/tazminur12/next-cart/issues) page
2. Create a new issue with detailed description
3. Contact the maintainers

---

**Happy Coding! 🎉**
