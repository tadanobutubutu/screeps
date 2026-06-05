const DashboardRenderer = require('../utils.dashboard')

describe('Palette UX Enhancements', () => {
  describe('formatNumber billions support', () => {
    test('should format billions with B suffix', () => {
      // Note: Currently DashboardRenderer only supports K and M.
      // We want to add B support for consistency with frontend.
      expect(DashboardRenderer.formatNumber(1000000000)).toBe('1.0B')
      expect(DashboardRenderer.formatNumber(1500000000)).toBe('1.5B')
    })
  })
})
