export function BrandMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.65" />
        </linearGradient>
      </defs>
      <path
        d="M15.1 3.6a1 1 0 0 1 1.8 0l10.4 22.6a1 1 0 0 1-.9 1.4h-4.1a1 1 0 0 1-.9-.6L16 13.4l-4.3 10.1a1 1 0 0 1-.9.6H5.6a1 1 0 0 1-.9-1.4Z"
        fill="url(#brandGrad)"
      />
      <circle cx="24.6" cy="24.4" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function BrandWord({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <BrandMark className="size-7 text-primary" />
      <span className="font-display text-[19px] font-extrabold tracking-tight">
        AirLeads <span className="text-primary">AI</span>
      </span>
    </span>
  );
}
