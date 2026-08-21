import React from 'react';
import { TableComponent } from './TableComponent';
import myModule from './myModule';
import _ from 'lodash';
import ReactDOM from 'react-dom';

function initialize() {
    const app = {
        container: document.getElementById('app'),
        config: {
            apiUrl: 'https://api.example.com',
            debug: true,
            features: {
                rotate: true,
                animate: false,
                cacheEnabled: true
            }
        },
        state: {
            isLoading: false,
            error: null,
            data: null
        }
    };

    return app;
}

function render() {
    const app = initialize();

    if (!app.container) {
        console.warn('App container not found');
        return null;
    }

    const unrotateButton = React.createElement('button', {
        id: 'unrotate',
        onClick: () => {
            // Your rotate back logic here
            console.log('Rotate back clicked');
        }
    }, 'rotate back');

    const header = React.createElement('h1', { className: 'title' }, 'My App');
    const footer = React.createElement('footer', null,
        React.createElement('p', null, 'Footer content')
    );

    const root = React.createElement('div', { className: 'app' },
        header,
        unrotateButton,
        footer
    );

    ReactDOM.render(root, app.container);
}

export default function App() {
    return render();
}