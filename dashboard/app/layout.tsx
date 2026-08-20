import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Screeps Dashboard',
    description: 'Screeps game status dashboard',
    icons: {
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <head>
                <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.3; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 2px #FFD700; }
            50% { box-shadow: 0 0 12px #FFD700; }
          }
          @keyframes shrinkWidth {
            from { width: 100%; }
            to { width: 0%; }
          }
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
          button:focus-visible, kbd:focus-visible, pre:focus-visible {
            outline: 2px solid #004b73;
            outline-offset: 2px;
          }
          kbd:hover {
            filter: brightness(0.9);
          }
          kbd:active {
            transform: translateY(1px);
          }
          button:active {
            transform: scale(0.98);
          }
          .interactive-hint {
            cursor: help;
            border-bottom: 1px dotted #888;
            border-radius: 2px;
            padding: 0 2px;
            transition: all 0.2s ease-in-out;
            outline: none;
          }
          .interactive-hint:hover, .interactive-hint:focus-visible {
            background-color: rgba(0, 75, 115, 0.1);
            border-bottom: 1px solid #004b73;
            box-shadow: 0 0 0 2px rgba(0, 75, 115, 0.2);
          }
          summary::-webkit-details-marker {
            display: none;
          }
          summary {
            list-style: none; /* for standard compliant browsers */
            outline: none;
          }
          summary:focus-visible {
            outline: 2px solid #004b73;
            outline-offset: 2px;
          }
          input[type="checkbox"]:focus-visible {
            outline: 2px solid #004b73;
            outline-offset: 2px;
          }
          .auto-refresh-label {
            transition: background-color 0.2s, box-shadow 0.2s;
          }
          .auto-refresh-label:hover {
            background-color: rgba(0, 75, 115, 0.08);
          }
          .auto-refresh-label:focus-within {
            background-color: rgba(0, 75, 115, 0.05);
            box-shadow: 0 0 0 2px rgba(0, 75, 115, 0.2);
          }
        `}</style>
            </head>
            <body><main>{children}</main></body>
        </html>
    );
}
