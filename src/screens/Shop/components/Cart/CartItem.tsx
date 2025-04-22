import { Plus, Minus, Trash2 } from 'lucide-react';
import { useShopStore } from '../../../../store/shopStore';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useShopStore();
  
  return (
    <div className="p-4 flex items-center">
      <div className="h-16 w-16 bg-gray-700 mr-4">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <div className="text-sm text-gray-400">{item.product.brand}</div>
        <div className="font-medium">{item.product.name}</div>
        <div className="text-sm mt-1">
          ${(item.product.salePrice || item.product.price).toFixed(2)}
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => removeFromCart(item.product.id)}
          className="p-1 ml-2 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};