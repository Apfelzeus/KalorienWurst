export function Button({ className = "", variant = "default", size = "default", children, ...props }) {
  const base = "inline-flex items-center justify-center border text-sm font-medium transition";
  const variants = {
    default: "bg-slate-900 text-white border-slate-900 hover:bg-slate-800",
    outline: "bg-white text-slate-900 border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-900 border-transparent hover:bg-slate-100",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}