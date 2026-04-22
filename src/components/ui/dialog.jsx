export function Dialog({ open, children }) {
  return <>{children}</>;
}

export function DialogTrigger({ children }) {
  return <>{children}</>;
}

export function DialogContent({ className = "", children }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div>{children}</div>;
}

export function DialogTitle({ className = "", children }) {
  return <h2 className={className}>{children}</h2>;
}