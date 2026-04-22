export function Select({ children }) {
  return <div>{children}</div>;
}

export function SelectTrigger({ className = "", children }) {
  return <div className={`border border-slate-300 px-3 py-2 ${className}`}>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div className="border border-slate-200 bg-white">{children}</div>;
}

export function SelectItem({ children }) {
  return <div className="px-3 py-2">{children}</div>;
}