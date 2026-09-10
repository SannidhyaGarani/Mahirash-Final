import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Mousewheel, FreeMode } from 'swiper/modules';
import { db } from '../../components/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import OptimizedCloudinaryImage from '../OptimizedCloudinaryImage';

import 'swiper/css';
import 'swiper/css/free-mode';

const DEFAULT_SCENTS = [
  {
    id: 'scent_woody',
    name: 'WOODY & OUD',
    title: 'WOODY & OUD',
    description: 'Royal Cambodian Oud, Cedarwood & Warm Amber',
    badge: 'WARM & RICH',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop',
    link: '/shop?scent=Woody',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'scent_citrus',
    name: 'CITRUS & SPICE',
    title: 'CITRUS & SPICE',
    description: 'Calabrian Bergamot, Zesty Lime & Cardamom',
    badge: 'FRESH & VIBRANT',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    link: '/shop?scent=Citrus',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'scent_floral',
    name: 'FLORAL EXTRAITS',
    title: 'FLORAL EXTRAITS',
    description: 'Damask Rose, Grasse Jasmine & Velvet Blossom',
    badge: 'ELEGANT BLOOMS',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
    link: '/shop?scent=Floral',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'scent_aromatic',
    name: 'AROMATIC ATELIER',
    title: 'AROMATIC ATELIER',
    description: 'French Lavender, Wild Sage & Exotic Spices',
    badge: 'HERBAL & SPICY',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop',
    link: '/shop?scent=Aromatic',
    sort_order: 4,
    is_active: true
  }
];

const CategorySection = () => {
  const [scents, setScents] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchScents = async () => {
      try {
        // 1. Try shop_by_scents collection
        const snapScents = await getDocs(collection(db, 'shop_by_scents'));
        let list = snapScents.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (list.length === 0) {
          // 2. Fallback try shop_by_category collection
          const snapCat = await getDocs(collection(db, 'shop_by_category'));
          list = snapCat.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        const activeList = list
          .filter(item => item.is_active !== false)
          .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));

        setScents(activeList.length > 0 ? activeList : DEFAULT_SCENTS);
      } catch (error) {
        console.warn("Using default scents fallback:", error);
        setScents(DEFAULT_SCENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchScents();
  }, []);

  if (loading && scents.length === 0) return null;

  const displayScents = scents.length > 0 ? scents : DEFAULT_SCENTS;
  const itemsToRender = displayScents.slice(0, 4);

  return (
    <section className="py-10 md:py-14 bg-[#f5f5f5] overflow-hidden relative border-t border-zinc-200">
      {/* Header Container */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10">
        <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#b8860b] uppercase mb-2 font-semibold">
          OLFACTORY FAMILIES
        </p>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center flex-1 min-w-0">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-zinc-900 uppercase whitespace-nowrap leading-none">
              SHOP BY SCENT ATELIER
            </h2>
            <div className="hidden md:block flex-1 h-[1px] bg-zinc-200 ml-8 mr-4 self-center mt-1" />
          </div>
        </div>
      </div>

      {/* Desktop Grid View (hidden lg:grid) - Full Width Edge-to-Edge 4 Cards matching ShopTheLook */}
      <div className="hidden lg:grid grid-cols-4 gap-0 w-full max-w-none">
        {itemsToRender.map((scent) => (
          <div key={scent.id} className="relative w-full flex flex-col bg-[#f5f5f5] border-none outline-none group">
            <Link
              to={scent.link || `/shop?scent=${encodeURIComponent(scent.name || scent.title)}`}
              className="relative group block overflow-hidden bg-zinc-900 aspect-[3/4] w-full border-none outline-none"
            >
              <OptimizedCloudinaryImage
                src={scent.image}
                alt={scent.name || scent.title}
                preset="product-card"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-[700ms] ease-out group-hover:scale-[1.05]"
              />
              {/* Dark Gold Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Floating Gold Border Highlight */}
              <div className="absolute inset-0 border border-[#c9a962]/0 group-hover:border-[#c9a962]/70 transition-colors duration-500 pointer-events-none z-10" />
            </Link>

            {/* Meta Text Content below Image (matching ShopTheLook design) */}
            <div className="pt-5 pb-6 text-center flex flex-col items-center border-none px-3">
              {scent.badge && (
                <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#b8860b] mb-1.5">
                  {scent.badge}
                </span>
              )}
              <h4 className="text-[14px] font-semibold text-zinc-900 tracking-[0.15em] uppercase leading-snug line-clamp-1 mb-1">
                {scent.name || scent.title}
              </h4>
              {scent.description && (
                <span className="text-[11px] text-zinc-600 tracking-wide line-clamp-1 mt-0.5">
                  {scent.description}
                </span>
              )}
              <Link
                to={scent.link || `/shop?scent=${encodeURIComponent(scent.name || scent.title)}`}
                className="text-[10px] text-[#b8860b] tracking-[0.25em] font-bold uppercase mt-2.5 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
              >
                EXPLORE SCENT &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet View (lg:hidden): Seamless continuous Swiper matching ShopTheLook */}
      <div className="lg:hidden w-full max-w-none px-0">
        <Swiper
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          spaceBetween={0}
          slidesPerView={1.25}
          breakpoints={{
            500: { slidesPerView: 1.5, spaceBetween: 0 },
            640: { slidesPerView: 2, spaceBetween: 0 }
          }}
          freeMode={true}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1.2,
          }}
          autoplay={{
            delay: 3200,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Mousewheel, FreeMode]}
          className="w-full overflow-visible"
        >
          {itemsToRender.map((scent) => (
            <SwiperSlide key={scent.id} className="flex flex-col bg-[#f5f5f5] border-none outline-none group">
              <Link
                to={scent.link || `/shop?scent=${encodeURIComponent(scent.name || scent.title)}`}
                className="relative group block overflow-hidden bg-zinc-900 aspect-[3/4] w-full border-none outline-none"
              >
                <OptimizedCloudinaryImage
                  src={scent.image}
                  alt={scent.name || scent.title}
                  preset="product-card"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </Link>
              {/* Meta Text Content below Image */}
              <div className="py-4 px-2 text-center flex flex-col items-center border-none">
                {scent.badge && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b8860b] mb-1">
                    {scent.badge}
                  </span>
                )}
                <h5 className="text-[14px] sm:text-sm text-zinc-900 tracking-wider uppercase font-semibold leading-snug px-1 line-clamp-1 mb-1">
                  {scent.name || scent.title}
                </h5>
                {scent.description && (
                  <span className="text-[11px] text-zinc-600 tracking-wide line-clamp-1">
                    {scent.description}
                  </span>
                )}
                <Link
                  to={scent.link || `/shop?scent=${encodeURIComponent(scent.name || scent.title)}`}
                  className="text-[10px] text-[#b8860b] tracking-[0.2em] font-bold uppercase mt-1.5 inline-flex items-center gap-1"
                >
                  EXPLORE &rarr;
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CategorySection;

