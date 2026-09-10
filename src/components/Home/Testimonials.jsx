import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { db } from '../../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Star, Award, MessageSquare, RefreshCw, Quote, CheckCircle2 } from 'lucide-react';
import { Autoplay, Mousewheel, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const IconMap = {
  Star: Star,
  Award: Award,
  MessageSquare: MessageSquare,
  RefreshCw: RefreshCw
};

const DEFAULT_COMMUNITY_SETTINGS = {
  eyebrow: 'WORDS FROM CONNOISSEURS',
  heading: 'THE MAHIRASH EXPERIENCE',
  description_line_1: 'Real patrons. Authentic sillage. Verified reviews.',
  description_line_2: 'See why connoisseurs choose Mahirash Parfumerie.',
  is_active: true
};

const DEFAULT_TEXT_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Devendra R.',
    location: 'Mumbai',
    rating: 5,
    fragrance: 'Oud Noir Extrait (50ml)',
    title: 'Unrivaled Sillage & Longevity',
    review: 'Mahirash Oud Noir is absolute royalty. Just two sprays on my pulse points lasted over 18 hours. The depth of genuine Cambodian oud combined with warm amber gathers compliments wherever I go.',
    status: 'Verified Patron',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'rev_2',
    name: 'Ananya M.',
    location: 'New Delhi',
    rating: 5,
    fragrance: 'Royal Rose & Oud (50ml)',
    title: 'Haute Perfumerie at its Finest',
    review: 'The blend of Damask rose and dark resinous oud is intoxicatingly opulent. The packaging feels like opening a bespoke jewel box. I am officially a patron for life.',
    status: 'Verified Patron',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'rev_3',
    name: 'Vikram S.',
    location: 'Bengaluru',
    rating: 5,
    fragrance: 'Imperial Amber Extrait (50ml)',
    title: 'Extremely Rich & Sophisticated',
    review: 'Warm, rich, and deeply comforting amber with spicy accords. It evolves beautifully throughout the evening. The pre-order arrived right on time with flawless packaging.',
    status: 'Verified Patron',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'rev_4',
    name: 'Farhan H.',
    location: 'Dubai, UAE',
    rating: 5,
    fragrance: 'Golden Sandalwood (100ml)',
    title: 'True Artisanal Extraits',
    review: 'As an avid collector of niche perfumerie, Mahirash rivals top Parisian perfume houses. Creamy mysore sandalwood with delicate botanical notes. Extraordinary formulation.',
    status: 'Verified Patron',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'rev_5',
    name: 'Priya K.',
    location: 'Hyderabad',
    rating: 5,
    fragrance: 'Velvet Musk & Spice (50ml)',
    title: 'Magnetizing Fragrance',
    review: 'Subtle yet lingering presence that lasts all day without being overwhelming. Everyone at my workplace asked what scent I was wearing. Truly high concentration extraits.',
    status: 'Verified Patron',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'rev_6',
    name: 'Karan V.',
    location: 'Pune',
    rating: 5,
    fragrance: 'Midnight Vanilla Extrait (50ml)',
    title: 'Sensual & Long-Lasting',
    review: 'Smoky, dark vanilla with subtle wood accents. Far superior to standard luxury EDPs. The sillage projection is immaculate and the gold detail on the bottle is pure luxury.',
    status: 'Verified Patron',
    sort_order: 6,
    is_active: true
  }
];

const DEFAULT_COMMUNITY_STATS = [
  { id: 'stat_1', icon: 'Star', value: '15,000+', label: 'Fragrance Connoisseurs', sort_order: 1, is_active: true },
  { id: 'stat_2', icon: 'Award', value: '4.9/5', label: 'Avg Sillage Rating', sort_order: 2, is_active: true },
  { id: 'stat_3', icon: 'MessageSquare', value: '2,500+', label: 'Verified Reviews', sort_order: 3, is_active: true },
  { id: 'stat_4', icon: 'RefreshCw', value: '98%', label: 'Recommend Us', sort_order: 4, is_active: true }
];

