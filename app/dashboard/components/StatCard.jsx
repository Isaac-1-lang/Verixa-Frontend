
export default function StatCard({ title, value, growth }) {
  return (
    <div className="bg-slate-50/80 rounded-xl p-6 space-y-3">
      <p className="text-base text-slate-600 font-medium">
        {title}
      </p>

      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold text-slate-900">
          {value}
        </h2>
        <span className="text-sm font-semibold text-green-600">
          {growth}
        </span>
      </div>
    </div>
  );
}
