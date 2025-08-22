'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const categories = [
  'Electronics',
  'Fashion',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Automotive',
  'Toys & Games',
  'Jewelry & Accessories',
  'Pet Supplies',
  'Office & School',
  'Baby & Kids',
  'Tools & Hardware',
  'Other'
];

export default function EditProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stockQuantity: '',
    description: '',
    brandName: '',
    sku: '',
    discountPrice: '',
    tags: '',
    status: 'draft',
    image: ''
  });

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error('Failed to load product');
        const data = await res.json();
        const p = data.product;
        setFormData({
          title: p.title || '',
          category: p.category || '',
          price: String(p.price ?? ''),
          stockQuantity: String(p.stockQuantity ?? ''),
          description: p.description || '',
          brandName: p.brandName || '',
          sku: p.sku || '',
          discountPrice: p.discountPrice != null ? String(p.discountPrice) : '',
          tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
          status: p.status || 'draft',
          image: p.image || ''
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        creatorEmail: session?.user?.email || undefined
      };
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const msg = (await res.json())?.error || 'Failed to update product';
        try {
          const Swal = (await import('sweetalert2')).default;
          await Swal.fire({ icon: 'error', title: 'Error', text: msg });
        } catch {}
        return;
      }
      try {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({ icon: 'success', title: 'Updated', timer: 1200, showConfirmButton: false });
      } catch {}
      router.replace('/dashboard/my-products');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600">Update your product details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select category</option>
              {categories.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
            <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <input name="brandName" value={formData.brandName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
          <input name="sku" value={formData.sku} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
          <input type="number" step="0.01" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input name="tags" value={formData.tags} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input name="image" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          {formData.image && (
            <div className="mt-3 relative w-24 h-24">
              <Image src={formData.image} alt="Preview" fill className="object-cover rounded" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" rows={5} value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border rounded-md">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
