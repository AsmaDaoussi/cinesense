export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-black/5 bg-white">
      <div className="aspect-[2/3] w-full rounded-t-2xl bg-gray-200" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="h-6 w-24 rounded bg-gray-200" />
      </div>
    </div>
  );
}
