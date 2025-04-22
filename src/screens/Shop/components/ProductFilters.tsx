import { categories, sortOptions } from '../data/constants';

interface ProductFiltersProps {
  isVisible: boolean;
  activeCategory: string;
  activeSorting: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export const ProductFilters = ({
  isVisible,
  activeCategory,
  activeSorting,
  onCategoryChange,
  onSortChange
}: ProductFiltersProps) => {
  return (
    <div className={`${isVisible ? 'block' : 'hidden'} md:block col-span-1 space-y-8`}>
      <div>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-3 py-2 transition-colors ${
                activeCategory === category.id
                  ? "bg-[#fbb034]/10 text-[#fbb034]"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map(option => (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id)}
              className={`block w-full text-left px-3 py-2 transition-colors ${
                activeSorting === option.id
                  ? "bg-[#fbb034]/10 text-[#fbb034]"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Availability</h3>
        <label className="flex items-center px-3 py-2 cursor-pointer text-gray-300 hover:bg-gray-800">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4 accent-[#fbb034]"
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
};
