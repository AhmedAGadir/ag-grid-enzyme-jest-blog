import React from 'react';
import App from './App';
import { AgGridReact } from 'ag-grid-react';
import { mount, shallow } from 'enzyme';

jest.setTimeout(10000);

// ignore license errors
jest.spyOn(console, 'error').mockImplementation(() => { });

const ensureGridApiHasBeenSet = (component) => {
  return new Promise(function (resolve, reject) {
    (function waitForGridReady() {
      if (component.instance().gridApi) {
        return resolve();
      }
      setTimeout(waitForGridReady, 100);
    })();
  });
};

let wrapper = null;
let agGridReact = null;
let testData = [{ make: 'test', model: 'test1', price: 'test2' }];

describe('Grid Actions Panel', () => {

  beforeEach((done) => {
    wrapper = mount(<App />);
    // wrapper = shallow(<App />);
    // wrapper.setState({ rowData: testData });
    // wrapper.update();
    agGridReact = wrapper.find(AgGridReact).instance();

    ensureGridApiHasBeenSet(wrapper)
      .then(() => done());
  });

  afterEach(() => {
    wrapper.setState({ rowData: null })
    wrapper.unmount();
    wrapper = null;
    agGridReact = null;
  })

  it('renders without crashing', () => {
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('.ag-theme-alpine').exists()).toBe(true);
  });

  it('renders rows', () => {
    expect(wrapper.find('.ag-row').exists()).toBe(true);
    expect(wrapper.find('.ag-row').length).not.toEqual(0);
  })

  // it('renders test rows', () => {
  //   wrapper.setState({ rowData: testData }, () => {
  //     // console.log(wrapper.debug())
  //     // console.log(wrapper.html());
  //     expect(wrapper.find('.ag-row').length).not.toEqual(0);
  //     // expect(wrapper.find('.ag-row').length).not.toEqual(0);
  //     // expect(wrapper.find('.ag-row').length).toEqual(0);
  //   });
  // });

  // it('selects all rows', (done) => {
  //   console.log('wrapper.find("#selectAll")', wrapper.find('#selectAll'))
  //   wrapper.find('#selectAll').simulate('click');

  //   setTimeout(() => {


  //     // approach 1) by querying the DOM
  //     expect(wrapper.find('.ag-row').length).toBe(testData.length);
  //     // expect(wrapper.find('.ag-row.ag-row-selected')).toEqual([]);
  //     // expect(wrapper.find('.ag-row:not(.ag-row-selected)').length).toEqual(0);
  //     // expect(wrapper.find('.ag-row.ag-row-selected').length).toEqual(testData.length);
  //     // approach 2) using the grid API
  //     // expect(agGridReact.api.getSelectedRows().length).toEqual(0);


  //     done();
  //   }
  //     , 1000);

  // });


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
