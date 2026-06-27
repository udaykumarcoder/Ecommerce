import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';

export function DubaiNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('saif-electronics-dubai-notice')) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-50 mx-auto max-w-xl rounded-lg border border-amber-200 bg-white p-4 shadow-2xl dark:border-amber-700 dark:bg-slate-950">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200">
          <MapPin size={20} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-950 dark:text-white">Dubai orders only</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Welcome to SaifElectronics. We currently take and deliver orders only in Dubai.
          </p>
        </div>
        <button
          aria-label="Close Dubai orders notice"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          onClick={() => {
            localStorage.setItem('saif-electronics-dubai-notice', 'seen');
            setVisible(false);
          }}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
