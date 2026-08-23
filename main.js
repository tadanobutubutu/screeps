import React from 'react';
import { getMainElement } from './utils';

export const wrapContentWithMain = getMainElement;

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
        <>
          {data.map((row, rowIndex) => (
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
          ))}
        </>
      </tbody>
    </table>
  );
};

export default Table;