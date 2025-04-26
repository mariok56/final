// src/screens/Shop/index.tsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { ShopHero } from './components/shophero';
import { SearchBar } from './components/SearchBar';
import { ProductFilters } from './components/ProductFilters';
import { ProductGrid } from './components/ProductGrid';
import { CartDropdown } from './components/Cart/CartDropdown';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Newsletter } from './components/Newsletter';
import { useProductFilter } from './hooks/useProductFilter';

export const Shop = () => {
  const { cart, isCartOpen, isCheckoutOpen, toggleCart } = useShopStore();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<{ id: string; [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  const {
    products: filteredProducts,
    activeCategory,
    setActiveCategory,
    activeSorting,
    setActiveSorting,
    handleSearch,
  } = useProductFilter(products);
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ShopHero />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex items-center">
            <button 
              id="cart-button"
              className="relative p-2 mr-2"
              onClick={toggleCart}
            >
              <ShoppingCart size={24} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#fbb034] text-black text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="flex items-center bg-gray-800 p-2 border border-gray-700 md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ProductFilters 
            isVisible={showFilters}
            activeCategory={activeCategory}
            activeSorting={activeSorting}
            onCategoryChange={setActiveCategory}
            onSortChange={setActiveSorting}
          />
          
          {loading ? (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              Loading products...
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
      
      <FeaturedProducts products={products} />
      <Newsletter />
      
      {isCartOpen && <CartDropdown />}
      {isCheckoutOpen && <CheckoutModal />}
    </div>
  );
};