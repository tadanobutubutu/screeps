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
  addSvgAccessibleNames();
  checkAccessibility();
  checkLandmarks();
  checkLandmarkElement();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  fixTableStructureIssues();
  setFormElementAccessibleNames();
  setSvgAccessibilityProps();

  // Implement the renderIndexView method here
  renderIndexView();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="..." />
        <title>Screeps Dashboard</title>
      </head>
      <body>{children}</body>
    </html>
  );
}