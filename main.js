import React from 'react';
import ReactDOM from 'react-dom/client';

const htmlElement = document.getElementById('root');

if (htmlElement) {
    const root = ReactDOM.createRoot(htmlElement);
    root.render(
        React.createElement(
            App,
            null
        )
    );
}

const App = () => {
    return (
        <div id="root" lang="en" role="main">
            <header role="banner">
                <h1>Welcome to My App</h1>
            </header>
            <main id="main-content">
                <p id="description">This is a demo application.</p>
                <table id="data-table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Alice</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td>Bob</td>
                            <td>25</td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default App;