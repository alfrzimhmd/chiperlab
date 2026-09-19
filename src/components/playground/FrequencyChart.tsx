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
      <div className="p-8 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-main)] text-center text-xs text-[var(--text-secondary)]">
        Enter ciphertext or text above to generate real-time character frequency distribution.
      </div>
    );
  }

  const activeFrequencies = frequencies.filter(f => f.count > 0);
  const maxPercentage = Math.max(...activeFrequencies.map(f => f.percentage), 15);

  return (
    <div id="frequency-analysis-chart" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-[var(--text-primary)]">
            Total Alphabetic:{' '}
            <span className="text-cyan-400 font-bold">{totalLetters}</span>
          </span>
          <span className="text-[var(--border-main)]">•</span>
          <span className="font-mono text-[var(--text-primary)]">
            Unique:{' '}
            <span className="text-purple-400 font-bold">{uniqueLetters} / 26</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
            Ciphertext
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--text-secondary)]/40" />
            English Norm
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {activeFrequencies.map(item => {
          const cipherBarWidth = Math.min(100, (item.percentage / maxPercentage) * 100);
          const englishBarWidth = Math.min(100, (item.expectedEnglish / maxPercentage) * 100);

          return (
            <div
              key={item.char}
              className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center gap-3 text-xs"
            >
              <span className="w-6 font-mono font-bold text-center text-[var(--text-primary)] shrink-0 text-sm">
                {item.char}
              </span>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[var(--surface-main)] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${cipherBarWidth}%` }}
                    />
                  </div>
                  <span className="font-mono font-semibold text-[var(--text-primary)] text-[11px] w-16 text-right shrink-0">
                    {item.percentage}% ({item.count})
                  </span>
                </div>

                <div className="flex items-center gap-2 opacity-70">
                  <div className="flex-1 bg-[var(--surface-main)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[var(--text-secondary)]/40 h-full rounded-full"
                      style={{ width: `${englishBarWidth}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)] w-16 text-right shrink-0">
                    {item.expectedEnglish}%
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