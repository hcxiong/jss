/* eslint-disable no-underscore-dangle */

import expect from 'expect.js'
import escape from '../../src/utils/escape'

const originalEscape = CSS.escape

describe('Unit: jss - escape', () => {
  describe('with CSS.escape', () => {
    it('should escape in development', () => {
      expect(escape('test()')).to.be('test\\(\\)')
    })

    it('should not escape in production', () => {
      escape.__Rewire__('env', 'production')
      expect(escape('test()')).to.be('test()')
      escape.__ResetDependency__('env')
    })
  })

  describe('without CSS.escape', () => {
    let warned
    beforeEach(() => {
      delete CSS.escape
      escape.__Rewire__('warning', () => {
        warned = true
      })
    })

    afterEach(() => {
      escape.__ResetDependency__('warning')
      CSS.escape = originalEscape
      warned = false
    })

    it('should warn when CSS.escape is not available', () => {
      escape('test()')
      expect(warned).to.be(true)
    })

    it('should not warn in production', () => {
      escape.__Rewire__('env', 'production')
      expect(warned).to.be(false)
      escape.__ResetDependency__('env')
    })
  })
})