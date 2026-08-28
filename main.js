import { type Metadata } from "next";
import "./globals.css";
import { addLangAttribute, addMainLandmark, addSvgAccessibleNames, checkAccessibility, checkLandmarks, checkLandmarkElement, ensureUniqueLandmarks, fixFakeLinkIssue, fixTableStructureIssues, renderIndexView, setFormElementAccessibleNames, setSvgAccessibilityProps, isLinkAccessible, isButtonAccessible, addressAccessibilityIssue038, getSvgAccessibleName } from "./accessibility";
import { renderDependencyGraph } from "./dependencyGraph";

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Identify elements with issue 038 accessibility concerns
  const hasIssue038 = accessibilityInfo && accessibilityInfo.issueType === '038';
  
  // Return accessibility status and any fixes needed
  return {
    hasIssue038,
    fixes: hasIssue038 ? [{ type: 'fix038', target: element }] : []
  };
};

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
  checkLandmarks();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  fixTableStructureIssues();
  setFormElementAccessibleNames();
  setSvgAccessibilityProps();
  renderIndexView();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Screeps Dashboard</title>
      </head>
      <body>{children}</body>
    </html>
  );
}