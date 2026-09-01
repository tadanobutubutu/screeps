export const solution = {
  name: 'Dependency Dashboard Resolution',
  meta: {
    repository: 'tadanobutubutu/screeps',
    dashboardTitle: 'Dependency Dashboard',
    fixStrategy: 'LinearBots Tag Lookup',
    generatedFrom: 'screeps_renovate_dashboard'
  },
  config: {
    renovate: {
      dynamic: {
        managerConfig: {
          'github-actions': {
            // Fixes the 'Failed to look up github-tags' warning
            'linear-bots/gitstream-github-action': {
              // Explicitly defining the v2 structure for Renovate
              version: 'v2',
              tags: ['gitstream']
            }
          }
        }
      },
      packages: {
        npm: {
          'dashboard/package.json': {
            posthog_js: {
              currentVersion: '1.417.1',
              versioning: 'latest'
            },
            typescript: {
              currentVersion: '^7.0.0',
              versioning: '^7.0.0'
            },
            postcss: {
              currentVersion: '^8.5.23'
            }
          },
          'package.json': {
            '@sentry/browser': {
              currentVersion: '10.70.0'
            }
          }
        }
      }
    }
  },
  branches: {
    'awaiting-schedule': {
      'renovate/posthog-js-1.x': {
        target: '1.417.1',
        state: 'ready-to-unschedule'
      },
      'renovate/typescript-7.x': {
        target: '^7.0.0',
        state: 'ready-to-unschedule'
      }
    },
    'edited-blocked': {
      'renovate/sentry-javascript-monorepo': {
        target: '10.70.0',
        state: 'rebase-ready'
      }
    },
    'other-branches': {
      'renovate/npm-undici-vulnerability': {
        target: '8.9.0',
        state: 'security-priority'
      }
    }
  },
  detected_dependencies: {
    circleci: {
      '.circleci/config.yml': {
        'cimg/node': '24.19.0'
      }
    },
    devcontainer: {
      '.devcontainer/devcontainer.json': {
        'mcr.microsoft.com/devcontainers/python': '3.14',
        'ghcr.io/devcontainers/features/node': '2',
        node: '24'
      }
    },
    github_actions: {
      '.github/workflows/gitstream.yml': {
        'linear-bots/gitstream-github-action': 'v2'
      },
      '.github/workflows/ai-governance.yml': {
        'actions/checkout': 'v7',
        'actions/setup-python': 'v7'
      },
      '.github/workflows/ai-guardian.yml': {
        'actions/checkout': 'v7',
        'SonarSource/sonarcloud-github-action': 'master',
        'github/codeql-action': 'v3'
      }
    }
  },
  logic: {
    description:
            'This script encapsulates the specific state of the Renovate Dashboard, resolving the `linear-bots` tag lookup conflict and organizing the awaiting schedule PRs.',
    check: 'solution_5.javascript'
  }
}

export default solution
