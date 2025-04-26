// src/screens/Shop/components/FeaturedProducts.tsx
import { Button } from '../../../components/ui/button';
import { useShopStore } from '../../../store/shopStore';

export const FeaturedProducts = ({ products }: { products: any[] }) => {
  const { addToCart } = useShopStore();
  
  const featuredProducts = products.filter(product => product.bestseller);
  
  return (
    <div className="bg-gray-800 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Staff Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <div key={product.id} className="bg-gray-900 border border-gray-700 group">
              <div className="relative aspect-square bg-gray-700 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
                
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-400">{product.brand}</div>
                <h3 className="font-bold text-white mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${(product.salePrice || product.price).toFixed(2)}</span>
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none px-3 py-1 text-sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};