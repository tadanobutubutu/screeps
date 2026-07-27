const willRecreateBlockedUpdate = (pr) => {
  // Check if PR title or notes contain a blocked keyword like "Pavouk" or a numeric ID
  const blockedKeyword = 'Pavouk';
  const blockedNumber = pr.number; // Assuming pr.number is a numeric ID to block
  const titleContainsKeyword = pr.title.includes(blockedKeyword);
  const titleContainsNumber = /\d/.test(pr.title); // Check for any number in title
  const notesContainKeyword = pr.notes?.includes(blockedKeyword) || false;

  return titleContainsKeyword || titleContainsNumber || notesContainKeyword;
};