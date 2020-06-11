import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './App.css'

class App extends Component {
  constructor(props) {
    super(props);

    this.gridApi = null;
    this.columnApi = null;

    this.state = {
      columnDefs: [
        { headerName: "Make", field: "make", colId: "make" },
        { headerName: "Model", field: "model", colId: "model" },
        { headerName: "Price", field: "price", colId: "price" }
      ],
      defaultColDef: {
        filter: true,
        sortable: true,
        enableRowGroup: true
      },
      rowData: null
    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();

    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json')
      .then(result => result.json())
      .then(rowData => this.setState({ rowData }))
      .catch(err => console.log(err));
  };

  selectAllHandler = bool => {
    if (bool) {
      this.gridApi.selectAll();
    } else {
      this.gridApi.deselectAll();
    }
  }

  filterHandler = (colId, value) => {
    if (!colId && !value) {
      this.gridApi.setFilterModel(null);
      return;
    }
    var filterInstance = this.gridApi.getFilterInstance(colId);
    filterInstance.setModel({ values: [value] });
    this.gridApi.onFilterChanged();
  }

  sortHandler = (colId, sort) => {
    if (!colId && !sort) {
      this.gridApi.setSortModel(null);
      return;
    }
    this.gridApi.setSortModel([{ colId, sort }]);
  }

  rowGroupHandler = (colId, add) => {
    if (add) {
      this.columnApi.addRowGroupColumn(colId)
    } else {
      this.columnApi.removeRowGroupColumn(colId);
    }
  }

  hideColumnHandler = (colId, hide) => {
    if (hide) {
      this.columnApi.setColumnVisible(colId, false);
    } else {
      this.columnApi.setColumnVisible(colId, true);
    }
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div>
        <div className="actions-panel">
          <button id="selectAll" onClick={() => this.selectAllHandler(true)}>Select All Rows</button>
          <button id="deSelectAll" onClick={() => this.selectAllHandler(false)}>Deselect All Rows</button>
          <button id="filterByPorsche" onClick={() => this.filterHandler('make', 'Porsche')}>Filter By Porsche</button>
          <button id="removeFilters" onClick={() => this.filterHandler(null, null)}>Remove All Filters</button>
          <button id="sortByPriceAsc" onClick={() => this.sortHandler('price', 'asc')}>Sort By Price (asc)</button>
          <button id="sortByPriceDesc" onClick={() => this.sortHandler('price', 'desc')}>Sort By Price (desc)</button>
          <button id="removeSort" onClick={() => this.sortHandler(null)}>Remove All Sorting</button>
          <button id="groupByModel" onClick={() => this.rowGroupHandler('model', true)}>Group By Model</button>
          <button id="removeGrouping" onClick={() => this.rowGroupHandler('model', false)}>Ungroup Model</button>
          <button id="hidePriceColumn" onClick={() => this.hideColumnHandler('price', true)}>Hide Price Column</button>
          <button id="showPriceColumn" onClick={() => this.hideColumnHandler('price', false)}>Show Price Column</button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{
            height: 500,
          }}>
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady} />
        </div>
      </div >
    );
  }
}

export default App;
