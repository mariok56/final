import { Button } from '../../../components/ui/button';
import { useShopStore } from '../../../store/shopStore';
import { Product } from '../../../types/shop';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useShopStore();
  
  return (
    <div className="bg-gray-800 border border-gray-700 group">
      <div className="relative aspect-square bg-gray-700 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
        
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
            SALE
          </div>
        )}
        {product.isNew && !product.salePrice && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1">
            NEW
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 font-bold">OUT OF STOCK</span>
          </div>
        )}
        
        {product.inStock && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => addToCart(product)}
              className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
            >
              Quick Add
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-400 mb-1">{product.brand}</div>
        <h3 className="font-bold text-white mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-red-500 font-bold mr-2">${product.salePrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          <Button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none px-3 py-1 text-sm disabled:bg-gray-700 disabled:text-gray-500"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};