const Testimonials = () => {
  const [settings, setSettings] = useState(DEFAULT_COMMUNITY_SETTINGS);
  const [reviews, setReviews] = useState(DEFAULT_TEXT_REVIEWS);
  const [stats, setStats] = useState(DEFAULT_COMMUNITY_STATS);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // 1. Settings
        const settingsDoc = await getDocs(collection(db, 'community_settings'));
        if (!settingsDoc.empty) {
          setSettings(settingsDoc.docs[0]?.data() || DEFAULT_COMMUNITY_SETTINGS);
        }

        // 2. Text Reviews
        const revQuery = query(collection(db, 'testimonials'));
        const revSnap = await getDocs(revQuery);
        if (!revSnap.empty) {
          const list = revSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(item => item.is_active !== false);
          list.sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
          setReviews(list.length > 0 ? list : DEFAULT_TEXT_REVIEWS);
        } else {
          setReviews(DEFAULT_TEXT_REVIEWS);
        }

        // 3. Stats
        const statsQuery = query(collection(db, 'community_stats'), orderBy('sort_order', 'asc'));
        const statsSnap = await getDocs(statsQuery);
        if (!statsSnap.empty) {
          const list = statsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(item => item.is_active !== false);
          setStats(list.length > 0 ? list : DEFAULT_COMMUNITY_STATS);
        }
      } catch (err) {
        console.warn("Using default testimonials fallback:", err);
        setSettings(DEFAULT_COMMUNITY_SETTINGS);
        setReviews(DEFAULT_TEXT_REVIEWS);
        setStats(DEFAULT_COMMUNITY_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, []);

  if (loading || !settings.is_active) return null;

  return (
    <section className="py-12 md:py-20 bg-[#f5f5f5] overflow-hidden relative border-t border-zinc-200">
      {/* Luxury Ambient Radial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,98,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1 flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#b8860b] uppercase mb-2 font-semibold flex items-center gap-2">
                <Quote size={13} className="text-[#b8860b]" />
                {settings.eyebrow}
              </p>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extralight tracking-[0.15em] text-zinc-900 uppercase whitespace-nowrap">
                {settings.heading}
              </h2>
            </div>
            <div className="hidden md:block flex-1 h-[1px] bg-zinc-200 mb-3" />
          </div>

          <div className="flex items-center gap-6 self-start md:self-auto">
            <div className="flex gap-2.5">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous review"
                className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 cursor-pointer shadow-sm"
              >
                &larr;
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next review"
                className="w-10 h-10 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-600 hover:text-white hover:bg-[#b8860b] hover:border-[#b8860b] transition-all duration-300 cursor-pointer shadow-sm"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Written Review Swiper Slider */}
        <div className="w-full mb-14 testimonials-swiper">
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            spaceBetween={20}
            slidesPerView={1}
            speed={800}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            modules={[Autoplay, Mousewheel, Pagination]}
            className="w-full overflow-visible py-2"
          >
            {reviews.map((item) => (
              <SwiperSlide key={item.id} className="h-full">
                <div className="relative h-full flex flex-col justify-between bg-white border border-zinc-200 p-6 sm:p-8 transition-all duration-500 hover:border-[#c9a962]/80 hover:shadow-[0_15px_35px_rgba(184,134,11,0.12)] group">
                  {/* Decorative Gold Top Accent Line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a962]/60 to-transparent group-hover:via-[#c9a962] transition-colors duration-500" />

                  {/* Top Content: Stars & Fragrance Tag */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      {/* 5 Gold Stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating || 5)].map((_, idx) => (
                          <Star key={idx} size={14} fill="#b8860b" stroke="#b8860b" />
                        ))}
                      </div>

                      {/* Verified Badge */}
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] font-bold text-[#b8860b] bg-[#fcf8f0] border border-[#c9a962]/30 px-2 py-0.5">
                        <CheckCircle2 size={11} className="text-[#b8860b]" />
                        {item.status || 'Verified Patron'}
                      </span>
                    </div>

                    {/* Fragrance Tag */}
                    {item.fragrance && (
                      <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-zinc-500 block mb-3">
                        {item.fragrance}
                      </span>
                    )}

                    {/* Review Title */}
                    {item.title && (
                      <h4 className="text-base sm:text-lg font-medium text-zinc-900 tracking-wide mb-3 leading-snug">
                        "{item.title}"
                      </h4>
                    )}

                    {/* Review Body */}
                    <p className="text-zinc-600 text-xs sm:text-sm font-light leading-relaxed mb-6 italic">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Bottom Content: Author & Location */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between mt-auto">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-900">
                        {item.name}
                      </h5>
                      {item.location && (
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-light">
                          {item.location}
                        </span>
                      )}
                    </div>
                    <Quote size={22} className="text-[#c9a962]/20 group-hover:text-[#c9a962]/40 transition-colors" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Social Proof Statistics Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-zinc-200">
          {stats.map((st) => {
            const Icon = IconMap[st.icon] || Star;
            return (
              <div key={st.id} className="bg-white border border-zinc-200 p-5 text-center flex flex-col items-center justify-center hover:border-[#c9a962]/60 transition-colors duration-300 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#fcf8f0] border border-[#c9a962]/30 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#b8860b]" />
                </div>
                <span className="text-xl sm:text-2xl font-light tracking-wide text-zinc-900 uppercase leading-none mb-1">
                  {st.value}
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
export { Testimonials as TestimonialsSection };
