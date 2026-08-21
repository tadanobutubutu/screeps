tsx
import React from 'react';
import type { AppProps } from 'next/app';

function Dashboard({ Component, pageProps }: AppProps) {
    const [show, setShow] = React.useState<boolean>(false);

    //... Rest of your code here

    return (
        <div>
            {/* ... Rest of your components here */}
            <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
                {/* ... Rest of your code inside the main element */}
            </main>
        </div>
    );
}

export default Dashboard;