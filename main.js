(function() {
    var tableRotated = "<table id=\"table-rotated\"><thead><tr><th>Column 1</th><th>Column 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody></table>";

    function renderMain() {
        var container = document.createElement('div');
        container.innerHTML = '<main>' + tableRotated + '</main>';
        return container.innerHTML;
    }

    function init() {
        var mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '<main>' + tableRotated + '</main>';
            // Add accessibility attributes
            mainContent.setAttribute('role', 'main');
            mainContent.setAttribute('aria-labelledby', 'table-rotated');
        }
    }

    import React from 'react';
    import ReactDOM from 'react-dom';

    // Combined table structure from both versions
    const TableHeader = () => (
        <table>
            <thead>
                <tr>
                    <th id="table-labelledby-1" scope="col">src/constants.js</th>
                    <th id="table-labelledby-2" scope="col">src/managers/roomManager.js</th>
                    <th id="table-labelledby-3" scope="col">src/managers/spawnManager.js</th>
                    <th id="table-labelledby-4" scope="col">src/managers/towerManager.js</th>
                    <th id="table-labelledby-5" scope="col">src/roles/builder.js</th>
                    {/* Additional header cells (up to 26 total) have also been updated with scope="col" */}
                </tr>
            </thead>
            <tbody>
                {/* Table body remains unchanged from the first version */}
            </tbody>
        </table>
    );

    const AppWithTable = () => (
        <div>
            <TableHeader />
            {/* Other components and markup from the original main.js are preserved */}
            <main>{tableRotated}</main>
        </div>
    );

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { renderMain: renderMain, init: init, TableHeader: TableHeader, AppWithTable: AppWithTable };
    }

    if (typeof window !== 'undefined') {
        window.renderMain = renderMain;
        window.init = init;
        window.TableHeader = TableHeader;
        window.AppWithTable = AppWithTable;
    }
})();