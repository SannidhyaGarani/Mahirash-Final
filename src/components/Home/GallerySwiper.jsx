import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Mousewheel } from 'swiper/modules';
import { db } from '../Firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Eye } from 'lucide-react';
import SectionHeader from './SectionHeader';
import OptimizedCloudinaryImage from '../OptimizedCloudinaryImage';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const GallerySwiper = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(8));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(fetched);
      } catch (err) {
        console.error("Error loading gallery products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#f7f5f0] border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="flex flex-col items-center mb-8">
            <div className="h-3 w-32 bg-zinc-300 animate-pulse mb-3" />
            <div className="h-8 w-64 bg-zinc-300 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-6 overflow-hidden py-4">
            <div className="w-[220px] sm:w-[280px] h-[320px] sm:h-[400px] bg-zinc-200 animate-pulse shrink-0 opacity-40 scale-90" />
            <div className="w-[260px] sm:w-[340px] h-[380px] sm:h-[480px] bg-zinc-300 animate-pulse shrink-0 shadow-2xl" />
            <div className="w-[220px] sm:w-[280px] h-[320px] sm:h-[400px] bg-zinc-200 animate-pulse shrink-0 opacity-40 scale-90" />
          </div>
        </div>
      </section>
    );
  }

  const slides = products.length > 0
    ? products.map(p => ({
      id: p.id,
      image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800',
      brand: p.brand || 'MAHIRASH',
      title: p.name,
      subtitle: p.category || 'EXTRAIT DE PARFUM',
      price: p.price,
      isProduct: true
    }))
    : [];

  const currentSlide = slides[activeIndex] || {};
  const formattedIndex = (activeIndex + 1).toString().padStart(2, '0');
  const formattedTotal = slides.length.toString().padStart(2, '0');

  return (
    <section className="py-12 md:py-20 bg-[#f7f5f0] overflow-x-hidden relative border-t border-zinc-200/80 font-['Inter',sans-serif]">
      {/* Opulent Luxury Radial Backdrop Glow & Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-serif text-black/[0.015] tracking-[0.25em] uppercase select-none pointer-events-none whitespace-nowrap">
        MAHIRASH
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14 relative z-10">

        <SectionHeader
          subtitle="HAUTE PARFUMERIE SHOWCASE"
          title="RECENT ARRIVALS & ATELIER EDITIONS"
        />

        {/* Swiper Container */}
        <div className="relative w-full py-6 gallery-swiper-luxury overflow-x-hidden">
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={slides.length > 3}
            speed={1000}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
            }}
            autoplay={{
              delay: 3800,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: -30,
              depth: 300,
              modifier: 1,
              slideShadows: false,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            modules={[EffectCoverflow, Autoplay, Mousewheel]}
            className="w-full overflow-visible"
          >
            {slides.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <SwiperSlide
                  key={idx}
                  onClick={() => slide.isProduct && navigate(`/product/${slide.id}`)}
                  className="relative overflow-hidden bg-white border border-zinc-300/80 shadow-xl cursor-pointer group transition-all duration-700"
                >
                  {/* Glassmorphic Brand Tag Top Pill */}
                  <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border border-[#c9a962]/40 px-3 py-1 text-white text-[9px] uppercase tracking-[0.25em] font-extrabold shadow-md">
                    {slide.brand}
                  </div>

                  {/* Image */}
                  <OptimizedCloudinaryImage
                    src={slide.image}
                    alt={slide.title}
                    preset="product-grid"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-108"
                  />

                  {/* Dark Vignette Wash */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10 transition-opacity duration-500 opacity-90 group-hover:opacity-100" />

                  {/* Golden Frame Accent Line */}
                  <div className="absolute inset-2 border border-[#c9a962]/0 group-hover:border-[#c9a962]/70 transition-colors duration-500 z-20 pointer-events-none" />

                  {/* Corner Gold Leaf Accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c9a962] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c9a962] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Quick Action Indicator */}
                  <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-white text-[10px] font-extrabold uppercase tracking-[0.25em] flex items-center gap-1.5 drop-shadow">
                      <Eye size={13} className="text-[#c9a962]" /> View Scent
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#b8860b] text-white flex items-center justify-center text-xs shadow-md">
                      &rarr;
                    </span>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Dynamic centered slide content below swiper (Original layout restored) */}
        <div className="mt-8 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] font-semibold text-[#b8860b] mb-2">
            <span className="text-zinc-600 font-bold">{currentSlide.brand || 'MAHIRASH'}</span>
            {currentSlide.subtitle && <span>• {currentSlide.subtitle}</span>}
          </div>

          <div className="flex items-center justify-center gap-6 max-w-2xl w-full">
            {/* Left Scroller Button */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-full border border-zinc-300 bg-white text-zinc-700 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm"
            >
              <span className="text-sm select-none">&larr;</span>
            </button>

            {/* Slide Title */}
            <h4
              onClick={() => currentSlide.isProduct && navigate(`/product/${currentSlide.id}`)}
              className="text-base sm:text-lg font-light text-zinc-900 tracking-[0.15em] uppercase leading-snug line-clamp-1 flex-1 cursor-pointer hover:text-[#b8860b] transition-colors"
            >
              {currentSlide.title || 'Loading...'}
            </h4>

            {/* Right Scroller Button */}
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="w-9 h-9 rounded-full border border-zinc-300 bg-white text-zinc-700 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm"
            >
              <span className="text-sm select-none">&rarr;</span>
            </button>
          </div>

          {currentSlide.price !== undefined && currentSlide.price !== null && (
            <span className="text-[14px] font-semibold text-[#e53e3e] tracking-widest mt-2 block font-mono">
              INR {Number(currentSlide.price).toLocaleString("en-IN")}.00
            </span>
          )}
        </div>

      </div>

      {/* Styled overrides for coverflow 3D slider */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .gallery-swiper-luxury .swiper {
            overflow: visible !important;
          }
          .gallery-swiper-luxury .swiper-slide {
            width: 250px;
            height: 360px;
            opacity: 0.75;
            filter: brightness(0.85);
            transform: scale(0.88);
            transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          }
          @media (min-width: 640px) {
            .gallery-swiper-luxury .swiper-slide {
              width: 330px;
              height: 460px;
            }
          }
          @media (min-width: 1024px) {
            .gallery-swiper-luxury .swiper-slide {
              width: 350px;
              height: 490px;
            }
          }
          .gallery-swiper-luxury .swiper-slide-active {
            opacity: 1;
            filter: brightness(1);
            transform: scale(1.04);
            border-color: rgba(201, 169, 98, 0.9) !important;
            box-shadow: 0 25px 50px -12px rgba(184, 134, 11, 0.3), 0 0 20px rgba(201, 169, 98, 0.2);
            z-index: 10;
          }
        `
      }} />
    </section>
  );
};

export default GallerySwiper;

