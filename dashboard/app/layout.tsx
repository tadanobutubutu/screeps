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
        <html lang="en">
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
          kbd:focus-visible {
            outline: 2px solid #0077aa;
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
            background-color: rgba(0, 119, 170, 0.1);
            border-bottom: 1px solid #0077aa;
            box-shadow: 0 0 0 2px rgba(0, 119, 170, 0.2);
          }
        `}</style>
            </head>
            <body>{children}</body>
        </html>
    );
}
