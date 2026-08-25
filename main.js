/* main.js - Main module for Screeps bot
 * Resolved merge conflict integrating accessibility improvements
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

/**
 * Generates a React table with proper scope attributes for accessibility
 * @param {Array} data - The data to populate the table rows
 * @returns {JSX.Element} Accessible table component
 */
function generateAccessibleTable(data) {
  return (
    <div lang="en">
      <header>
        {/* Header content */}
      </header>
      <main>
        {/* Primary content */}
        <div>
          <Table data={data}>
            <table role="grid" aria-label="Screeps Bot Data Table">
              <thead>
                <tr>
                  <th scope="col"><div>src/constants.js</div></th>
                  <th scope="col"><div>src/managers/roomManager.js</div></th>
                  <th scope="col"><div>src/managers/spawnManager.js</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row"><div>Header Cell</div></td>
                  <td><div>Data Cell</div></td>
                </tr>
              </tbody>
            </table>
          </Table>
        </div>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

/**
 * Table component with proper role, headers, and accessibility properties
 * @param {Object} props - Component props
 * @param {Array} props.data - Table data
 * @param {JSX.Element} props.children - Table content
 * @returns {JSX.Element} Table wrapper component
 */
const Table = ({ data, children }) => {
  return (
    <table role="grid" aria-label="Screeps Bot Data Table">
      {children}
    </table>
  );
};

Table.propTypes = {
  data: PropTypes.array,
  children: PropTypes.node,
};

// Main functional component
const Main = ({ data }) => {
  return generateAccessibleTable(data);
};

Main.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

// Export for use in other modules
export { generateAccessibleTable, Table, Main };
export default Main;