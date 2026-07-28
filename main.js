function handleConventionalCommit(title) {
  if (!title) return { valid: false, reason: 'Empty title', score: 0 };
  const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?:.+/i.test(title);
  if (!hasConvention) return { valid: false, reason: 'Missing conventional commit prefix', score: 20 };
  const lengthScore = title.length <= 72 ? 100 : 50;
  return { valid: true, score: lengthScore };
}

// ... (existing code)