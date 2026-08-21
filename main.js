// Accessibility fix for REACT_027 - Adding scope attributes to table headers

module.exports = {
  // Table component with accessible headers
  Table: function Table({ headers, rows }) {
    return {
      type: 'table',
      props: {
        children: [
          {
            type: 'thead',
            props: {
              children: {
                type: 'tr',
                props: {
                  children: headers.map(function(header, index) {
                    return {
                      type: 'th',
                      props: {
                        scope: 'col',
                        children: header
                      }
                    };
                  })
                }
              }
            }
          },
          {
            type: 'tbody',
            props: {
              children: rows.map(function(row) {
                return {
                  type: 'tr',
                  props: {
                    children: row.map(function(cell) {
                      return {
                        type: 'td',
                        props: {
                          children: cell
                        }
                      };
                    })
                  }
                };
              })
            }
          }
        ]
      }
    };
  }
};