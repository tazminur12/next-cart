import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [120, 'Product title cannot exceed 120 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Product description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: [
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
      ],
      message: 'Please select a valid category'
    }
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  brandName: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'draft', 'inactive'],
    default: 'draft'
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// Create indexes for search functionality
productSchema.index({ title: 'text', description: 'text', brandName: 'text', sku: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
