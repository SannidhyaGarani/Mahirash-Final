import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp, RotateCcw, Filter, Check, Star } from "lucide-react";

export const DEFAULT_CATEGORIES = [
  "All",
  "Extrait de Parfum",
  "Eau de Parfum",
  "Eau de Toilette",
  "Oud Collection",
  "Woody & Amber",
  "Floral & Fresh",
  "Gift Sets"
];

export const DEFAULT_GENDERS = ["All", "Unisex", "Men", "Women"];

export const DEFAULT_SIZES = ["50ml", "100ml", "200ml", "Sample Set"];

export const COLOR_MAP = {
  oud: "#3b2314",
  woody: "#5c4033",
  amber: "#d9a036",
  floral: "#e879f9",
  citrus: "#facc15",
  vanilla: "#fef08a",
  leather: "#27150c",
  spice: "#991b1b",
  black: "#000000",
  white: "#ffffff",
  gold: "#c9a962"
};

const FilterSection = ({ title, children, defaultOpen = true, activeCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-200 py-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group cursor-pointer py-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]   uppercase tracking-[0.18em] text-zinc-900 group-hover:text-black transition-colors">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#b8860b] text-white shop-sidebar-badge flex items-center justify-center font-extrabold shrink-0">
              {activeCount}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={14} className="text-zinc-400 group-hover:text-black transition-colors shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-zinc-400 group-hover:text-black transition-colors shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopFilterSidebar = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  resetFilters,
  totalResults,
  allCategories = DEFAULT_CATEGORIES,
  availableBrands = [],
  availableColors = [],
  availableSizes = DEFAULT_SIZES,
  availableMaterials = [],
  maxPriceLimit = 25000
}) => {
  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.brand && filters.brand !== "All") count++;
    if (filters.category && filters.category !== "All") count++;
    if (filters.gender && filters.gender !== "All") count++;
    if (filters.maxPrice < maxPriceLimit || filters.minPrice > 0) count++;
    if (filters.colors && filters.colors.length > 0) count += filters.colors.length;
    if (filters.sizes && filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.inStockOnly) count++;
    if (filters.onSaleOnly) count++;
    if (filters.minRating > 0) count++;
    if (filters.materials && filters.materials.length > 0) count += filters.materials.length;
    return count;
  };

  const activeCount = getActiveFilterCount();

  const toggleArrayFilter = (field, item) => {
    const current = filters[field] || [];
    if (current.includes(item)) {
      setFilters(prev => ({ ...prev, [field]: current.filter(x => x !== item) }));
    } else {
      setFilters(prev => ({ ...prev, [field]: [...current, item] }));
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full space-y-2 text-zinc-900">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-[#b8860b]" />
            <h2 className="text-[14px]   uppercase tracking-[0.2em] text-zinc-900">
              Refine By
            </h2>
          </div>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 hover:text-[#b8860b] transition-colors"
            >
              <RotateCcw size={11} />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {activeCount > 0 && (
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b8860b] shop-sidebar-badge">
              {activeCount} Filter{activeCount > 1 ? "s" : ""} Active
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[9px]   uppercase tracking-wider text-zinc-500 hover:text-black"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter Sections Scroll Container */}
      <div className="flex-1 overflow-y-auto pr-1 text-[14px] scrollbar-hide space-y-1">

        {/* Brand Filter */}
        {availableBrands && availableBrands.length > 0 && (
          <FilterSection
            title="Perfume Brands"
            defaultOpen={true}
            activeCount={filters.brand && filters.brand !== "All" ? 1 : 0}
          >
            <div className="space-y-1">
              {["All", ...availableBrands].map(b => {
                const isSelected = (filters.brand || "All") === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, brand: b }))}
                    className={`w-full flex items-center justify-between py-2 px-3 text-left uppercase transition-all rounded-sm ${isSelected
                      ? "bg-zinc-100 text-zinc-900 border-l-2 border-[#b8860b]"
                      : "text-zinc-600 hover:text-black hover:bg-zinc-50"
                      }`}
                  >
                    <span className="shop-sidebar-label">{b}</span>
                    {isSelected && <Check size={13} className="text-[#b8860b] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Category Filter */}
        <FilterSection
          title="Categories"
          defaultOpen={true}
          activeCount={filters.category !== "All" ? 1 : 0}
        >
          <div className="space-y-1">
            {allCategories.map(cat => {
              const isSelected = filters.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                  className={`w-full flex items-center justify-between py-2 px-3 text-left uppercase transition-all rounded-sm ${isSelected
                    ? "bg-zinc-100 text-zinc-900   border-l-2 border-[#b8860b]"
                    : "text-zinc-600 hover:text-black hover:bg-zinc-50"
                    }`}
                >
                  <span className="shop-sidebar-label">{cat}</span>
                  {isSelected && <Check size={13} className="text-[#b8860b] shrink-0" />}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Gender / Target Filter */}
        <FilterSection
          title="Audience"
          defaultOpen={true}
          activeCount={filters.gender !== "All" ? 1 : 0}
        >
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_GENDERS.map(g => {
              const isSelected = filters.gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, gender: g }))}
                  className={`py-2 px-2 text-center border uppercase transition-all ${isSelected
                    ? "bg-black text-white border-black  "
                    : "bg-white text-zinc-600 border-zinc-300 hover:border-black hover:text-black"
                    }`}
                >
                  <span className="shop-sidebar-label">{g}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Price Slider & Presets */}
        <FilterSection
          title="Price Range"
          defaultOpen={true}
          activeCount={filters.maxPrice < maxPriceLimit || filters.minPrice > 0 ? 1 : 0}
        >
          <div className="space-y-3.5">
            {/* Price values readout */}
            <div className="flex items-center justify-between text-[14px] font-mono text-zinc-700">
              <span>₹{filters.minPrice?.toLocaleString("en-IN")}</span>
              <span className="text-[#b8860b]  ">₹{filters.maxPrice?.toLocaleString("en-IN")}</span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={maxPriceLimit}
                step={500}
                value={filters.maxPrice || maxPriceLimit}
                onChange={e =>
                  setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#b8860b]"
              />
            </div>

            {/* Price Presets */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { label: "Under ₹2,500", max: 2500, min: 0 },
                { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
                { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
                { label: "Above ₹10,000", min: 10000, max: maxPriceLimit }
              ].map(preset => {
                const isSelected =
                  filters.minPrice === preset.min && filters.maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setFilters(prev => ({
                        ...prev,
                        minPrice: preset.min,
                        maxPrice: preset.max
                      }))
                    }
                    className={`py-2 px-2 border text-center uppercase transition-all rounded-sm flex items-center justify-center ${isSelected
                      ? "border-[#b8860b] bg-[#b8860b]/10 text-[#b8860b]  "
                      : "border-zinc-300 text-zinc-600 hover:border-black hover:text-black"
                      }`}
                  >
                    <span className="shop-sidebar-preset-btn">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </FilterSection>

        {/* Volume Filter (formerly Sizes) */}
        <FilterSection
          title="Volume Options"
          defaultOpen={true}
          activeCount={filters.sizes?.length || 0}
        >
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(sz => {
              const isSelected = filters.sizes?.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleArrayFilter("sizes", sz)}
                  className={`px-3 py-2 text-xs flex items-center justify-center border uppercase transition-all font-semibold ${isSelected
                    ? "bg-black text-white border-black shadow"
                    : "bg-white text-zinc-600 border-zinc-300 hover:border-black hover:text-black"
                    }`}
                >
                  <span className="shop-sidebar-label">{sz}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Fragrance Profile & Notes Filter (formerly Colors) */}
        {availableColors.length > 0 && (
          <FilterSection
            title="Fragrance Accords"
            defaultOpen={true}
            activeCount={filters.colors?.length || 0}
          >
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map(colorName => {
                const isSelected = filters.colors?.includes(colorName);

                return (
                  <button
                    key={colorName}
                    type="button"
                    onClick={() => toggleArrayFilter("colors", colorName)}
                    className={`px-2.5 py-1 text-xs border uppercase tracking-wider transition-all rounded-sm ${isSelected
                      ? "bg-[#b8860b] text-white border-[#b8860b] font-bold shadow"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-black hover:text-black"
                      }`}
                  >
                    {colorName}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Concentration Filter (formerly Material) */}
        {availableMaterials.length > 0 && (
          <FilterSection
            title="Concentration"
            defaultOpen={false}
            activeCount={filters.materials?.length || 0}
          >
            <div className="space-y-1.5">
              {availableMaterials.map(mat => {
                const isSelected = filters.materials?.includes(mat);
                return (
                  <label
                    key={mat}
                    className="flex items-center gap-2.5 text-zinc-600 hover:text-black cursor-pointer py-1 uppercase tracking-wider text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleArrayFilter("materials", mat)}
                      className="w-3.5 h-3.5 accent-[#b8860b] bg-white border-zinc-300 rounded-sm"
                    />
                    <span className="shop-sidebar-label">{mat}</span>
                  </label>
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Availability & Offers */}
        <FilterSection
          title="Availability & Offers"
          defaultOpen={false}
          activeCount={(filters.inStockOnly ? 1 : 0) + (filters.onSaleOnly ? 1 : 0)}
        >
          <div className="space-y-2">
            <label className="flex items-center justify-between text-zinc-600 uppercase tracking-wider cursor-pointer hover:text-black py-1">
              <span className="shop-sidebar-label">In Stock Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={e =>
                  setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))
                }
                className="w-4 h-4 accent-[#b8860b] bg-white border-zinc-300"
              />
            </label>

            <label className="flex items-center justify-between text-zinc-600 uppercase tracking-wider cursor-pointer hover:text-black py-1">
              <span className="shop-sidebar-label">On Sale / Discounted</span>
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={e =>
                  setFilters(prev => ({ ...prev, onSaleOnly: e.target.checked }))
                }
                className="w-4 h-4 accent-[#b8860b] bg-white border-zinc-300"
              />
            </label>
          </div>
        </FilterSection>

        {/* Minimum Rating */}
        <FilterSection
          title="Rating"
          defaultOpen={false}
          activeCount={filters.minRating > 0 ? 1 : 0}
        >
          <div className="space-y-1">
            {[4.5, 4.0, 3.5].map(stars => {
              const isSelected = filters.minRating === stars;
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() =>
                    setFilters(prev => ({
                      ...prev,
                      minRating: isSelected ? 0 : stars
                    }))
                  }
                  className={`w-full flex items-center justify-between py-2 px-3 uppercase transition-colors rounded-sm ${isSelected
                    ? "bg-zinc-100 text-zinc-900  "
                    : "text-zinc-600 hover:text-black hover:bg-zinc-50"
                    }`}
                >
                  <div className="flex items-center gap-1.5 text-[#b8860b]">
                    <Star size={12} fill="currentColor" />
                    <span className="shop-sidebar-label">{stars} & Above</span>
                  </div>
                  {isSelected && <Check size={13} className="text-[#b8860b] shrink-0" />}
                </button>
              );
            })}
          </div>
        </FilterSection>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block w-full sticky top-28 space-y-6">
        {sidebarContent}
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-[#f5f5f5] border-r border-zinc-200 h-full p-6 flex flex-col justify-between shadow-2xl z-10 text-zinc-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="text-[14px]   uppercase tracking-[0.2em] text-[#b8860b]">
                  Filter Products
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-zinc-400 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              {sidebarContent}

              {/* Mobile Drawer Bottom Actions */}
              <div className="pt-4 border-t border-zinc-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    onClose();
                  }}
                  className="w-1/3 py-3 border border-zinc-300 text-[10px]   uppercase tracking-widest text-zinc-600 hover:text-black"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-2/3 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                >
                  Show ({totalResults})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShopFilterSidebar;
