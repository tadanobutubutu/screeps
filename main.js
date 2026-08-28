import { type Metadata } from "next";
import "./globals.css";
import { addLangAttribute, addMainLandmark, addSvgAccessibleNames, checkAccessibility, checkLandmarks, checkLandmarkElement, ensureUniqueLandmarks, fixFakeLinkIssue, fixTableStructureIssues, renderIndexView, setFormElementAccessibleNames, setSvgAccessibilityProps, isLinkAccessible, isButtonAccessible, addressAccessibilityIssue038, getSvgAccessibleName } from "./accessibility";

const renderDependencyGraph = (dependencyGraph, container) => {
  container.innerHTML = dependencyGraph;
};

function countDependencies() {
  const scripts = document.querySelectorAll('script[src]');
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  const images = document.querySelectorAll('img[src]');
  const svgElements = document.querySelectorAll('svg[src]');
  const fonts = document.querySelectorAll('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"]');

  return {
    scripts: scripts.length,
    styles: styles.length,
    images: images.length,
    svgs: svgElements.length,
    fonts: fonts.length,
    total: scripts.length + styles.length + images.length + svgElements.length + fonts.length
  };
}

export const metadata: Metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  addLangAttribute();
  addMainLandmark();
  addSvgAccessibleNames();

  renderIndexView();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='32'>⚡</text></svg>" />
        {checkAccessibility().issues.map((issue, index) => (
          <div key={index}>{issue.message}</div>
        ))}
        {checkLandmarks().issues.map((issue, index) => (
          <div key={index}>{issue.message}</div>
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}

export { renderDependencyGraph, countDependencies };