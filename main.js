import { type Metadata } from "next";
import "./globals.css";
import { addLangAttribute, addMainLandmark, addSvgAccessibleNames, checkAccessibility, checkLandmarks, checkLandmarkElement, ensureUniqueLandmarks, fixFakeLinkIssue, fixTableStructureIssues, renderIndexView, setFormElementAccessibleNames, setSvgAccessibilityProps, isLinkAccessible, isButtonAccessible, addressAccessibilityIssue038, getSvgAccessibleName } from "./accessibility";
import { renderDependencyGraph } from "./dependencyGraph";

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
  addressAccessibilityIssue038(document.body, { feature: 'accessibility-enhancement' });

  // Implement the renderIndexView method here
  renderIndexView();

  return (
    <html lang="en">
      <head>
        <link rel="icon" ... ... viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' ... />
        ... index) => (
          <div ...
        ))}
        ... index) => (
          <div ...
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}