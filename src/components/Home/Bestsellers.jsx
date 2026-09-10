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
      className="group relative cursor-pointer flex flex-col bg-white border border-zinc-200 transition-all duration-500 hover:border-[#c9a962]/80 hover:shadow-lg w-full"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#fff] flex items-center justify-center">
        <OptimizedCloudinaryImage
          src={displayedImage}
          alt={product.name}
          preset="product-card"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center">
            <span className="bg-white text-black font-extrabold uppercase text-[9px] tracking-[0.2em] px-3 py-1.5">
              Out of Stock
            </span>
          </div>
        )}

        {/* Pre-Order Badge */}
        {isPreOrder && !isOutOfStock && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-white uppercase text-[9px] font-extrabold tracking-[0.2em] px-2.5 py-1 rounded-none shadow-sm">
              PRE-ORDER
            </span>
          </div>
        )}

        {/* Top-left Save Percentage Badge */}
        {!isPreOrder && savingsPercent > 0 && !isOutOfStock && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="bg-black text-white border border-[#c9a962]/50 uppercase text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-none">
              SAVE {savingsPercent}%
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => handleAction(e, 'wishlist')}
          aria-label="Save to wishlist"
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-white/90 backdrop-blur-sm text-zinc-700 hover:text-black hover:scale-110 transition-all duration-300 pointer-events-auto cursor-pointer shadow-sm"
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            fill={isWishlisted ? "#e53e3e" : "none"}
            stroke={isWishlisted ? "#e53e3e" : "currentColor"}
          />
        </button>

        {/* Hover Slide-up ADD TO CART overlay */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 z-20 overflow-hidden h-10 pointer-events-auto">
            <button
              onClick={(e) => handleAction(e, 'cart')}
              className={`w-full h-full text-[10px] tracking-[0.25em] font-extrabold uppercase transition-all duration-300 flex items-center justify-center ${isPreOrder
                ? 'bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-black hover:brightness-110'
                : 'bg-black text-white hover:bg-zinc-900'
                } ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}
            >
              {isInCart ? 'IN BAG' : isPreOrder ? 'PRE-ORDER NOW' : 'ADD TO CART'}
            </button>
          </div>
        )}
      </div>

      {/* Info Area (Text displays below product) */}
      <div className="pt-4 pb-5 px-3 flex flex-col text-left bg-white">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-semibold text-[#b8860b] mb-1">
          <span className="text-zinc-600 font-bold">{product.brand || 'MAHIRASH'}</span>
          <span>• {product.category || 'EXTRAIT DE PARFUM'}</span>
        </div>
        <h3 className="text-[14px] md:text-sm font-medium text-zinc-900 uppercase tracking-wider line-clamp-1 leading-snug mb-1.5">
          {product.name}
        </h3>

        {/* Prices */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-[13px] text-zinc-400 line-through font-light">
            ₹{Number(originalPrice).toLocaleString('en-IN')}
          </span>
          <span className="text-sm text-[#e53e3e] font-semibold tracking-wide">
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
      <section className="py-8 md:py-12 bg-[#f5f5f5] border-t border-zinc-200">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="h-3 w-28 bg-zinc-300 animate-pulse mb-3 rounded-none" />
              <div className="h-8 w-60 bg-zinc-300 animate-pulse rounded-none" />
            </div>
            <div className="hidden sm:flex gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-300 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-zinc-300 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-zinc-200 p-3 space-y-3">
                <div className="w-full aspect-[3/4] bg-zinc-200 animate-pulse relative" />
                <div className="h-4 bg-zinc-200 animate-pulse w-3/4" />
                <div className="h-4 bg-zinc-200 animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#f5f5f5] overflow-hidden border-t border-zinc-200">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Premium Header Layout */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#b8860b] uppercase mb-2 font-semibold">
                HAUTE SELECTION · CURATED EXTRAITS
              </p>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-zinc-900 uppercase whitespace-nowrap">
                FRESH DROPS & BESTSELLERS
              </h2>
            </div>
            <div className="hidden md:block flex-1 h-[1px] bg-zinc-200 mb-3" />
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto">
            <div className="flex gap-2.5">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-700 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 cursor-pointer shadow-sm"
              >
                &larr;
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-700 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 cursor-pointer shadow-sm"
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
            spaceBetween={14}
            slidesPerView={1.15}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 18,
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
        <div className="md:mt-14 mt-8 flex justify-center">
          <Link
            to="/shop"
            className="group flex items-center justify-center gap-3 px-10 py-4 border border-zinc-900 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-[0.28em] transition-all duration-300 hover:bg-white hover:text-black shadow-md rounded-none"
          >
            View All New Arrivals
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
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-black border border-[#c9a962]/50 text-white px-6 py-3.5 rounded-none shadow-2xl flex items-center gap-3"
          >
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap text-[#c9a962]">{feedbackMessage}</p>
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
