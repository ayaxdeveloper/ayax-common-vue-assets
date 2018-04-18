import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { SearchResponse } from 'ayax-common-types';

var mock = new MockAdapter(axios);

var searchResponse = new SearchResponse<any[]>();

searchResponse.data =  [{ id: 1, code: '123', title: 'Alpha', created: new Date()}];

searchResponse.total = 1;

mock.onPost('/listdialogtest/search').reply(200, 
    searchResponse
);