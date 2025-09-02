/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import Hello from '../components/hello'

describe('Link without a router', () => {
  describe('development mode', () => {
    it('should not throw when rendered', () => {
      const { container } = render(<Hello />)

      expect(container.textContent).toBe('Click me')
    })
  })
  describe('production mode', () => {
    // eslint-disable-next-line jest/no-identical-title
    it('should not throw when rendered', () => {
      const { container } = render(<Hello />)

      expect(container.textContent).toBe('Click me')
    })
  })
})
