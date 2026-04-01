import { createRef } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card } from '../card'

describe('Card', () => {
  it('forwards refs to the underlying div', () => {
    const ref = createRef<HTMLDivElement>()

    render(<Card ref={ref}>Conteudo</Card>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-slot', 'card')
  })
})
