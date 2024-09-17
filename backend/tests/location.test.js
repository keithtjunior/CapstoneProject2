'use strict';

const axios = require('axios');
const Location = require('../models/location');

jest.mock('axios');

const { 
    placeId,
    faunae,
    locationParams,
    mockNoFaunaResponse,
    mockErrorUnprocessableEntityResponse,
    mockLocationResponse,
    mockLocationNameResponse,
    mockNoLocationResponse
} = require('./_testCommon');

// jest.setTimeout(60000);

// mocks Math.random value
beforeEach(function() {
    jest
    .spyOn(Math, 'random')
    .mockReturnValue(.5);
});

afterEach(function() {
    jest.resetAllMocks();
    jest.clearAllMocks();
    Math.random.mockRestore();
});

/************************************** get */

describe('get', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockLocationNameResponse);
        const res = await Location.get(locationParams);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Location);
        expect(typeof res[0].id).toBe('number');
        expect(typeof res[0].name).toBe('string');
    });
    test('works: inner method calls', async () => {
        const mockBuildUrl = jest.spyOn(Location, 'buildUrl');
        const mockCreateLocation = jest.spyOn(Location, 'createLocation');
        axios.get.mockResolvedValueOnce(mockLocationNameResponse);
        await Location.get(locationParams);
        expect(mockBuildUrl).toHaveBeenCalled();
        expect(mockCreateLocation).toHaveBeenCalled();
        mockBuildUrl.mockRestore();
        mockCreateLocation.mockRestore();
    });
    test('works: missing parameters', async () => {
        axios.get.mockResolvedValueOnce(mockLocationNameResponse);
        const res = await Location.get({name: 'Australia'});
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Location);
    });
    test('works: invalid parameters', async () => {
        axios.get.mockResolvedValueOnce(mockNoLocationResponse);
        const res = await Location.get({swlat: 'a', nelat: 'b'});
        expect(res).toEqual([]);
    });
    test('works: invalid parameter', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Location.get(123);
        expect(res).toEqual([]);
    });
});

/************************************** getById */

describe('getById', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockLocationResponse);
        const res = await Location.getById(placeId);
        expect(res).toBeInstanceOf(Location);
        expect(typeof res.id).toBe('number');
        expect(typeof res.name).toBe('string');
    });
    test('works: inner method calls', async () => {
        const mockBuildUrl = jest.spyOn(Location, 'buildUrl');
        const mockCreateLocation = jest.spyOn(Location, 'createLocation');
        axios.get.mockResolvedValueOnce(mockLocationResponse);
        await Location.getById(placeId);
        expect(mockBuildUrl).toHaveBeenCalled();
        expect(mockCreateLocation).toHaveBeenCalled();
        mockBuildUrl.mockRestore();
        mockCreateLocation.mockRestore();
    });
    test('works: no such id', async () => {
        axios.get.mockResolvedValueOnce(mockNoLocationResponse);
        const res = await Location.getById(999999999999999);
        expect(res).toBeUndefined();
    });
    test('fails: invalid id', async () => {
        try {
            axios.get.mockRejectedValueOnce(mockErrorUnprocessableEntityResponse);
            await Location.getById('number');
        } catch (err) {
            expect(err.response.status).toBe(422);
        }
    });
});

/************************************** getByTerm */

