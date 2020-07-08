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

    params.api.sizeColumnsToFit();

    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/rowData.json')
      .then(result => result.json())
      .then(rowData => this.setState({ rowData }))
      .catch(err => console.log(err));
  };

  selectAllBtnHandler = bool => {
    if (bool) {
      this.gridApi.selectAll();
    } else {
      this.gridApi.deselectAll();
    }
  }

  filterBtnHandler = (colId, value) => {
    if (!colId && !value) {
      this.gridApi.setFilterModel(null);
      return;
    }
    var filterInstance = this.gridApi.getFilterInstance(colId);
    filterInstance.setModel({ values: [value] });
    this.gridApi.onFilterChanged();
  }

  sortBtnHandler = (colId, sort) => {
    if (!colId && !sort) {
      this.gridApi.setSortModel(null);
      return;
    }
    this.gridApi.setSortModel([{ colId, sort }]);
  }

  render() {
    return (
      <div className="app-component">
        <div className="actions-panel">
          <button id="selectAll" onClick={() => this.selectAllBtnHandler(true)}>Select All Rows</button>
          <button id="deSelectAll" onClick={() => this.selectAllBtnHandler(false)}>Deselect All Rows</button>
          <button id="filterByPorsche" onClick={() => this.filterBtnHandler('make', 'Porsche')}>Filter By Porsche</button>
          <button id="removeFilters" onClick={() => this.filterBtnHandler(null, null)}>Remove All Filters</button>
          <button id="sortByPriceAsc" onClick={() => this.sortBtnHandler('price', 'asc')}>Sort By Price (asc)</button>
          <button id="sortByPriceDesc" onClick={() => this.sortBtnHandler('price', 'desc')}>Sort By Price (desc)</button>
          <button id="removeSort" onClick={() => this.sortBtnHandler(null)}>Remove All Sorting</button>
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
            onGridReady={this.onGridReady}
            ensureDomOrder
            suppressColumnVirtualisation />
        </div>
      </div >
    );
  }
}

export default App;
