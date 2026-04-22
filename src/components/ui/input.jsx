export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none ${className}`}
      {...props}
    />
  );
}