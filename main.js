const MyTableComponent = () => {
  return React.createElement(
    "div",
    { role: "region", "aria-label": "Data table" },
    React.createElement(
      "table",
      null,
      React.createElement(
        "caption",
        null,
        "Data Table"
      ),
      React.createElement(
        "thead",
        { role: "rowgroup" },
        React.createElement(
          "tr",
          { role: "row" },
          React.createElement("th", { scope: "col", role: "columnheader" }, "Column 1"),
          React.createElement("th", { scope: "col", role: "columnheader" }, "Column 2"),
          React.createElement("th", { scope: "col", role: "columnheader" }, "Column 3")
        )
      ),
      React.createElement(
        "tbody",
        { role: "rowgroup" },
        React.createElement(
          "tr",
          { role: "row" },
          React.createElement("td", { role: "cell" }, "Row 1, Col 1"),
          React.createElement("td", { role: "cell" }, "Row 1, Col 2"),
          React.createElement("td", { role: "cell" }, "Row 1, Col 3")
        )
      )
    )
  );
};
export default MyTableComponent;