import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Shield, Heart, Compass, Leaf, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/Home/PageHeader';
import SEOHead from '../components/SEOHead';
import OptimizedCloudinaryImage from '../components/OptimizedCloudinaryImage';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }
};

const About = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <SEOHead
        title="Our Story & Atelier Philosophy | Mahirash"
        description="Discover the story behind Mahirash. Crafted with rare botanical extraits, unyielding luxury standards, and haute parfumerie heritage."
        url="https://mahirash.com/about"
        keywords="Mahirash story, about Mahirash, luxury perfume brand India, haute parfumerie philosophy"
      />
      <PageHeader
        title="Our Atelier Story"
        subtitle="Crafted with rare botanical extraits, designed for the olfactory connoisseur."
        breadcrumbItems={[
          { label: 'Home', path: '/' },
          { label: 'About Us' },
        ]}
      />

      {/* HERO EDITORIAL */}
      <section className="py-16 md:py-24 bg-[#f5f5f5]">
        <div className="max-w-7xl py-3 mx-auto px-5 md:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image Grid */}
            <motion.div {...fadeUp} className="grid grid-cols-12 gap-3 sm:gap-4">
              <div className="col-span-7 aspect-[3/4] overflow-hidden relative group border border-zinc-200 shadow-sm">
                <OptimizedCloudinaryImage
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop"
                  alt="Mahirash perfume artistry"
                  preset="product-grid"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
              <div className="col-span-5 aspect-[3/4] overflow-hidden mt-10 sm:mt-16 relative group border border-zinc-200 shadow-sm">
                <OptimizedCloudinaryImage
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop"
                  alt="Mahirash atelier studio"
                  preset="product-card"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-7 lg:pl-4">
              <motion.div {...fadeUp}>
                <span className="text-[10px]   tracking-[0.3em] uppercase text-zinc-500 block mb-4">Our Philosophy</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-zinc-900 leading-[1.1] tracking-widest uppercase">
                  Perfumery That<br />Captivates The Senses
                </h2>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="space-y-4 text-[14px] sm:text-[15px] text-zinc-600 leading-relaxed"
              >
                <p>At Mahirash, we believe a fragrance is more than a scent — it's an invisible aura, an unforgettable identity. Every formulation is meticulously macerated to bridge the gap between ancient oriental agarwoods and modern Parisian haute parfumerie.</p>
                <p>We source pure extraits, rare Damask roses, and aged Assam agarwood directly from ethical botanical reserves, ensuring every drop radiates luxury.</p>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="grid grid-cols-2 gap-6 py-7 border-y border-zinc-200"
              >
                <div>
                  <span className="text-4xl font-light text-zinc-900 tracking-widest">30%</span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500   mt-1">Pure Extrait Oils</p>
                </div>
                <div>
                  <span className="text-4xl font-light text-zinc-900 tracking-widest">14+ Hrs</span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500   mt-1">Intense Sillage</p>
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                <Link to="/shop" className="inline-flex items-center gap-3 group">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-black text-zinc-700 group-hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-black/40">
                    Explore Fragrance Vault
                  </span>
                  <div className="w-9 h-9 rounded-full border border-zinc-300 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-400">
                    <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white transition-colors duration-400" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="max-w-7xl py-3 mx-auto px-5 md:px-10 lg:px-14">
          <div className="pb-10 border-b border-zinc-200 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500   block mb-3">What Defines Us</span>
            <h2 className="text-3xl md:text-4xl font-light text-zinc-900 uppercase tracking-widest">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: Gem, title: 'Artisanal Extraits', desc: 'Crafted with 25-35% high-concentration pure perfume oils for extraordinary longevity.' },
              { icon: Leaf, title: 'Sustainably Sourced', desc: 'Ethical harvesting of rare botanical florals, spices, and aged agarwoods.' },
              { icon: Heart, title: 'Hand-Macerated', desc: 'Formulated in limited small batches to preserve the raw magnificence of every note.' },
              { icon: Compass, title: 'Timeless Presence', desc: 'Designed beyond transient trends to create signature olfactory identities.' }
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="group bg-white border border-zinc-200 p-6 sm:p-7 hover:border-black/30 transition-all duration-400 shadow-sm"
                >
                  <div className="w-10 h-10 border border-zinc-300 flex items-center justify-center text-zinc-600 mb-5 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-400">
                    <Icon size={17} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-zinc-900 uppercase tracking-wide mb-2">{pillar.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL WIDTH BANNER */}
      <section className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <OptimizedCloudinaryImage
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2000&auto=format&fit=crop"
          alt="Mahirash atelier"
          preset="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/70 text-[10px] uppercase tracking-[0.4em]   mb-4">Our Atelier Promise</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white max-w-2xl leading-[1.1] tracking-widest uppercase">
              Formulated for Distinction.<br />Crafted for Eternity.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 md:py-24 bg-[#f5f5f5]">
        <div className="max-w-4xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="pb-10 border-b border-zinc-200 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500   block mb-3">Our Journey</span>
            <h2 className="text-3xl font-light text-zinc-900 uppercase tracking-widest">Milestones of Mahirash</h2>
          </div>
          <div className="space-y-0">
            {[
              { year: '2024', title: 'The Atelier Inception', desc: 'Mahirash was established to bring high-concentration luxury extraits and rare agarwoods to fragrance lovers.' },
              { year: '2024', title: 'The Royal Oud Debut', desc: 'Unveiled our signature Royal Oud Extrait, selling out our inaugural batch within days.' },
              { year: '2025', title: 'Private Reserve Collection', desc: 'Expanded into artisanal discovery vaults and exclusive oriental amber accords.' },
              { year: '2025', title: 'Global Recognition', desc: 'Established Mahirash as a hallmark of luxury, craftsmanship, and long-lasting sillage.' },
            ].map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-6 sm:gap-10 group py-7 border-b border-zinc-200 last:border-0"
              >
                <div className="shrink-0 pt-1">
                  <span className="text-[10px] font-black tracking-widest text-zinc-500 border border-zinc-300 px-2.5 py-1 bg-white">
                    {milestone.year}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] sm:text-base   text-zinc-900 mb-1 group-hover:text-[#b8860b] transition-colors">{milestone.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
