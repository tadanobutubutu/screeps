var addSorting = (function () {
    'use strict';
    var cols,
        currentSort = {
            index: 0,
            desc: false,
        };

    // returns the summary table element
    function getTable() {
        return document.querySelector('.coverage-summary');
    }
    // returns the thead element of the summary table
    function getTableHeader() {
        return getTable().querySelector('thead tr');
    }
    // returns the tbody element of the summary table
    function getTableBody() {
        return getTable().querySelector('tbody');
    }
    // returns of a list of all the td elements of the [index]th column
    function getColNodes(index) {
        var rows = getTableBody().querySelectorAll('tr'),
            nodes = [],
            i;

        for (i = 0; i < rows.length; i += 1) {
            nodes.push(rows[i].querySelectorAll('td')[index]);
        }
        return nodes;
    }
    // adds the 'sorted' class to the [index]th column header and
    // its corresponding cells
    function addSortedClass(index) {
        getTableHeader().querySelectorAll('th')[index].classList.add('sorted');
        getColNodes(index).forEach(function (node) {
            node.classList.add('sorted');
        });
    }
    // removes the 'sorted' class from the previously sorted column's header and
    // its corresponding cells
    function removeSortedClass() {
        var prevHeader = getTableHeader().querySelectorAll('th')[currentSort.index];
        if (prevHeader) {
            prevHeader.classList.remove('sorted');
        }
        getColNodes(currentSort.index).forEach(function (node) {
            node.classList.remove('sorted');
        });
    }
    // returns an array of objects of all the column summary data,
    // additionally adds the sorter span for clickable columns
    function loadColumns() {
        var colNodes = getTableHeader().querySelectorAll('th'),
            colNode,
            col,
            i;

        for (i = 0; i < colNodes.length; i += 1) {
            colNode = colNodes[i];
            col = {
                key: colNode.getAttribute('data-col'),
                sortable: !colNode.getAttribute('data-nosort'),
                type: colNode.getAttribute('data-type') || 'string',
            };
            cols.push(col);
            if (col.sortable) {
                col.defaultDescSort = col.type === 'number';
                var sorter = document.createElement('span');
                sorter.className = 'sorter';
                colNode.appendChild(sorter);
            }
        }
        return cols;
    }
    // attaches a data attribute to every tr element with an object
    // of data values keyed by column name
    function loadRowData(tableRow) {
        var tableCols = tableRow.querySelectorAll('td'),
            colNode,
            col,
            data = {},
            i,
            val;
        for (i = 0; i < tableCols.length; i += 1) {
            colNode = tableCols[i];
            col = cols[i];
            val = colNode.getAttribute('data-value');
            if (col.type === 'number') {
                val = Number(val);
            }
            data[col.key] = val;
        }
        return data;
    }
    // loads all row data
    function loadData() {
        var rows = getTableBody().querySelectorAll('tr'),
            i;

        for (i = 0; i < rows.length; i += 1) {
            rows[i].data = loadRowData(rows[i]);
        }
    }
    // sorts the table using the data for the ith column
    function sortByIndex(index, desc) {
        var key = cols[index].key,
            sorter = function (a, b) {
                a = a.data[key];
                b = b.data[key];
                return a < b ? -1 : a > b ? 1 : 0;
            },
            finalSorter = sorter,
            tableBody = getTableBody(),
            rows = Array.prototype.slice.call(tableBody.querySelectorAll('tr')),
            i;

        if (desc) {
            finalSorter = function (a, b) {
                return -sorter(a, b);
            };
        }

        rows.sort(finalSorter);

        for (i = 0; i < rows.length; i += 1) {
            tableBody.appendChild(rows[i]);
        }
    }
    // shows the sorting functionality
    function showUI() {
        var tableHeader = getTableHeader(),
            headerNodes = tableHeader.querySelectorAll('th'),
            i;

        // add click handlers to all the clickable headers
        for (i = 0; i < headerNodes.length; i += 1) {
            if (cols[i].sortable) {
                (function (index) {
                    headerNodes[index].onclick = function () {
                        var desc =
                            currentSort.index === index
                                ? !currentSort.desc
                                : cols[index].defaultDescSort;
                        removeSortedClass();
                        addSortedClass(index);
                        sortByIndex(index, desc);
                        currentSort.index = index;
                        currentSort.desc = desc;
                    };
                })(i);
            }
        }
    }

    function init() {
        var table = getTable();
        if (table) {
            cols = [];
            loadColumns();
            loadData();
            addSortedClass(0);
            showUI();
        }
    }

    return init;
})();

window.onload = function () {
    addSorting();
};
