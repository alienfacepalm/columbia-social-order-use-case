import { describe, it, expect } from 'vitest'

import { truncateTitle } from './truncate-title'

describe('truncateTitle', () => {
  it('returns title unchanged when within maxLength', () => {
    expect(truncateTitle('Short', 10)).toBe('Short')
    expect(truncateTitle('Exactly ten!', 12)).toBe('Exactly ten!')
  })

  it('truncates and appends "..." when over maxLength', () => {
    expect(truncateTitle('Hello world', 8)).toBe('Hello...')
    expect(truncateTitle('Long title here', 10)).toBe('Long ti...')
  })

  it('trims trailing space before appending "..."', () => {
    expect(truncateTitle('Hello world', 9)).toBe('Hello...')
  })

  it('handles maxLength of 3 or less', () => {
    expect(truncateTitle('Hi', 3)).toBe('Hi')
    expect(truncateTitle('Abc', 3)).toBe('Abc')
    expect(truncateTitle('Abcd', 3)).toBe('...')
  })

  it('handles empty string', () => {
    expect(truncateTitle('', 10)).toBe('')
  })
})

