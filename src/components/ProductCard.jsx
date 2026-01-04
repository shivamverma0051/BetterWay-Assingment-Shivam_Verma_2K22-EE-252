import { memo } from 'react';
import { Check, X } from 'lucide-react';

const ProductCard = memo(function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all flex flex-col h-full">
      <div className="relative overflow-hidden bg-gray-100">
        {product.thumbnail && (
          <>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            {!isOutOfStock && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 bg-white text-green-600 text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                  <Check className="w-3 h-3" />
                  In Stock
                </span>
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 bg-white text-red-600 font-semibold px-4 py-2 rounded-lg">
                  <X className="w-4 h-4" />
                  Out of Stock
                </span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md capitalize">
            {product.category}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-medium">{product.stock}</span> left
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors mt-auto ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
