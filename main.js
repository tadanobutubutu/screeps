if (!trimmedTitle) { return { valid: false, reason: 'Empty title', score: 0 }; } 
const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?:.+/i.test(trimmedTitle); 
if (!hasConvention) { return { valid: false, reason: 'Missing conventional commit prefix', score: 20 }; } 
const lengthScore = trimmedTitle.length <= 72 ? 100 : 50; 
return { valid: true, reason: '', score: lengthScore };