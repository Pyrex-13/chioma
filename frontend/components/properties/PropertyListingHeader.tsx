interface PropertyListingHeaderProps {
  count: number;
  sortBy?: string;
  onSortChange?: (value: string) => void;
}

export function PropertyListingHeader({
  count,
  sortBy = 'Recommended',
  onSortChange,
}: PropertyListingHeaderProps) {
  return (
    <div className="mb-6">
      {/* Mobile Layout - Title and Sort on one line */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-4">
        <h1 className="text-xl font-black text-gradient tracking-tighter">
          {count} Premium Stays
        </h1>
        <select
          value={sortBy}
          onChange={(e) => onSortChange?.(e.target.value)}
          className="bg-transparent text-white font-bold text-xs cursor-pointer focus:outline-none hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400/30"
        >
          <option className="bg-slate-900">Recommended</option>
          <option className="bg-slate-900">Price: Low to High</option>
          <option className="bg-slate-900">Price: High to Low</option>
          <option className="bg-slate-900">Newest First</option>
        </select>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:flex-col sm:gap-4">
        {/* Title and Sort */}
        <div className="flex items-baseline gap-4 flex-wrap">
          <h1 className="text-3xl sm:text-5xl font-black text-gradient tracking-tighter">
            {count} Premium Stays
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-blue-200/40 text-xs font-semibold uppercase tracking-widest">
              Sorted by
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="bg-transparent text-white font-bold text-sm cursor-pointer focus:outline-none hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400/30"
            >
              <option className="bg-slate-900">Recommended</option>
              <option className="bg-slate-900">Price: Low to High</option>
              <option className="bg-slate-900">Price: High to Low</option>
              <option className="bg-slate-900">Newest First</option>
            </select>
          </div>
        </div>

        {/* Description and Badge Row */}
        <div className="flex items-start justify-between gap-4">
          <p className="text-blue-200/50 text-base sm:text-lg max-w-xl leading-relaxed">
            Discover luxury blockchain-verified properties with seamless smart
            contract leasing.
          </p>

          {/* Verified Badge - Desktop Only */}
          <div className="glass-card rounded-2xl p-4 flex gap-3 shadow-2xl relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="shrink-0 relative">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <h3 className="font-bold text-emerald-100 text-sm">
                Blockchain Verified
              </h3>
              <p className="text-emerald-200/50 text-xs max-w-xs">
                Securely vetted listings ready for instant deployment using
                on-chain smart contracts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
