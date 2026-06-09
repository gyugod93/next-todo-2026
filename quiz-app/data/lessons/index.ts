import { aiToolsLessons } from './ai-tools'
import { csBasicsLessons } from './cs-basics'
import { designPatternLessons } from './design-patterns'
import { debuggingLessons } from './debugging'
import { realworldLessons } from './realworld'
import { authSecurityLessons } from './auth-security'
import { authAdvancedLessons } from './auth-advanced'
import type { Lesson, LessonCategory } from '@/types'

export const allLessons: Lesson[] = [
  ...aiToolsLessons,
  ...csBasicsLessons,
  ...designPatternLessons,
  ...debuggingLessons,
  ...realworldLessons,
  ...authSecurityLessons,
  ...authAdvancedLessons,
]

export const lessonsByCategory: Record<LessonCategory, Lesson[]> = {
  'ai-tools': aiToolsLessons,
  'cs-basics': csBasicsLessons,
  'design-patterns': designPatternLessons,
  debugging: debuggingLessons,
  realworld: realworldLessons,
  'auth-security': authSecurityLessons,
  'auth-advanced': authAdvancedLessons,
}

export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id)
}

export function getLessonsByCategory(category: LessonCategory): Lesson[] {
  return lessonsByCategory[category] ?? []
}

export { aiToolsLessons, csBasicsLessons, designPatternLessons, debuggingLessons, realworldLessons, authSecurityLessons, authAdvancedLessons }
