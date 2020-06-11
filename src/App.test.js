import React from 'react';
import App from './App';
import { AgGridReact } from 'ag-grid-react';
import { mount } from 'enzyme';

// increase retry time? 
jest.setTimeout(10000);

// ignore license errors
jest.spyOn(console, 'error').mockImplementation(() => { });

const testData = [
  { make: 'Alfa Romeo', model: 'A', price: 10000 },
  { make: 'BMW', model: 'B', price: 20000 },
  { make: 'Citroen', model: 'C', price: 30000 }
];

// loading in mock data so that we've decoupled our tests from our endpoint 
const setRowData = (wrapper, rowData) => {
  return new Promise(function (resolve, reject) {
    wrapper.setState({ rowData }, () => {
      wrapper.update();
      resolve();
    });
  })
}

const ensureGridApiHasBeenSet = (wrapper) => {
  return new Promise(function (resolve, reject) {
    (function waitForGridReady() {
      if (wrapper.instance().gridApi) {
        return resolve(wrapper);
      }
      setTimeout(waitForGridReady, 100);
    })();
  });
};


describe('Grid Actions Panel', () => {
  let wrapper = null;
  let agGridReact = null;

  beforeEach((done) => {
    wrapper = mount(<App />);
    agGridReact = wrapper.find(AgGridReact).instance();

    ensureGridApiHasBeenSet(wrapper)
      .then((wrapper) => setRowData(wrapper, testData))
      .then(() => done());
  });

  afterEach(() => {
    wrapper.unmount();
    wrapper = null;
    agGridReact = null;
  })

  it('renders without crashing', () => {
    expect(wrapper.find('.actions-panel').exists()).toBeTruthy();
  });

  it('renders test rows', () => {
    // 1) Querying the DOM
    // querying the DOM only works since were using autoHeight, i.e. there is no row virtualisation
    // if you are not using autoheight then we recommend you use the grids API's in your assertions 

    // *** note: if you want to query the grid you'll need to use wrapper.render().find(); 
    // im guessing some magic happens when render is executed ***
    const gridRows = wrapper.render().find('.ag-center-cols-container .ag-row');
    expect(gridRows.length).toEqual(testData.length);
    // 2) Using ag-Grid's API
    let rowCount = 0;
    agGridReact.api.forEachNode(() => rowCount++);
    expect(rowCount).toEqual(testData.length);
  });

  it('selects all rows', () => {
    wrapper.find('#selectAll').simulate('click');

    // 1) querying the DOM
    const selectedRowsDOM = wrapper.render().find('.ag-center-cols-container .ag-row.ag-row-selected');
    expect(selectedRowsDOM.length).toEqual(testData.length);
    // 2) using the grid API
    const selectedRowsAPI = agGridReact.api.getSelectedRows();
    expect(selectedRowsAPI.length).toEqual(testData.length);

  });

  it('deselects all rows', () => {
    agGridReact.api.selectAll();
    wrapper.find('#deSelectAll').simulate('click');

    // 1) querying the DOM
    const selectedRowsDOM = wrapper.render().find('.ag-center-cols-container .ag-row:not(.ag-row-selected)');
    expect(selectedRowsDOM.length).toEqual(testData.length);
    // 2) using the grid API
    const selectedRowsAPI = agGridReact.api.getSelectedRows();
    expect(selectedRowsAPI.length).toEqual(0);
  });

  it('handles filtering', () => {
    let filterColId = 'make';
    let filterValue = 'Alfa Romeo';
    // simulating the filter button click will not work here 
    // because our button hard codes the params ('make','Porsche') to the filter handler
    wrapper.instance().filterHandler(filterColId, filterValue);

    // 1) querying the DOM
    expect(wrapper.render().find('.ag-header-cell-filtered').length).toEqual(1);
    // wrapper.render().find().forEach does not work for some reason
    // wrapper.find().forEach does work
    let filteredCells = wrapper.render().find(`.ag-center-cols-container .ag-cell[col-id="${filterColId}"]`)
    for (let i = 0; i < filteredCells.length; i++) {
      let cellText = filteredCells[i].children[0].data;
      expect(cellText).toEqual(filterValue)
    }

    // 2) using the grid API
    agGridReact.api.forEachNodeAfterFilter(node => {
      expect(node.data[filterColId]).toEqual(filterValue);
    });
  });

  it('clears filters', () => {
    let filterColId = 'make';
    let filterValue = 'Alfa Romeo';
    wrapper.instance().filterHandler(filterColId, filterValue);

    wrapper.find('#removeFilters').simulate('click');

    // 1) querying the DOM
    // wrapper.render().find().exists() does not work for some reason
    // wrapper.find().exists() does work
    expect(wrapper.render().find('.ag-header-cell-filtered').length).toEqual(0);

    // 2) using the grid API
    let filterModel = agGridReact.api.getFilterModel();
    expect(Object.keys(filterModel).length).toEqual(0);
  })

})


{/* <button id="selectAll" onClick={() => this.selectAllHandler(true)}>Select All Rows</button>
<button id="deSelectAll" onClick={() => this.selectAllHandler(false)}>Deselect All Rows</button>
<button id="filterByPorsche" onClick={() => this.filterHandler('make', 'Porsche')}>Filter By Porsche</button>
<button id="removeFilters" onClick={() => this.filterHandler(null, null)}>Remove All Filters</button>
<button id="sortByPriceAsc" onClick={() => this.sortHandler('price', 'asc')}>Sort By Price (asc)</button>
<button id="sortByPriceDesc" onClick={() => this.sortHandler('price', 'desc')}>Sort By Price (desc)</button>
<button id="removeSort" onClick={() => this.sortHandler(null)}>Remove All Sorting</button>
<button id="groupByModel" onClick={() => this.rowGroupHandler('model', true)}>Group By Model</button>
<button id="removeGrouping" onClick={() => this.rowGroupHandler('model', false)}>Ungroup Model</button>
<button id="hidePriceColumn" onClick={() => this.hideColumnHandler('price', true)}>Hide Price Column</button>
<button id="showPriceColumn" onClick={() => this.hideColumnHandler('price', false)}>Show Price Column</button> */}
