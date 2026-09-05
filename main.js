import { dependencyGraphContent, indexContent } from './content';

// Add lang attribute for accessibility
const html = `
<html lang="en">
${dependencyGraphContent()}
${indexContent()}
</html>
`;

export default html;