import { products } from "../../../data/products";
import Link from "next/link";
import ProductGallery from "../../../components/ProductGallery";
import ProductActions from "../../../components/ProductActions";
import RelatedProductCard from "../../../components/RelatedProductCard";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return (
      <div className="py-32 text-center text-white">
        <h2 className="text-3xl font-cinzel font-bold mb-4">Masterpiece Not Found</h2>
        <Link href="/" className="text-luxePink-500 hover:text-luxePink-400 uppercase tracking-widest border-b border-luxePink-500 pb-1 text-sm">
          Return to Collection
        </Link>
      </div>
    );
  }

  // Related products logic
  let relatedProducts = products.filter(p => p.id !== id && p.category === product.category);
  if (relatedProducts.length === 0) {
    relatedProducts = products.filter(p => p.id !== id);
  }
  relatedProducts = relatedProducts.slice(0, 4);

  const formattedPrice = (price: number) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="py-12 bg-velvet-400 min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs & Navigation */}
        <div className="flex justify-between items-center mb-8 border-b border-luxePink-500/10 pb-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-luxePink-500 transition">Home</Link>
            <span>&gt;</span>
            <span className="hover:text-luxePink-500 transition cursor-pointer">{product.category}</span>
            <span>&gt;</span>
            <span className="text-luxePink-500 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
             <Link href="/" className="hover:text-luxePink-500 transition"><i className="fa-solid fa-chevron-left"></i></Link>
             <button className="hover:text-luxePink-500 transition"><i className="fa-solid fa-expand"></i></button>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Image Gallery (Client Component) */}
          <ProductGallery product={product} />
          
          {/* Right Column: Details */}
          <div className="lg:w-[55%] flex flex-col">
            <div className="mb-2">
               <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                 Category: <span className="text-luxePink-500">{product.category}</span>
               </span>
            </div>
            
            <h1 className="font-cinzel text-3xl sm:text-4xl text-white font-extrabold mb-4 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="border border-gray-500 text-gray-300 text-[10px] uppercase font-bold px-2 py-1 tracking-widest rounded-sm">
                BEST SELLER
              </span>
              <span className="text-sm text-fuchsia-400 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-yellow-400"></i>
                Selling fast! 29 people have this in their carts.
              </span>
            </div>
            
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-luxePink-500/10">
              <span className="text-gray-500 line-through text-lg">
                {formattedPrice(product.originalPrice)}
              </span>
              <span className="text-3xl text-luxePink-500 font-extrabold text-glow-pink">
                {formattedPrice(product.price)}
              </span>
              <span className="bg-luxePink-600 text-white text-xs font-bold px-2 py-1 rounded-md ml-2">
                {product.discount}% OFF
              </span>
            </div>
            
            {/* Quantity & Actions (Client Component) */}
            <ProductActions product={product} />
            
            <div className="mb-8">
               <button className="text-sm text-gray-400 hover:text-luxePink-500 transition flex items-center gap-2">
                 <i className="fa-solid fa-share-nodes"></i> Share
               </button>
            </div>
            
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 mb-12">
            <h2 className="text-3xl sm:text-4xl font-medium text-center text-white mb-12">Related products</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(related => (
                <RelatedProductCard key={related.id} related={related} />
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
