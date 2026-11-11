function ProductSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-20 rounded-full bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-16 rounded bg-slate-200" />
          <div className="h-4 w-10 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
