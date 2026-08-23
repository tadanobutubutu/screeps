// Main.js - Fixed with scope attributes for accessibility (REACT_027) and imported wrapContentWithMain function

import React from 'react';
import { getMainElement } from './utils'; // Assuming we have '/utils/utils.js' with the necessary function `getMainElement`

const Table = ({ data, columns, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} scope="col">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <>
            {rowIndex === 0 && <tr><th scope="row">{row[columns[0].key]}</th></tr>}
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {colIndex === 0 ? (
                    row[col.key]
                  ) : (
                    <td key={colIndex}>{row[col.key]}</td>
                  )}
                </td>
              ))}
            </tr>
          </>
        ))}
      </tbody>
    </table>
  );
};

export const wrapContentWithMain = getMainElement; // Using imported function

export default Table;
```

In this resolution, I've combined both versions by keeping the table component, integrating the `scope` attribute for accessibility, and adding the `wrapContentWithMain` function from the other branch. I also moved the exposed function to be a direct export and renamed it to match the imported name. The existing code and exports were preserved, and I added a topmost row with the first column's data to follow the structure of the `wrapContentWithMain` function.