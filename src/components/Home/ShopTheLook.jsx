import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { db } from '../../components/Firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import OptimizedCloudinaryImage from '../OptimizedCloudinaryImage';

const DEFAULT_GENDER_BANNERS = [
  {
    id: 'banner_men',
    title: 'FOR HIM',
    tag: 'MASCULINE SIGNATURES',
    subtitle: 'Bold, intense, and magnetic extraits formulated for presence.',
    cta: "DISCOVER MEN'S",
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?gender=Men',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'banner_women',
    title: 'FOR HER',
    tag: 'FEMININE ESSENCES',
    subtitle: 'Sensual, elegant, and floral extraits crafted to leave a lasting sillage.',
    cta: "DISCOVER WOMEN'S",
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?gender=Women',
    sort_order: 2,
    is_active: true
  }
];

const ShopTheLook = () => {
  const [banners, setBanners] = useState(DEFAULT_GENDER_BANNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // 1. Try gender_banners collection
        const qGender = query(collection(db, 'gender_banners'));
        const snapGender = await getDocs(qGender);

        if (!snapGender.empty) {
          const list = snapGender.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item => item.is_active !== false);
          list.sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
          setBanners(list.length > 0 ? list : DEFAULT_GENDER_BANNERS);
        } else {
          // 2. Fallback check shop_the_look collection
          const qLook = query(collection(db, 'shop_the_look'));
          const snapLook = await getDocs(qLook);
          if (!snapLook.empty) {
            const list = snapLook.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(item => item.is_active !== false);
            setBanners(list.length > 0 ? list : DEFAULT_GENDER_BANNERS);
          }
        }
      } catch (error) {
        console.warn("Using default gender banners fallback:", error);
        setBanners(DEFAULT_GENDER_BANNERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading && banners.length === 0) return null;

  const displayBanners = banners.length > 0 ? banners : DEFAULT_GENDER_BANNERS;

  return (
    <section className="py-12 md:py-16 bg-[#f5f5f5] overflow-hidden relative border-t border-zinc-200">
      {/* Header Container */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-10">
        <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#b8860b] uppercase mb-2 font-semibold">
          THE DUALITY OF SCENT · SIGNATURE ATELIER
        </p>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-zinc-900 uppercase whitespace-nowrap">
              FOR HIM & FOR HER
            </h2>
            <div className="hidden md:block flex-1 h-[1px] bg-zinc-200 ml-8 mr-4 self-center mt-1" />
          </div>
        </div>
      </div>

      {/* Dual Banners Grid: Side-by-Side (Desktop 2 cols, Mobile 1 col) */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {displayBanners.slice(0, 2).map((banner, index) => (
            <motion.div
              key={banner.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full"
            >
              <Link
                to={banner.link || (index === 0 ? '/shop?gender=Men' : '/shop?gender=Women')}
                className="relative group block overflow-hidden bg-black aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5] w-full rounded-2xl shadow-xl border border-zinc-300 hover:border-[#c9a962]/80 transition-all duration-500"
              >
                {/* Editorial Background Image */}
                <OptimizedCloudinaryImage
                  src={banner.image}
                  alt={banner.title || 'Collection banner'}
                  preset="banner"
                  quality="auto:best"
                  priority={true}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
                />

                {/* Gradient Overlays for Ambient Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                {/* Banner Content Container */}
                <div className="absolute inset-0 p-6 sm:p-8 lg:p-10 z-20 flex flex-col justify-end items-start pointer-events-none">
                  {banner.tag && (
                    <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#c9a962] font-semibold mb-2 drop-shadow-sm">
                      {banner.tag}
                    </span>
                  )}

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white uppercase tracking-[0.15em] leading-none mb-3 drop-shadow-md">
                    {banner.title}
                  </h3>

                  {banner.subtitle && (
                    <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-md mb-6 drop-shadow-sm">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] group-hover:from-white group-hover:to-white text-black px-7 py-3.5 text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] uppercase transition-all duration-300 shrink-0 shadow-lg pointer-events-auto rounded-none">
                    <span>{banner.cta || 'EXPLORE COLLECTION'}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;

