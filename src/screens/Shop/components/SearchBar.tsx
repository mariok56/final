import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    onSearch(value);
  };
  
  return (
    <div className="relative w-full md:w-96 mb-4 md:mb-0">
      <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={handleSearchChange}
        className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
      />
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
};