export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl sm:rounded-[26px] border border-slate-200 bg-white p-3.5 sm:p-5 animate-pulse space-y-3 sm:space-y-4 shadow-2xs"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100" />
              <div className="space-y-1.5">
                <div className="w-16 sm:w-24 h-3 rounded-full bg-slate-100" />
                <div className="w-20 sm:w-28 h-4 rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100" />
          </div>

          <div className="w-24 sm:w-32 h-3 rounded-md bg-slate-100" />

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="w-12 h-3 rounded-full bg-slate-100" />
            <div className="w-14 sm:w-16 h-6 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
