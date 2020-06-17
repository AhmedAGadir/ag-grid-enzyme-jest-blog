import React from 'react';
import App from './App';
import { AgGridReact } from 'ag-grid-react';
import { mount } from 'enzyme';

// jest.setTimeout(10000);

// ignore license errors
jest.spyOn(console, 'error').mockImplementation(() => { });

const testData = [
  { make: 'Alfa Romeo', model: 'A', price: 10000 },
  { make: 'BMW', model: 'B', price: 20000 },
  { make: 'Citroen', model: 'C', price: 30000 }
];

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
        resolve(wrapper);
        return;
      }
      setTimeout(waitForGridReady, 100);
    })();
  });
};

describe('Grid Actions Panel', () => {
  let wrapper = null;
  let agGridReact = null;

  const testFilterColId = 'make';
  const testFilterValue = 'Alfa Romeo';

  beforeEach((done) => {
    wrapper = mount(<App />);
    agGridReact = wrapper.find(AgGridReact).instance();

    ensureGridApiHasBeenSet(wrapper)
      .then(() => setRowData(wrapper, testData))
      .then(() => done());
  });

  afterEach(() => {
    wrapper.unmount();
    wrapper = null;
    agGridReact = null;
  })

  it('renders without crashing', () => {
    expect(wrapper.find('.app-component>.actions-panel').exists()).toBeTruthy();
    expect(wrapper.find('.app-component>.ag-theme-alpine').exists()).toBeTruthy();
  });

  it('renders test rows', () => {
    // 1) Querying the DOM
    // if you want to query the grid you'll need to use wrapper.render().find(); // dont know why
    // https://github.com/enzymejs/enzyme/issues/1233
    const gridRows = wrapper.render().find('.ag-center-cols-container .ag-row');
    const columns = wrapper.render().find('.ag-header-cell');
    for (let i = 0; i < gridRows.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        const colId = gridRows[i].children[j].attribs['col-id'];
        const cellText = gridRows[i].children[j].children[0].data;
        const testValue = testData[i][colId].toString();
        expect(cellText).toEqual(testValue);
      }
    }
    // 2) Using ag-Grid's API
    agGridReact.api.forEachNode((node, nodeInd) => {
      Object.keys(node.data).forEach(colId => {
        const cellValue = node.data[colId];
        const testValue = testData[nodeInd][colId];
        expect(cellValue).toEqual(testValue);
      })
    });
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
    const unselectedRowsDOM = wrapper.render().find('.ag-center-cols-container .ag-row:not(.ag-row-selected)');
    expect(unselectedRowsDOM.length).toEqual(testData.length);
    // 2) using the grid API
    const selectedRowsAPI = agGridReact.api.getSelectedRows();
    expect(selectedRowsAPI.length).toEqual(0);
  });

  it(`filters by ${testFilterColId} column, value: ${testFilterValue}`, () => {
    // simulating the filter button click will not work here since our button hard codes the params ('make','Porsche') to the filter handler
    wrapper.instance().filterHandler(testFilterColId, testFilterValue);

    // 1) querying the DOM
    const filteredCells = wrapper.render().find(`.ag-center-cols-container .ag-cell[col-id="${testFilterColId}"]`)
    for (let i = 0; i < filteredCells.length; i++) {
      const cellText = filteredCells[i].children[0].data;
      expect(cellText).toEqual(testFilterValue)
    }
    // 2) using the grid API
    agGridReact.api.forEachNodeAfterFilter(node => {
      expect(node.data[testFilterColId]).toEqual(testFilterValue);
    });
  });

  it('clears filters', () => {
    wrapper.instance().filterHandler(testFilterColId, testFilterValue);
    wrapper.find('#removeFilters').simulate('click');

    // 1) querying the DOM
    // grid displays a filter icon in columns that are currently filtering
    expect(wrapper.render().find('.ag-header-cell-filtered').length).toEqual(0);
    // 2) using the grid API
    const filterModel = agGridReact.api.getFilterModel();
    expect(Object.keys(filterModel).length).toEqual(0);
  })

  it('Sorts by Price: ascending', () => {
    const sortedAscTestData = testData.sort((a, b) => a.price - b.price);
    wrapper.find('#sortByPriceAsc').simulate('click');

    // 1) querying the DOM
    const gridRows = wrapper.render().find('.ag-center-cols-container .ag-row');
    for (let i = 0; i < gridRows.length; i++) {
      const cellText = gridRows[i].children[2].children[0].data;
      const testValue = testData[i]['price'].toString();
      expect(cellText).toEqual(testValue);
    }
    // 2) using the grid API
    agGridReact.api.forEachNodeAfterFilterAndSort((node, ind) => {
      expect(node.data.price).toEqual(sortedAscTestData[ind].price);
    });
  })

  it('Sorts by Price: descending', () => {
    const sortedDescTestData = testData.sort((a, b) => b.price - a.price);
    wrapper.find('#sortByPriceDesc').simulate('click');

    // 1) querying the DOM
    const gridRows = wrapper.render().find('.ag-center-cols-container .ag-row');
    for (let i = 0; i < gridRows.length; i++) {
      const cellText = gridRows[i].children[2].children[0].data;
      const testValue = testData[i]['price'].toString();
      expect(cellText).toEqual(testValue);
    }
    // 2) using the grid API
    agGridReact.api.forEachNodeAfterFilterAndSort((node, ind) => {
      expect(node.data.price).toEqual(sortedDescTestData[ind].price);
    });
  })

  it('Removes all sorting', () => {
    wrapper.find('#removeSort').simulate('click');

    // 1) querying the DOM
    const columns = wrapper.render().find('.ag-header-cell');
    expect(wrapper.render().find('.ag-header-cell-sorted-none').length).toEqual(columns.length);
    // 2) using the grid API
    const sortModel = agGridReact.api.getSortModel();
    expect(Object.keys(sortModel).length).toEqual(0);
  })
})
