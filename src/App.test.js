import React from 'react';
import App from './App';
import { AgGridReact } from 'ag-grid-react';
import { mount } from 'enzyme';

// increase retry time? 
jest.setTimeout(10000);

// ignore license errors
jest.spyOn(console, 'error').mockImplementation(() => { });

const rowData = [
  { make: 'Alfa Romeo', model: 'A', price: 10000 },
  { make: 'BMW', model: 'B', price: 20000 },
  { make: 'Citroen', model: 'C', price: 30000 }
];

// loading in mock data so that we've decoupled our tests from our endpoint 
const renderTestRows = (component, rowData) => {
  return new Promise(function (resolve, reject) {
    component.setState({ rowData }, () => {
      component.update();
      resolve();
    });
  })
}

const ensureGridApiHasBeenSet = (component) => {
  return new Promise(function (resolve, reject) {
    (function waitForGridReady() {
      if (component.instance().gridApi) {
        return resolve(component);
      }
      setTimeout(waitForGridReady, 100);
    })();
  });
};

let wrapper = null;
let agGridReact = null;

describe('Grid Actions Panel', () => {

  beforeEach((done) => {
    wrapper = mount(<App />);
    agGridReact = wrapper.find(AgGridReact).instance();

    ensureGridApiHasBeenSet(wrapper)
      .then((wrapper) => renderTestRows(wrapper, rowData))
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
    // 1) By querying the DOM
    // note: if you want to query the grid you'll need to use wrapper.render().find(); 
    // im guessing some magic happens when render is executed
    expect(wrapper.render().find('.ag-center-cols-container .ag-row').length).toEqual(3);
    // 2) Using ag-Grid's API
    let rowCount = 0;
    agGridReact.api.forEachNode(() => rowCount++);
    expect(rowCount).toEqual(3);
  });

  it('selects all rows', () => {
    wrapper.find('#selectAll').simulate('click');

    // approach 1) by querying the DOM
    expect(wrapper.render().find('.ag-center-cols-container .ag-row.ag-row-selected').length).toEqual(rowData.length);
    // approach 2) using the grid API
    expect(agGridReact.api.getSelectedRows().length).toEqual(rowData.length);

  });


  // it('selects all rows 2', () => {
  //   wrapper.find('#selectAll').simulate('click');

  //   // approach 1) by querying the DOM
  //   expect(wrapper.find('.ag-row:not(.ag-row-selected)').length).toEqual(0);
  //   expect(wrapper.find('.ag-row.ag-row-selected').length).toEqual(testData.length);
  //   // approach 2) using the grid API
  //   expect(agGridReact.api.getSelectedRows().length).toEqual(0);
  // });


  // it('deselects all rows', () => {
  //   // wrapper.instance().gridApi.selectAll();
  //   // agGridReact.api.selectAll();

  //   // wrapper.find('#deSelectAll').simulate('click');
  //   expect(true).toEqual(true);

  //   // expect(wrapper.find('.ag-row.ag-row-selected').length).toEqual(0);
  //   // expect(agGridReact.api.getSelectedRows().length).toEqual(0);
  // });

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
