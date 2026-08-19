describe('dependency-graph.html tests', () => {
  // ... other tests ...

  it('should have lang attribute in html tag', () => {
    const htmlContent = fs.readFileSync('docs/dependency-graph.html', 'utf-8');
    expect(htmlContent).toContain('<html lang="en">');
  });

  // ... other tests ...
});