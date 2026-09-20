import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useStore } from '../../components/StoreProvider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import OptimizedCloudinaryImage from '../OptimizedCloudinaryImage';

import 'swiper/css';

const ProductCard = ({ product, idx, triggerToast }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useStore();
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const [isHovered, setIsHovered] = useState(false);

  // Default to 50ml variant if available, otherwise base variant
  const defaultSize = product.size_prices && product.size_prices.length > 0
    ? (product.size_prices.find(s => s.size?.toLowerCase()?.trim() === '50ml') || product.size_prices[0])
    : null;

  const displayPrice = defaultSize ? defaultSize.price : product.price;
  const originalPrice = defaultSize?.original_price || product.original_price || Math.round((displayPrice || 999) * 1.25);
  const savingsPercent = displayPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;

  const cartItemId = defaultSize ? `${product.id}-${defaultSize.size}` : product.id;
  const isInCart = cart.some(item => (item.cartId || item.id) === cartItemId);
  const isPreOrder = Boolean(defaultSize?.is_preorder);
  const isOutOfStock = !isPreOrder && ((defaultSize ? defaultSize.stock === 0 : product.stock === 0) || product.stock_status === 'Out of Stock');

  const handleAction = async (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'cart') {
      if (isInCart) return;
      await addToCart(product, defaultSize);
      triggerToast(isPreOrder ? 'Pre-order added to bag' : 'Added to bag');
    } else {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        triggerToast('Removed from wishlist');
      } else {
        await addToWishlist(product);
        triggerToast('Saved to wishlist');
      }
    }
  };

  const displayedImage = isHovered && product.images && product.images.length > 1
    ? product.images[1]
    : (defaultSize?.image || product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative cursor-pointer flex flex-col bg-white rounded-2xl border border-[#E5D5B8] transition-all duration-500 hover:border-[#B8860B] shadow-[0_8px_25px_-5px_rgba(184,134,11,0.08)] hover:shadow-[0_15px_35px_-5px_rgba(184,134,11,0.18)] hover:-translate-y-1.5 w-full overflow-hidden"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#FAF8F5] flex items-center justify-center">
        <OptimizedCloudinaryImage
          src={displayedImage}
          alt={product.name}
          preset="product-card"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Subtle Gold Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-white text-zinc-900 border border-[#E5D5B8] font-extrabold uppercase text-[9px] tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          </div>
        )}

        {/* Pre-Order Badge */}
        {isPreOrder && !isOutOfStock && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-white font-black uppercase text-[9px] tracking-[0.2em] px-3 py-1 rounded-full shadow-md">
              PRE-ORDER
            </span>
          </div>
        )}

        {/* Top-left Save Percentage Badge */}
        {!isPreOrder && savingsPercent > 0 && !isOutOfStock && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-[#0D0D0D] text-[#D4AF37] border border-[#B8860B]/40 uppercase text-[9px] font-extrabold tracking-[0.2em] px-3 py-1 rounded-full shadow-md">
              SAVE {savingsPercent}%
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => handleAction(e, 'wishlist')}
          aria-label="Save to wishlist"
          className="absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E5D5B8] text-zinc-700 hover:text-black hover:border-[#B8860B] hover:scale-110 transition-all duration-300 pointer-events-auto cursor-pointer shadow-md"
        >
          <Heart
            size={15}
            strokeWidth={2}
            fill={isWishlisted ? "#ef4444" : "none"}
            stroke={isWishlisted ? "#ef4444" : "currentColor"}
          />
        </button>

        {/* Hover Slide-up ADD TO CART overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 z-20 overflow-hidden h-11 pointer-events-auto">
            <button
              onClick={(e) => handleAction(e, 'cart')}
              className={`w-full h-full text-[10px] tracking-[0.25em] font-extrabold uppercase transition-all duration-300 flex items-center justify-center ${isPreOrder
                ? 'bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-white hover:brightness-110'
                : 'bg-[#0D0D0D] text-white hover:bg-[#B8860B] shadow-lg'
                } ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
            >
              {isInCart ? 'IN BAG' : isPreOrder ? 'PRE-ORDER NOW' : 'ADD TO CART'}
            </button>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="pt-4 pb-5 px-4 flex flex-col text-left bg-white">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-bold text-[#B8860B] mb-1.5">
          <span className="text-[#B8860B]">{product.brand || 'MAHIRASH'}</span>
          <span className="text-zinc-300">•</span>
          <span className="text-zinc-500">{product.category || 'EXTRAIT DE PARFUM'}</span>
        </div>
        <h3 className="text-[14px] md:text-sm font-semibold text-[#0D0D0D] uppercase tracking-wider line-clamp-1 leading-snug mb-2 group-hover:text-[#B8860B] transition-colors">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-[13px] text-zinc-400 line-through font-light">
            ₹{Number(originalPrice).toLocaleString('en-IN')}
          </span>
          <span className="text-sm text-[#B8860B] font-bold tracking-wide">
            ₹{Number(displayPrice).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

const BestsellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const swiperRef = useRef(null);

  const triggerToast = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return timeB - timeA;
        });
        const activeList = list.filter(item => item.is_active !== false);
        setProducts(activeList);
      } catch (err) {
        console.error("Error loading bestseller products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#FAF8F5] border-t border-[#E5D5B8]/60">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="h-3 w-28 bg-zinc-200 animate-pulse mb-3 rounded-md" />
              <div className="h-8 w-60 bg-zinc-200 animate-pulse rounded-md" />
            </div>
            <div className="hidden sm:flex gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#E5D5B8] p-3 space-y-3 rounded-2xl">
                <div className="w-full aspect-[3/4] bg-zinc-100 animate-pulse rounded-xl" />
                <div className="h-4 bg-zinc-200 animate-pulse w-3/4 rounded" />
                <div className="h-4 bg-zinc-200 animate-pulse w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-[#FAF8F5] overflow-hidden border-t border-[#E5D5B8]/60 relative">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Premium Header Layout */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#B8860B] uppercase mb-2 font-bold flex items-center gap-2">
                <span>HAUTE SELECTION</span>
                <span>•</span>
                <span>CURATED EXTRAITS</span>
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-[#0D0D0D] uppercase whitespace-nowrap">
                FRESH DROPS & BESTSELLERS
              </h2>
            </div>
            <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-[#B8860B]/40 via-zinc-300 to-transparent mb-3" />
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto">
            <div className="flex gap-2.5">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full border border-[#E5D5B8] bg-white flex items-center justify-center text-zinc-700 hover:text-white hover:bg-[#B8860B] hover:border-[#B8860B] transition-all duration-300 cursor-pointer shadow-md"
              >
                &larr;
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full border border-[#E5D5B8] bg-white flex items-center justify-center text-zinc-700 hover:text-white hover:bg-[#B8860B] hover:border-[#B8860B] transition-all duration-300 cursor-pointer shadow-md"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Swiper Carousel */}
        <div className="w-full">
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            spaceBetween={18}
            slidesPerView={1.15}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 18,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 22,
              },
            }}
            modules={[Mousewheel]}
            className="w-full overflow-visible"
          >
            {products.map((product, idx) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} idx={idx} triggerToast={triggerToast} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Centered Outlined CTA */}
        <div className="md:mt-16 mt-10 flex justify-center">
          <Link
            to="/shop"
            className="group flex items-center justify-center gap-3 px-10 py-4 border border-[#0D0D0D] bg-[#0D0D0D] text-white text-[11px] font-extrabold uppercase tracking-[0.28em] transition-all duration-300 hover:bg-[#B8860B] hover:border-[#B8860B] rounded-full shadow-lg"
          >
            <span>View All New Arrivals</span>
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#0D0D0D] border border-[#B8860B] text-white px-7 py-3.5 rounded-full shadow-2xl flex items-center gap-3 gold-glow-sm"
          >
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap text-[#D4AF37]">{feedbackMessage}</p>
            <button onClick={() => setFeedbackMessage(null)} className="opacity-60 hover:opacity-100 ml-1 text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BestsellerProducts;
export { BestsellerProducts as Bestsellers };
