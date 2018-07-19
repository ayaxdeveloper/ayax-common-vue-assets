import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { OperationResult } from "ayax-common-operation";
import { SearchResponse } from "ayax-common-types";
import TestDataService from "./Services/TestDataService/TestDataService";

const mock = new MockAdapter(axios, { delayResponse: 2000 });
const testDataService = new TestDataService();
const searchResponse = new SearchResponse<any[]>();

mock.onGet("/api/dictionary/list").reply(({data}) => {
    return [200, new OperationResult<any[]>({
        status: 0,
        result: testDataService.getDictionary()
    })];
});

mock.onPost("/api/testentity/search").reply(({data}) => {
    searchResponse.total = testDataService.getData().length;
    data = JSON.parse(data);
    searchResponse.data = testDataService.getPage(data.page, data.perPage);

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
});

mock.onPost("/api/testentity/add").reply(({data}) => {
    testDataService.add(JSON.parse(data));
    return [200, new OperationResult({ status: 0 })];
});

mock.onGet(/\/api\/testentity\/get\/\d+/).reply((config) => {
    const id = +config.url.substring(config.url.lastIndexOf("/") + 1);
    return [200, new OperationResult({ status: 0, result: testDataService.getById(id)})];
});

mock.onPut(/\/api\/testentity\/update\/\d+/).reply((config) => {
    const id = +config.url.substring(config.url.lastIndexOf("/") + 1);
    testDataService.edit(id, JSON.parse(config.data));
    return [200, new OperationResult({ status: 0 })];
});

mock.onDelete(/\/api\/testentity\/delete\/\d+/).reply((config) => {
    const id = +config.url.substring(config.url.lastIndexOf("/") + 1);
    testDataService.remove(id);
    return [200, new OperationResult({ status: 0 })];
});

mock.onPost("/api/testentity/bulkdelete").reply(({data}) => {
    testDataService.bulkDelete(JSON.parse(data));
    return [200, new OperationResult({ status: 0 })];
});