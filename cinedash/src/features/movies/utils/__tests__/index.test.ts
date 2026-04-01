import { describe, expect, it } from 'vitest'
import { parseMovieIdParam } from '../index'

describe('parseMovieIdParam', () => {
  it('parses positive integer ids', () => {
    expect(parseMovieIdParam('42')).toBe(42)
  })

  it('returns null for invalid ids', () => {
    expect(parseMovieIdParam(undefined)).toBeNull()
    expect(parseMovieIdParam('abc')).toBeNull()
    expect(parseMovieIdParam('0')).toBeNull()
    expect(parseMovieIdParam('-5')).toBeNull()
    expect(parseMovieIdParam('1.5')).toBeNull()
  })
})
