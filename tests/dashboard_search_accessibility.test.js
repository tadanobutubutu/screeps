/**
 * tests/dashboard_search_accessibility.test.js
 * Verification for room search input semantic label association,
 * zero-match clear button focus visible styling, and Escape shortcut documentation.
 */

const fs = require('fs')
const path = require('path')

describe('Dashboard Search Accessibility', () => {
  const dashboardPath = path.join(__dirname, '../dashboard/components/Dashboard.tsx')
  const content = fs.readFileSync(dashboardPath, 'utf8')

  test('should associate room search input with a semantic <label htmlFor="room-search-input">', () => {
    expect(content).toContain('htmlFor="room-search-input"')
    expect(content).toContain('id="room-search-input"')
    expect(content).toContain('部屋名で検索')
  })

  test('should place Alt + S shortcut badge inside the search input label', () => {
    // Verify <label ...> encloses <kbd ...>Alt + S</kbd>
    const labelRegex =
            /<label[^>]*htmlFor="room-search-input"[^>]*>[\s\S]*?<kbd[^>]*>[\s\S]*?Alt \+ S[\s\S]*?<\/kbd>[\s\S]*?<\/label>/
    expect(labelRegex.test(content)).toBe(true)
  })

  test('should bind zero-match clear button focus outline to noMatchClearFocused', () => {
    expect(content).toContain("outline: noMatchClearFocused ? '2px solid #004b73' : 'none'")
  })

  test('should document Escape shortcut in shortcut help toasts', () => {
    expect(content).toContain('Alt+A (自動更新), Esc (クリア/閉じる)')
  })
})
