import React from 'react';
import { ProgressTrack, ProgressFill } from './InitProcessStyles';

export default function ProgressBar({ value = 0, start, end }) {
  const hasRange = typeof start === 'number' && typeof end === 'number';
  const s = hasRange ? Math.max(0, Math.min(100, start)) : 0;
  const e = hasRange ? Math.max(0, Math.min(100, end)) : Math.max(0, Math.min(100, value));
  const fill = hasRange ? Math.max(0, e - s) : e;

  return (
    <div>
      <ProgressTrack>
        <ProgressFill $start={s} $width={fill} />
      </ProgressTrack>
    </div>
  );
}
