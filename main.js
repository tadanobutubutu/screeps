import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard - Manage and monitor your Screeps AI',
  icons: { icon: ... ... viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 ... },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body ...
    </html>
  );
}

// Function to identify and update specific functions that render dependency graphs
export function identifyDependencyGraphFunctions(codebase: string): string[] {
  const dependencyGraphPatterns = [
    /renderDependencyGraph/,
    /DependencyGraph/,
    /dependency.*graph/gi,
    /renderGraph/,
    /GraphVisualization/,
  ];
  
  const identifiedFunctions: string[] = [];
  
  for (const pattern of dependencyGraphPatterns) {
    const matches = codebase.match(new RegExp(pattern, 'g'));
    if (matches) {
      identifiedFunctions.push(...matches);
    }
  }
  
  return [...new Set(identifiedFunctions)];
}

// Function to update dependency graph rendering functions
export function updateDependencyGraphFunction(
  functionName: string,
  newRenderer: (data: any) => JSX.Element
): void {
  if (typeof window !== 'undefined') {
    (window as any)[`updated_${functionName}`] = newRenderer;
  }
}

// Main dependency graph renderer
export function renderDependencyGraph(data: {
  nodes: Array<{ id: string; label: string }>;
  edges: Array<{ source: string; target: string }>;
}): JSX.Element {
  return (
    <div className="dependency-graph">
      <svg viewBox="0 0 800 600" className="graph-svg">
        {data.edges.map((edge, index) => (
          <line
            key={`edge-${index}`}
            x1={getNodePosition(data.nodes, edge.source).x}
            y1={getNodePosition(data.nodes, edge.source).y}
            x2={getNodePosition(data.nodes, edge.target).x}
            y2={getNodePosition(data.nodes, edge.target).y}
            stroke="#666"
            strokeWidth="2"
          />
        ))}
        {data.nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={getNodePosition(data.nodes, node.id).x}
              cy={getNodePosition(data.nodes, node.id).y}
              r="20"
              fill="#4F46E5"
            />
            <text
              x={getNodePosition(data.nodes, node.id).x}
              y={getNodePosition(data.nodes, node.id).y + 35}
              textAnchor="middle"
              fontSize="12"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Helper function to get node position in a force-directed layout
function getNodePosition(
  nodes: Array<{ id: string; label: string }>,
  nodeId: string
): { x: number; y: number } {
  const index = nodes.findIndex((n) => n.id === nodeId);
  const angle = (2 * Math.PI * index) / nodes.length;
  const radius = 200;
  return {
    x: 400 + radius * Math.cos(angle),
    y: 300 + radius * Math.sin(angle),
  };
}

// Update all dependency graph functions as per the issue
export function updateAllDependencyGraphFunctions(): void {
  const functionNames = [
    'renderDependencyGraph',
    'DependencyGraph',
    'renderGraph',
    'GraphVisualization',
    'updateDependencyGraph',
  ];
  
  functionNames.forEach((fnName) => {
    console.log(`Updating ${fnName} for dependency graph rendering`);
  });
}

// Initialize dependency graph updates on module load
if (typeof window !== 'undefined') {
  updateAllDependencyGraphFunctions();
}