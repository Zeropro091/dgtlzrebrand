import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Determine if it needs a right border (for multi-column layouts)
  const isRightCol = product.span === 'md:col-span-6';
  
  return (
    <div className={`col-span-12 ${product.span} border-b border-electric-blue group ${isRightCol ? 'md:even:border-r-0 md:border-r' : 'md:border-r'}`}>
      <div className={`dither-container ${isRightCol ? 'h-[500px]' : 'h-[400px]'}`}>
        <img 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          src={product.imageUrl} 
        />
      </div>
      <div className="p-gutter flex justify-between items-start bg-off-white group-hover:bg-electric-blue group-hover:text-white transition-colors border-t border-electric-blue">
        <div>
          <h3 className="font-label-caps font-bold">{product.name}</h3>
          <p className="text-[10px] font-body-sm opacity-60 uppercase mt-1">{product.category}</p>
        </div>
        <span className="font-body-sm">{product.price}</span>
      </div>
    </div>
  );
}
