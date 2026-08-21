import React from 'react';  
import ReactDOM from 'react-dom';  
import DependencyGraphTable from './DependencyGraphTable';  

ReactDOM.render(  
  <React.StrictMode>  
    <DependencyGraphTable />  
  </React.StrictMode>,  
  document.getElementById('root')  
);  

const DependencyGraphTable = ({ data }) => {  
  return (  
    <table>  
      <thead>  
        <tr>  
          <th scope="col">Column 1</th>  
          <th scope="col">Column 2</th>  
          <th scope="row">Row Header</th>  
        </tr>  
      </thead>  
      <tbody>  
        {/* Table rows go here */}  
      </tbody>  
    </table>  
  );  
};  

// ... rest of the code ...  
export default DependencyGraphTable;