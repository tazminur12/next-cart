import Link from 'next/link';

async function getProduct(id) {
  const origin = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${origin}/api/products/${id}`, { cache: 'no-store', next: { revalidate: 0 } });
  if (!res.ok) throw new Error('Failed to load product');
  const data = await res.json();
  return data.product;
}

export default async function ProductDetailsPage({ params }) {
  const { id } = params;
  const product = await getProduct(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            <span>←</span> Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-96 lg:h-full bg-gray-50 dark:bg-gray-700">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow">{product.category}</span>
                {product.brandName && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white shadow">{product.brandName}</span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{product.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${product.price}</span>
                {product.sku && <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">SKU: {product.sku}</span>}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{product.description}</p>

              {Array.isArray(product.tags) && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p><span className="font-medium">Stock:</span> {product.stockQuantity ?? 0} units</p>
                {product.creatorEmail && <p><span className="font-medium">Seller:</span> {product.creatorEmail}</p>}
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold shadow">Add to Cart</button>
                <button className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white py-3 px-6 rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-semibold shadow">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
