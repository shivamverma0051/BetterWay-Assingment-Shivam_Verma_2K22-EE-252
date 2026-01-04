import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingBag, Package, Loader2, AlertCircle, SearchX } from 'lucide-react';
import ProductGrid from './components/ProductGrid';
import Filters from './components/Filters';
import Cart from './components/Cart';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  
  // Cart state
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products?limit=20');
      const data = await response.json();
      
      // Normalize data: extract only required fields
      const normalizedProducts = data.products.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        stock: product.stock,
        thumbnail: product.thumbnail
      }));
      
      setProducts(normalizedProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already in cart
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prevCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const handleUpdateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      return;
    }

    setCart(prevCart => {
      const item = prevCart.find(i => i.id === productId);
      if (item && newQuantity <= item.stock) {
        return prevCart.map(cartItem =>
          cartItem.id === productId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      }
      return prevCart;
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Get unique categories - memoized
  const categories = useMemo(() => 
    [...new Set(products.map(p => p.category))],
    [products]
  );

  // Apply filters and sorting - memoized
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category === selectedCategory
      );
    }

    // Sort by price
    if (sortOrder === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortOrder]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortOrder('');
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">ShopHub</h1>
                <p className="text-xs text-gray-500 leading-none">Your favorite store</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">{products.length}</span>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-medium">Cart</span>
                  {totalCartItems > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {totalCartItems}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-sm text-gray-600">Loading products...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">Error loading products</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Filters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                onClearFilters={handleClearFilters}
                categories={categories}
              />
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <SearchX className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">No products found</p>
                  <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Cart
                  cart={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveFromCart}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
