// Import required module(s)
import _ from 'lodash';

// Existing code and exports remain here...

// New function to fix table structure issues
function formatTable(tableData) {
    // Your implementation for the new function
    return _.map(tableData, row => {
        return _.map(row, cell => {
            // Your logic for cell formatting goes here...
            return cell;
        });
    });
}

// Usage of the new function elsewhere in the code...
// ...

// Existing exports remain here...