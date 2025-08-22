import Link from 'next/link';

function buildApiUrl(path, searchParams) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = new URL(path.startsWith('/') ? path : `/${path}`, origin);
  if (searchParams?.page) url.searchParams.set('page', String(searchParams.page));
  if (searchParams?.category) url.searchParams.set('category', String(searchParams.category));
  if (searchParams?.search) url.searchParams.set('search', String(searchParams.search));
  return url.toString();
}

async function getProducts(resolvedParams) {
  const url = buildApiUrl('/api/products', resolvedParams);
  const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage({ searchParams }) {
  const resolved = typeof searchParams?.then === 'function' ? await searchParams : searchParams;
  const { products, pagination } = await getProducts(resolved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Explore Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Handpicked items, great value, and fresh arrivals.</p>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-52 bg-gray-50 dark:bg-gray-700 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm">{p.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${p.price}</span>
                    <Link href={`/products/${p.id}`} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow">
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none border-transparent group-hover:border-blue-600/30 rounded-2xl border transition-colors" />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-12">
          {pagination?.hasPrevPage && (
            <Link href={`/products?page=${(pagination.currentPage || 1) - 1}`} className="px-5 py-2 rounded-full border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border-gray-200 dark:border-gray-600 transition-colors">
              ← Previous
            </Link>
          )}
          {pagination?.hasNextPage && (
            <Link href={`/products?page=${(pagination.currentPage || 1) + 1}`} className="px-5 py-2 rounded-full border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border-gray-200 dark:border-gray-600 transition-colors">
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
