import { DAY_KEYS, DAY_LABELS, type WeekHours } from '../lib/hours';

interface Props { value: WeekHours; onChange: (w: WeekHours) => void; }

/** Per-day opening hours editor with open/close time pickers + closed toggle. */
export function OpeningHoursEditor({ value, onChange }: Props) {
  const set = (d: typeof DAY_KEYS[number], patch: Partial<WeekHours[typeof d]>) =>
    onChange({ ...value, [d]: { ...value[d], ...patch } });

  return (
    <div className="space-y-2">
      {DAY_KEYS.map((d) => {
        const day = value[d];
        return (
          <div key={d} className="flex items-center gap-3">
            <span className="w-24 text-sm font-medium text-slate-700">{DAY_LABELS[d]}</span>
            {day.closed ? (
              <span className="flex-1 text-sm text-slate-400">Closed</span>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <input type="time" value={day.open} onChange={(e) => set(d, { open: e.target.value })}
                  className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
                <span className="text-slate-400 text-sm">–</span>
                <input type="time" value={day.close} onChange={(e) => set(d, { close: e.target.value })}
                  className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6200FF]" />
              </div>
            )}
            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer shrink-0">
              <input type="checkbox" checked={day.closed} onChange={(e) => set(d, { closed: e.target.checked })} className="accent-[#6200FF]" />
              Closed
            </label>
          </div>
        );
      })}
    </div>
  );
}
