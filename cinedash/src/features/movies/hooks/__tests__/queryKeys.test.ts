import { describe, expect, it } from 'vitest'
import { movieKeys, tvKeys } from '../queryKeys'

describe('movieKeys', () => {
  it('separates movie and tv detail caches', () => {
    expect(movieKeys.detail(42, 'movie')).not.toEqual(movieKeys.detail(42, 'tv'))
  })

  it('separates movie and tv credits caches', () => {
    expect(movieKeys.credits(42, 'movie')).not.toEqual(movieKeys.credits(42, 'tv'))
  })

  it('keeps videos scoped by media type', () => {
    expect(movieKeys.videos(42, 'movie')).not.toEqual(movieKeys.videos(42, 'tv'))
  })

  it('keeps infinite movie and tv lists in separate domains', () => {
    expect(movieKeys.infiniteList({ genre: 28 })).not.toEqual(tvKeys.infiniteList({ genre: 28 }))
  })
})
