import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { OperationResult } from "ayax-common-operation";
import { SearchResponse } from "ayax-common-types";
import TestDataService from "./Services/TestDataService/TestDataService";

const mock = new MockAdapter(axios, { delayResponse: 1000 });
const testDataService = new TestDataService();
const searchResponse = new SearchResponse<any[]>();

mock
.onGet("/api/dictionary/list").reply((response) => {
    console.log(response);
    return [200, new OperationResult<any[]>({
        status: 0,
        result: testDataService.getDictionary()
    })];
})
.onPost("/api/testentity/search").reply((response) => {
    console.log(response);
    searchResponse.total = testDataService.getData().length;
    const data = JSON.parse(response.data);
    searchResponse.data = testDataService.getPage(data.page, data.rowsPerPage);

    if (data.titlesort !== undefined) {
        searchResponse.data = testDataService.sortData(searchResponse.data, data.titlesort.isdesc);
    }
    if (data.titlefilter !== undefined) {
        const result = testDataService.filterByTitle(data.titlefilter.val.value.substring(1, data.titlefilter.val.value.length - 1));
        searchResponse.data = result;
        searchResponse.total = result.length;
    }
    if (data.titlesort !== undefined && data.titlefilter !== undefined) {
        const result = testDataService.sortData(
            testDataService.filterByTitle(data.titlefilter.val.value.substring(1, data.titlefilter.val.value.length - 1)), 
            data.titlesort.isdesc);

        searchResponse.data = result;
        searchResponse.total = result.length;
    }
    return [200, new OperationResult<SearchResponse<any[]>>({
        status: 0,
        result: searchResponse,
    })];
})
.onPost("/api/testentity/add").reply((response) => {
    console.log(response);
    testDataService.add(JSON.parse(response.data));
    return [200, new OperationResult({ status: 0 })];
})
.onGet(/\/api\/testentity\/get\/\d+/).reply((response) => {
    console.log(response);
    const id = +response.url.substring(response.url.lastIndexOf("/") + 1);
    return [200, new OperationResult({ status: 0, result: testDataService.getById(id)})];
})
.onPut(/\/api\/testentity\/update\/\d+/).reply((response) => {
    console.log(response);
    const id = +response.url.substring(response.url.lastIndexOf("/") + 1);
    testDataService.edit(id, JSON.parse(response.data));
    return [200, new OperationResult({ status: 0 })];
})
.onDelete(/\/api\/testentity\/delete\/\d+/).reply((response) => {
    console.log(response);
    const id = +response.url.substring(response.url.lastIndexOf("/") + 1);
    testDataService.remove(id);
    return [200, new OperationResult({ status: 0 })];
})
.onPost("/api/testentity/bulkdelete").reply((response) => {
    console.log(response);
    testDataService.bulkDelete(JSON.parse(response.data));
    return [200, new OperationResult({ status: 0 })];
})
.onAny().reply((response) => {
    console.error(`Uncatched mock url ${response.url}`);
    return [500];
});