import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { PrioritizedKey } from 'mathjax-full/js/util/Retries.js';

import 'mathjax-full/js/a11y/wordify.js';
import 'mathjax-full/js/a11y/sre-highlighter.js';
import SRE from 'mathjax-full/js/a11y/sre.js';

import './index.css';

import { generateStats } from './stats.js';
import {
    buildTree,
    flatten,
    prepareTree,
    treeToMemorable,
    treeToJSON,
    treeToDOT,
} from './tree.js';
import { buildDependencyTree, buildGraph } from './depgraph.js';
import { drawTree } from './draw.js';

const config = {
    loader: {
        load: ['input/tex', 'output/svg', 'a11y/sre'],
    },
    svg: {
        fontCache: 'local',
    },
    tex: {
        packages: { '[+]': ['boldsymbol'] },
        processEscapes: true,
    },
};

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

function App() {
    const [activeTab, setActiveTab] = useState('tree');
    const [showStats, setShowStats] = useState(false);

    const stats = useMemo(() => generateStats(), []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderTable = () => {
        const tree = buildTree();
        const flat = flatten(tree);
        const data = prepareTree(flat);

        return (
            <main>
                <table id="table-rotated">
                    <thead>
                        <tr>
                            <th></th>
                            {data.ids.map((id, i) => (
                                <th key={i}>{id}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.names.map((name, i) => (
                            <tr key={i}>
                                <th>{name}</th>
                                {data.ids.map((id, j) => (
                                    <td key={j}>{data.matrix[i][j]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        );
    };

    const renderGraphs = () => {
        return (
            <main>
                <div className="container">
                    <h2>Quality & Metrics Reports</h2>
                    <p>
                        This repository is fully optimized with automated tools. Explore the generated
                        reports below:
                    </p>
                    <div className="links">
                        <a
                            href={drawTree(buildDependencyTree())}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Plato Code Complexity Report
                        </a>
                        <a
                            href={buildGraph(buildDependencyTree())}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Dependency Graph
                        </a>
                    </div>
                </div>
            </main>
        );
    };

    return (
        <>
            <nav className="tab-nav">
                <button
                    className={`tab-button ${activeTab === 'tree' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tree')}
                >
                    Memory Tree
                </button>
                <button
                    className={`tab-button ${activeTab === 'links' ? 'active' : ''}`}
                    onClick={() => handleTabClick('links')}
                >
                    Reports
                </button>
                <button
                    className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => handleTabClick('stats')}
                >
                    Stats
                </button>
            </nav>

            <div className="content">
                {activeTab === 'tree' && renderTable()}
                {activeTab === 'links' && renderGraphs()}
                {activeTab === 'stats' && (
                    <div className="stats-container">
                        <pre>{JSON.stringify(stats, null, 2)}</pre>
                    </div>
                )}
            </div>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <MathJaxContext config={config}>
            <App />
        </MathJaxContext>
    </React.StrictMode>
);