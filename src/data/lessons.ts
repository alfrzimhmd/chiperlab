import { Lesson } from '../types/lesson';
import { BEGINNER_LESSONS } from './lessons/beginner';
import { INTERMEDIATE_LESSONS } from './lessons/intermediate';
import { ADVANCED_LESSONS } from './lessons/advanced';

/**
 * Combined lessons array — single source of truth for all 24 lessons.
 *
 * Data is organized by difficulty in `./lessons/` folder:
 *   - beginner.ts       (order 1-4, 12)    5 lessons
 *   - intermediate.ts   (order 5-11)       7 lessons
 *   - advanced.ts       (order 13-24)      12 lessons
 *
 * This barrel file combines them into a single sorted array.
 * All imports (`import { LESSONS } from '../data/lessons'`) work unchanged.
 */
export const LESSONS: Lesson[] = [
  ...BEGINNER_LESSONS,
  ...INTERMEDIATE_LESSONS,
  ...ADVANCED_LESSONS,
].sort((a, b) => a.order - b.order);