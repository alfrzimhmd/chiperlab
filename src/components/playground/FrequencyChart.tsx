import { CharFrequency } from '../../types/crypto';

interface FrequencyChartProps {
  frequencies: CharFrequency[];
  totalLetters: number;
  uniqueLetters: number;
}

export function FrequencyChart({
  frequencies,
  totalLetters,
  uniqueLetters,
}: FrequencyChartProps) {
  if (totalLetters === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        Enter ciphertext or text above to generate real-time character frequency distribution.
      </div>
    );
  }

  // Filter letters that appeared at least once, or take top 12
  const activeFrequencies = frequencies.filter(f => f.count > 0);
  const maxPercentage = Math.max(...activeFrequencies.map(f => f.percentage), 15);

  return (
    <div id="frequency-analysis-chart" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Total Alphabetic Characters: <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{totalLetters}</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Unique Letters: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{uniqueLetters} / 26</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
            Ciphertext Frequency
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
            Standard English Norm
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {activeFrequencies.map(item => {
          const cipherBarWidth = Math.min(100, (item.percentage / maxPercentage) * 100);
          const englishBarWidth = Math.min(100, (item.expectedEnglish / maxPercentage) * 100);

          return (
            <div
              key={item.char}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-xs"
            >
              <span className="w-6 font-mono font-bold text-center text-slate-900 dark:text-white shrink-0 text-sm">
                {item.char}
              </span>

              <div className="flex-1 space-y-1">
                {/* Ciphertext Actual Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-sky-500 dark:bg-sky-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${cipherBarWidth}%` }}
                    />
                  </div>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-[11px] w-14 text-right shrink-0">
                    {item.percentage}% ({item.count})
                  </span>
                </div>

                {/* English Standard Comparison Bar */}
                <div className="flex items-center gap-2 opacity-60">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-850 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-400 dark:bg-slate-600 h-full rounded-full"
                      style={{ width: `${englishBarWidth}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 w-14 text-right shrink-0">
                    Std: {item.expectedEnglish}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
