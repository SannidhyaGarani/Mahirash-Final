import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Shuffle, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useStore } from '../StoreProvider';
import OptimizedCloudinaryImage from '../OptimizedCloudinaryImage';

const DEFAULT_PRODUCTS = [];

// Helper: Fisher-Yates random shuffle
const shuffleArray = (array) => {
  if (!array || array.length === 0) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const RandomProductCard = ({ product, idx, triggerToast }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useStore();
  const isWishlisted = wishlist.some(item => item.id === product.id);
  const [isHovered, setIsHovered] = useState(false);

  // Default to 50ml variant if available, otherwise base variant
  const defaultSize = product.size_prices && product.size_prices.length > 0
    ? (product.size_prices.find(s => s.size?.toLowerCase()?.trim() === '50ml') || product.size_prices[0])
    : null;

  const displayPrice = defaultSize ? defaultSize.price : product.price;
  const originalPrice = defaultSize?.original_price || product.mrp || product.original_price || Math.round((displayPrice || 999) * 1.25);
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, delay: idx * 0.04 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative cursor-pointer flex flex-col bg-white border border-zinc-200 transition-all duration-500 hover:border-[#c9a962]/80 hover:shadow-xl w-full"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-[#fff] flex items-center justify-center">
        <OptimizedCloudinaryImage
          src={displayedImage}
          alt={product.name}
          preset="product-card"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />

        {/* Out of Stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center">
            <span className="bg-white text-black font-extrabold uppercase text-[9px] tracking-[0.2em] px-3 py-1.5">
              Out of Stock
            </span>
          </div>
        )}

        {/* Pre-Order Badge */}
        {isPreOrder && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-white uppercase text-[9px] font-extrabold tracking-[0.2em] px-2.5 py-1 rounded-none shadow-sm">
              PRE-ORDER
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {!isPreOrder && savingsPercent > 0 && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black text-white border border-[#c9a962]/50 uppercase text-[9px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-none shadow-sm">
              {savingsPercent}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => handleAction(e, 'wishlist')}
          className="absolute top-3 right-3 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-full text-zinc-700 hover:text-black hover:scale-110 transition-all duration-300 shadow-sm cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            fill={isWishlisted ? '#e53e3e' : 'none'}
            stroke={isWishlisted ? '#e53e3e' : 'currentColor'}
          />
        </button>

        {/* Slide-up Add to Cart */}
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

      {/* Info Area */}
      <div className="p-4 flex flex-col text-left bg-white flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.25em] text-[#b8860b] uppercase mb-1">
            <span className="text-zinc-600 font-bold">{product.brand || 'MAHIRASH'}</span>
            <span>• {product.category || 'EXTRAIT DE PARFUM'}</span>
          </div>
          <h3 className="text-[14px] sm:text-sm font-medium text-zinc-900 uppercase tracking-wider line-clamp-1 leading-snug mb-2">
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline gap-2.5 pt-2 border-t border-zinc-100">
          <span className="text-[13px] text-zinc-400 line-through font-light">
            ₹{Number(originalPrice).toLocaleString('en-IN')}
          </span>
          <span className="text-sm text-[#e53e3e] font-semibold tracking-wide">
            ₹{Number(displayPrice).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const RandomProducts = () => {
  const [allRawProducts, setAllRawProducts] = useState([]);
  const [randomizedProducts, setRandomizedProducts] = useState([]);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [bannerData, setBannerData] = useState(null);

  const triggerToast = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      setRandomizedProducts(prev => shuffleArray(prev));
      setShuffleKey(k => k + 1);
      setIsShuffling(false);
    }, 200);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (!snap.empty) {
          const list = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(item => item.is_active !== false);
          setAllRawProducts(list);
          setRandomizedProducts(shuffleArray(list));
        } else {
          setAllRawProducts([]);
          setRandomizedProducts([]);
        }
      } catch (err) {
        console.warn('Error fetching random products:', err);
        setAllRawProducts([]);
        setRandomizedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchBanner = async () => {
      try {
        const snap = await getDocs(collection(db, 'explore_banner'));
        if (!snap.empty) {
          setBannerData(snap.docs[0].data());
        }
      } catch (err) { }
    };
    fetchProducts();
    fetchBanner();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-[#f5f5f5] border-t border-zinc-200">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-3 w-32 bg-zinc-300 animate-pulse mb-3" />
              <div className="h-8 w-64 bg-zinc-300 animate-pulse" />
            </div>
            <div className="w-28 h-9 bg-zinc-300 animate-pulse rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-zinc-200 p-3 space-y-3">
                <div className="aspect-[2/3] bg-zinc-200 animate-pulse" />
                <div className="h-3 bg-zinc-200 animate-pulse w-2/3" />
                <div className="h-4 bg-zinc-200 animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 bg-[#f5f5f5] relative border-t border-zinc-200 overflow-hidden">

      {/* ── Dynamic Explore Banner ── */}
      {bannerData && (bannerData.desktop_image || bannerData.mobile_image) && bannerData.is_active !== false && (
        <div className="w-full mb-10">
          <Link to={bannerData.link || "/shop"} className="block relative w-full overflow-hidden group">
            <picture>
              {bannerData.desktop_image && <source media="(min-width: 1024px)" srcSet={bannerData.desktop_image} />}
              {bannerData.tablet_image && <source media="(min-width: 768px)" srcSet={bannerData.tablet_image} />}
              <img
                src={bannerData.mobile_image || bannerData.desktop_image || bannerData.image_url}
                alt="Explore Features"
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] m-0 p-0 block leading-[0]"
              />
            </picture>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
          </Link>
        </div>
      )}

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <div className="flex-1 flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#b8860b] uppercase font-semibold">
                  CURATED DISCOVERIES · BESPOKE SELECTIONS
                </p>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-zinc-900 uppercase whitespace-nowrap">
                EXPLORE ALL EXTRAITS & STYLES
              </h2>
            </div>
            <div className="hidden md:block flex-1 h-[1px] bg-zinc-200 mb-3" />
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            <button
              type="button"
              onClick={handleShuffle}
              disabled={isShuffling}
              className="flex items-center gap-2.5 px-4.5 py-2.5 border border-[#c9a962]/60 bg-white text-zinc-800 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm rounded-none cursor-pointer group shrink-0"
            >
              <Shuffle
                size={14}
                className={`transition-transform duration-500 ${isShuffling ? 'rotate-180 text-[#b8860b]' : 'group-hover:rotate-45'}`}
              />
              <span>Shuffle Order</span>
            </button>
          </div>
        </div>

        {/* Randomized Grid Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={shuffleKey}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          >
            {randomizedProducts.map((product, idx) => (
              <RandomProductCard
                key={product.id}
                product={product}
                idx={idx}
                triggerToast={triggerToast}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 border border-zinc-900 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-[0.28em] transition-all duration-300 hover:bg-white hover:text-black rounded-none shadow-md"
          >
            <span>View Full Catalogue</span>
            <ArrowRight size={15} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
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

export default RandomProducts;
