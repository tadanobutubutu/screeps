# 🤝 Contributing to Screeps AI

Thank you for your interest in contributing to this Screeps AI project! 🎉

## 📚 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Error logs or stack traces**
- **Game tick number** (if relevant)

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case**: Why is this enhancement needed?
- **Expected behavior**: What should happen?
- **Alternatives considered**

### Pull Requests 📥

We actively welcome your pull requests!

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Ensure tests pass
6. Submit your pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 14+ (if using local development)
- Screeps account
- Git

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/screeps.git
cd screeps

# Create a branch
git checkout -b feature/my-feature

# Make your changes
# ...

# Commit
git add .
git commit -m "✨ Add my feature"

# Push
git push origin feature/my-feature
```

### Testing

Test your changes in the Screeps game:

1. Upload code to your Screeps account
2. Monitor console for errors
3. Verify creep behavior
4. Check performance impact

## 📝 Coding Guidelines

### JavaScript Style

```javascript
// ✅ Good
const roleHarvester = {
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (source) {
                creep.harvest(source);
            }
        }
    }
};

// ❌ Bad
var roleHarvester={run:function(creep){if(creep.store.getFreeCapacity()>0){const source=creep.pos.findClosestByPath(FIND_SOURCES);if(source){creep.harvest(source);}}}}
```

### Best Practices

#### Error Handling

✅ **Always check for null/undefined**:
```javascript
const target = creep.memory.target;
if (!target) {
    logger.warn('No target found');
    return;
}
```

#### Performance

✅ **Cache expensive operations**:
```javascript
// Cache in memory
if (!room.memory.sources) {
    room.memory.sources = room.find(FIND_SOURCES).map(s => s.id);
}
```

#### Logging

✅ **Use the logging system**:
```javascript
logger.info('Spawning new harvester');
logger.warn('Low energy');
logger.error('Critical error: ' + error.message);
```

### Code Organization

```
/
├── role.*.js          # Creep roles
├── utils.*.js         # Utility modules
├── defense.*.js       # Defense systems
├── main.js            # Main loop
└── config.js          # Configuration
```

## 📝 Commit Guidelines

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `✨ feat`: New feature
- `🐛 fix`: Bug fix
- `📝 docs`: Documentation
- `🎨 style`: Formatting
- `♻️ refactor`: Code restructuring
- `⚡ perf`: Performance improvement
- `✅ test`: Adding tests
- `🔧 chore`: Maintenance

### Examples

```bash
✨ feat(harvester): Add automatic energy collection
🐛 fix(explorer): Fix null reference error
📝 docs: Update README with new features
⚡ perf(main): Optimize room scanning
```

## 📥 Pull Request Process

### Before Submitting

- ✅ Code follows style guidelines
- ✅ Self-review completed
- ✅ Comments added for complex code
- ✅ Documentation updated
- ✅ No console errors
- ✅ Tested in game

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in game
- [ ] No errors in console
- [ ] Performance verified

## Screenshots (if applicable)

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** run first
2. **Code review** by maintainers
3. **Testing** in game environment
4. **Approval** and merge

### After Merge

- Your changes will be deployed automatically
- Monitor for any issues
- Respond to feedback

## 📝 Issue Guidelines

### Creating Issues

#### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Log
```
error message here
```

## Environment
- Game tick: 12345
- Room: E1S1
- Creep role: harvester
```

#### Feature Request Template

```markdown
## Feature Description
What feature do you want?

## Use Case
Why is this needed?

## Proposed Solution
How should it work?

## Alternatives
Other approaches considered
```

### Issue Labels

Issues are automatically labeled:

- 🐛 `bug` - Something isn't working
- ✨ `enhancement` - New feature
- 📚 `documentation` - Documentation update
- ❓ `question` - Further information needed
- 🔒 `security` - Security issue
- ⚡ `performance` - Performance improvement
- 🤖 `auto-fix` - Can be fixed automatically

## 🤖 Automated Systems

### Auto-Fix System

Many issues are automatically fixed:

1. Issue created
2. System analyzes issue
3. Fix attempted
4. PR created automatically
5. Review and merge

### CodeQL Security

Security issues are automatically detected:

- Daily scans
- Automatic alerts
- Auto-fix when possible

## 💬 Getting Help

- **Issues**: Create an issue for bugs or features
- **Discussions**: Use GitHub Discussions for questions
- **Security**: See [SECURITY.md](SECURITY.md) for security issues

## 🎉 Recognition

Contributors are recognized in:

- Release notes
- Contributors list
- Special mentions for significant contributions

## 📚 Resources

- [Screeps Documentation](https://docs.screeps.com/)
- [Screeps API](https://docs.screeps.com/api/)
- [Project Wiki](https://github.com/tadanobutubutu/screeps/wiki)

---

**Thank you for contributing! 🚀**

*Every contribution, no matter how small, is valuable and appreciated.*
