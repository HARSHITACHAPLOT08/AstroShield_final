export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[linear-gradient(90deg,rgba(15,23,42,0.75)_25%,rgba(34,211,238,0.12)_50%,rgba(15,23,42,0.75)_75%)] bg-[length:200%_100%] ${className}`}
    />
  );
}
