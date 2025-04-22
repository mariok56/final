import { ProductCard } from './ProductCard';
import { Button } from '../../../components/ui/button';
import { Product } from '../../../types/shop';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="col-span-1 md:col-span-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-400">No products found matching your criteria.</p>
            <Button 
              onClick={() => {
                // Reset filters logic could be moved here
              }}
              className="mt-4 bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};