import React from 'react';
import { useTable } from 'react-table';

function TableComponent({ columns }) {
    const {
        getHeaderGroups,
        getRowModel,
        getCellRenderers,
    } = useTable({ columns });

    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">src/constants.js</th>
                    <th scope="col">src/managers/roomManager.js</th>
                    <th scope="col">src/managers/spawnManager.js</th>
                    <th scope="col">src/managers/towerManager.js</th>
                    <th scope="col">src/roles/builder.js</th>
                </tr>
            </thead>
            <tbody>
                {getRowModel.map(row => (
                    <tr key={row.id}>
                        {getCellRenderers.map(cell => (
                            <td key={cell.id}>{cell.render}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TableComponent;