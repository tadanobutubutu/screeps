describe('fix.js solution configuration', () => {
  let solution

  beforeEach(() => {
    jest.resetModules()
  })

  it('should export an object with the expected structure', async () => {
    const mod = await import('../fix.js')
    solution = mod.solution
    expect(solution).toBeDefined()
    expect(solution).toHaveProperty('name', 'Dependency Dashboard Resolution')
    expect(solution).toHaveProperty('meta')
    expect(solution).toHaveProperty('config')
    expect(solution).toHaveProperty('branches')
    expect(solution).toHaveProperty('detected_dependencies')
    expect(solution).toHaveProperty('logic')
  })

  it('should have correct meta properties', async () => {
    const mod = await import('../fix.js')
    solution = mod.solution
    expect(solution.meta.repository).toBe('tadanobutubutu/screeps')
    expect(solution.meta.dashboardTitle).toBe('Dependency Dashboard')
    expect(solution.meta.fixStrategy).toBe('LinearBots Tag Lookup')
    expect(solution.meta.generatedFrom).toBe('screeps_renovate_dashboard')
  })

  it('should correctly configure the linear-bots action version and tags', async () => {
    const mod = await import('../fix.js')
    solution = mod.solution
    const gitstreamConfig =
            solution.config.renovate.dynamic.managerConfig['github-actions'][
              'linear-bots/gitstream-github-action'
            ]
    expect(gitstreamConfig.version).toBe('v2')
    expect(gitstreamConfig.tags).toEqual(['gitstream'])
  })

  it('should correctly define awaiting-schedule branches', async () => {
    const mod = await import('../fix.js')
    solution = mod.solution
    const branches = solution.branches['awaiting-schedule']
    expect(branches['renovate/posthog-js-1.x']).toEqual({
      target: '1.417.1',
      state: 'ready-to-unschedule'
    })
    expect(branches['renovate/typescript-7.x']).toEqual({
      target: '^7.0.0',
      state: 'ready-to-unschedule'
    })
  })

  it('should include correct dependency data in logic check', async () => {
    const mod = await import('../fix.js')
    solution = mod.solution
    expect(solution.logic.check).toBe('solution_5.javascript')
    expect(typeof solution.logic.description).toBe('string')
    expect(solution.logic.description.length).toBeGreaterThan(0)
  })
})
