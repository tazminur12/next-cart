import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      bio: 'Passionate about creating amazing shopping experiences.'
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      bio: 'Technology enthusiast with expertise in building scalable platforms.'
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Operations',
      bio: 'Ensuring smooth operations and excellent customer service.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '50+', label: 'Team Members' },
    { number: '5+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-blue-600 dark:text-blue-400">NextCart</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We&apos;re on a mission to revolutionize online shopping by providing the best products, 
            exceptional service, and an unforgettable customer experience.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p>
                  NextCart was born from a simple idea: online shopping should be easy, 
                  enjoyable, and trustworthy. Founded in 2019, we&apos;ve started as a small team 
                  with big dreams.
                </p>
                <p>
                  Today, we&apos;ve grown into a thriving e-commerce platform that serves 
                  thousands of customers worldwide. Our commitment to quality, customer 
                  service, and innovation has never wavered.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl h-64 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Company Image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Our Values
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              These core values guide everything we do and shape our company culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">We never compromise on quality. Every product meets our high standards.</p>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600 transition-colors duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Focus</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Our customers are at the heart of every decision we make.</p>
            </div>
            
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600 transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">We constantly innovate to provide better shopping experiences.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Meet Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              The passionate people behind NextCart who make it all possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Photo</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2 text-sm">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Join Our Journey
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Be part of our growing community and experience the future of online shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Now
            </Link>
            <a
              href="/contact"
              className="bg-transparent text-white border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
