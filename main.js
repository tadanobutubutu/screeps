import { dependencyGraphContent, indexContent } from './content';

export function countDependencies(dependencyGraphContent) {
  if (!dependencyGraphContent) return 0;
  
  let count = 0;
  for (const module in dependencyGraphContent) {
    const deps = dependencyGraphContent[module];
    if (Array.isArray(deps)) {
      count += deps.length;
    }
  }
  return count;
}

// TODO: Implement a function to count dependencies