describe('getByTerm', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockLocationResponse);
        const res = await Location.getByTerm('australia');
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Location);
        expect(typeof res[0].id).toBe('number');
        expect(typeof res[0].name).toBe('string');
    });
    test('works: inner method calls', async () => {
        const mockBuildUrl = jest.spyOn(Location, 'buildUrl');
        const mockCreateLocation = jest.spyOn(Location, 'createLocation');
        axios.get.mockResolvedValueOnce(mockLocationResponse);
        await Location.getByTerm('australia');
        expect(mockBuildUrl).toHaveBeenCalled();
        expect(mockCreateLocation).toHaveBeenCalled();
        mockBuildUrl.mockRestore();
        mockCreateLocation.mockRestore();
    });
    test('works: none found', async () => {
        axios.get.mockResolvedValueOnce(mockNoLocationResponse);
        const res = await Location.getByTerm('1234');
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
    test('works: invalid parameter', async () => {
        axios.get.mockResolvedValueOnce(mockNoLocationResponse);
        const res = await Location.getByTerm(null);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
});


/************************************** helper functions */

describe('getLocations', () => {
    test('returns Location object with valid search term', async () => {
        axios.get.mockResolvedValueOnce(mockLocationResponse);
        let res = await Location.getLocations('australia');
        expect(res).toBeInstanceOf(Location);
        expect(typeof res.id).toBe('number');
        expect(typeof res.name).toBe('string');
    });
    test('returns undefined if given search term not found', async () => {
        axios.get.mockResolvedValueOnce(mockNoLocationResponse);
        let res = await Location.getLocations('1234');
        expect(res).toBeUndefined();
    });
    test('returns undefined if search term invalid', async () => {
        axios.get.mockResolvedValueOnce(mockNoLocationResponse);
        let res = await Location.getLocations({});
        expect(res).toBeUndefined();
    });
    test('inner method calls', async () => {
        const mockBuildUrl = jest.spyOn(Location, 'buildUrl');
        axios.get.mockResolvedValueOnce(mockLocationResponse);
        await Location.getLocations('australia');
        expect(mockBuildUrl).toHaveBeenCalled();
        mockBuildUrl.mockRestore();
    });
});

describe('createLocation', () => {
    test('returns array of Location objects from given item values', () => {
        const items = mockLocationNameResponse.data.results.standard;
        expect(Array.isArray(Location.createLocation(items))).toBeTruthy();
        expect(Location.createLocation(items)[0]).toBeInstanceOf(Location);
        expect(Location.createLocation(items)[0].id).toEqual(7308);
        expect(Location.createLocation(items)[0].name).toEqual('Queensland');
        expect(Location.createLocation(items)[1]).toBeInstanceOf(Location);
        expect(Location.createLocation(items)[1].id).toEqual(6744);
        expect(Location.createLocation(items)[1].name).toEqual('Australia');
    });
    test('returns empty array if given empty array', () => {
        expect(Location.createLocation([])).toEqual([]);
    });
    test('returns empty array if given invalid parameter', () => {
        expect(Location.createLocation(1)).toEqual([]);
    });
});

describe('buildUrl', () => {
    const subdirectory = 'subdirectory';
    const path = 'path';
    const params = { 
        name: 'Australia',
        nelat: -20.917574,
        nelng: 142.702789,
        swlat: -20.917574,
        swlng: 142.702789 
    };
    test('builds URL based on given parameters', () => {
        expect(Location.buildUrl(subdirectory, path, params)).toEqual('https://api.inaturalist.org/v1/subdirectory/path?verifiable=any&spam=false&order=desc&name=Australia&nelat=-20.917574&nelng=142.702789&swlat=-20.917574&swlng=142.702789');
    });
    test('builds URL given no values', () => {
        expect(Location.buildUrl()).toEqual('https://api.inaturalist.org/v1');
    });
    test('builds URL given invalid parameters', () => {
        expect(Location.buildUrl(path, params)).toEqual('https://api.inaturalist.org/v1');
    });
    test('builds URL given invalid parameters', () => {
        expect(Location.buildUrl(subdirectory, path, 3)).toEqual('https://api.inaturalist.org/v1/subdirectory/path?verifiable=any&spam=false&order=desc');
    });
    test('inner method calls', async () => {
        const mockListParamatersInUrl = jest.spyOn(Location, 'listParamatersInUrl');
        Location.buildUrl(subdirectory, path, params);
        expect(mockListParamatersInUrl).toHaveBeenCalled();
        mockListParamatersInUrl.mockRestore();
    });
});

describe('listParamatersInUrl', () => {
    test('convert object keys and values into formatted string for URL parameters', () => {
        const params = { name: 'Queensland', lat: -22.4132068728, lng: 144.6040528539 };
        expect(Location.listParamatersInUrl(params)).toEqual('&name=Queensland&lat=-22.4132068728&lng=144.6040528539');
    });
    test('convert empty object into empty string', () => {
        const params = {};
        expect(Location.listParamatersInUrl(params)).toEqual('');
    });
    test('returns empty string if given invalid parameter', () => {
        expect(Location.listParamatersInUrl(1)).toEqual('');
    });
});

describe('formatFaunaPhotos', () => {
    test('return array of object(s) from given data values', () => {
        expect(Location.formatFaunaPhotos(faunae)).toEqual([
            {'name': 'name_1', 'url': 'url_1'}, 
            {'name': 'name_2', 'url': 'url_2'}
        ]);
    });
    test('return empty array given invalid data values', () => {
        expect(Location.formatFaunaPhotos([{ invalid: null, photos: [] }])).toEqual([]);
    });
    test('return empty array given invalid data type', () => {
        expect(Location.formatFaunaPhotos(3)).toEqual([]);
    });
});

describe('createTaxa', () => {
    test('return array of taxonomy names from given array of objects (faunae)', () => {
        expect(Location.createTaxa(faunae)).toEqual(['taxon_1', 'taxon_2']);
    });
    test('return empty array given invalid object values', () => {
        expect(Location.createTaxa([1, {id: 2}])).toEqual([]);
    });
    test('return empty array given invalid parameter', () => {
        expect(Location.createTaxa(3)).toEqual([]);
    });
});

describe('createFaunae', () => {
    test('returns array of Fauna objects', () => {
        expect(Array.isArray(Location.createFaunae(faunae))).toBeTruthy();
        expect(Location.createFaunae(faunae)[0]).toBeInstanceOf(Object);
        expect(Location.createFaunae(faunae)[0].id).toEqual(1);
        expect(Location.createFaunae(faunae)[0].name).toEqual('name_1');
        expect(Location.createFaunae(faunae)[1]).toBeInstanceOf(Object);
        expect(Location.createFaunae(faunae)[1].id).toEqual(2);
        expect(Location.createFaunae(faunae)[1].name).toEqual('name_2');
    });
    test('returns empty array if given empty array', () => {
        expect(Location.createFaunae([])).toEqual([]);
    });
    test('returns empty array if given invalid parameter', () => {
        expect(Location.createFaunae(1)).toEqual([]);
    });
    test('inner method calls', async () => {
        const mockFormatFaunaPhotos = jest.spyOn(Location, 'formatFaunaPhotos');
        Location.createFaunae(faunae);
        expect(mockFormatFaunaPhotos).toHaveBeenCalled();
        mockFormatFaunaPhotos.mockRestore();
    });
});