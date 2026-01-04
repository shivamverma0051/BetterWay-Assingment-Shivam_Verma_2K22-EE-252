import { memo, useMemo } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-react';

const Cart = memo(function Cart({ cart, onUpdateQuantity, onRemoveItem }) {
  const { totalItems, totalPrice } = useMemo(() => {
    const items = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems: items, totalPrice: price };
  }, [cart]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Shopping Cart</h2>
        {cart.length > 0 && (
          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            {totalItems}
          </span>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">Your cart is empty</p>
          <p className="text-xs text-gray-500">Add products to get started</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="px-3 text-sm font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className={`p-1.5 transition-colors ${
                        item.quantity >= item.stock
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium text-gray-900">{totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            <CreditCard className="w-4 h-4" />
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
});

export default Cart;
