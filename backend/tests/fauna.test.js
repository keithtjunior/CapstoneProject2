'use strict';

const axios = require('axios');
const Fauna = require('../models/fauna');
const Location = require('../models/location');

jest.mock('axios');

const { 
    id,
    faunae,
    continentIds,
    mockFaunaResponse, 
    mockAllFaunaResponse,
    mockAllObservationsResponse,
    mockNoFaunaResponse,
    mockErrorNotFoundResponse,
    mockErrorUnprocessableEntityResponse
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
        axios.get.mockResolvedValueOnce(mockFaunaResponse);
        const res = await Fauna.get(id);
        expect(res).toBeInstanceOf(Object);
        expect(typeof res.id).toBe('number');
        expect(typeof res.name).toBe('string');
    });
    test('works: no such id', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.get(999999999999999);
        expect(res).toBeUndefined();
    });
    test('fails: invalid id', async () => {
        try {
            axios.get.mockRejectedValueOnce(mockErrorUnprocessableEntityResponse);
            await Fauna.get('number');
        } catch (err) {
            expect(err.response.status).toBe(422);
        }
    });
});

/************************************** getFauna */

describe('getFauna', () => {

    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockFaunaResponse);
        const res = await Fauna.getFauna(id);
        expect(res).toBeInstanceOf(Fauna);
        expect(typeof res.id).toBe('number');
        expect(typeof res.name).toBe('string');
        expect(Array.isArray(res.photos)).toBeTruthy();
        expect(Array.isArray(res.locations)).toBeTruthy();
    });
    test('works: inner method calls', async () => {
        const mockCreateFaunaPlaceArrays = jest.spyOn(Fauna, 'createFaunaPlaceArrays');
        const mockCreateFaunae = jest.spyOn(Fauna, 'createFaunae');
        axios.get.mockResolvedValueOnce(mockFaunaResponse);
        await Fauna.getFauna(id);
        expect(mockCreateFaunaPlaceArrays).toHaveBeenCalled();
        expect(mockCreateFaunae).toHaveBeenCalled();
        mockCreateFaunaPlaceArrays.mockRestore();
        mockCreateFaunae.mockRestore();
    });
    test('works: no such id', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.getFauna(999999999999999);
        expect(res).toBeUndefined();
    });
    test('fails: invalid id', async () => {
        try {
            axios.get.mockRejectedValueOnce(mockErrorUnprocessableEntityResponse);
            await Fauna.getFauna('number');
        } catch (err) {
            expect(err.response.status).toBe(422);
        }
    });
});

/************************************** findAll */

describe('findAll', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockAllFaunaResponse);
        const res = await Fauna.findAll('dolphin');
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Fauna);
        expect(typeof res[0].id).toBe('number');
        expect(typeof res[0].name).toBe('string');
        expect(Array.isArray(res[0].photos)).toBeTruthy();
        expect(Array.isArray(res[0].locations)).toBeTruthy();
    });
    test('works: inner method calls', async () => {
        const mockListTaxaIdsWithCommas = jest.spyOn(Fauna, 'listTaxaIdsWithCommas');
        const mockBuildUrl = jest.spyOn(Fauna, 'buildUrl');
        axios.get.mockResolvedValueOnce(mockAllFaunaResponse);
        await Fauna.findAll('dolphin');
        expect(mockListTaxaIdsWithCommas).toHaveBeenCalled();
        expect(mockBuildUrl).toHaveBeenCalled();
        mockListTaxaIdsWithCommas.mockRestore();
        mockBuildUrl.mockRestore();
    });
    test('works: none found', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findAll('1234');
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
    test('works: invalid parameter', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findAll(null);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
});

/************************************** findAllAuto */

describe('findAllAuto', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockAllFaunaResponse);
        const res = await Fauna.findAllAuto('dolphin');
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Fauna);
        expect(typeof res[0].id).toBe('number');
        expect(typeof res[0].name).toBe('string');
        expect(Array.isArray(res[0].photos)).toBeTruthy();
        expect(Array.isArray(res[0].locations)).toBeTruthy();
    });
    test('works: inner method calls', async () => {
        const mockListTaxaIdsWithCommas = jest.spyOn(Fauna, 'listTaxaIdsWithCommas');
        const mockBuildUrl = jest.spyOn(Fauna, 'buildUrl');
        axios.get.mockResolvedValueOnce(mockAllFaunaResponse);
        await Fauna.findAllAuto('dolphin');
        expect(mockListTaxaIdsWithCommas).toHaveBeenCalled();
        expect(mockBuildUrl).toHaveBeenCalled();
        mockListTaxaIdsWithCommas.mockRestore();
        mockBuildUrl.mockRestore();
    });
    test('works: none found', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findAllAuto('1234');
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
    test('works: invalid parameter', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findAllAuto(null);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
});

/************************************** findByContinent */

describe('findByContinent', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockAllObservationsResponse);
        const res = await Fauna.findByContinent(continentIds);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Fauna);
        expect(typeof res[0].id).toBe('number');
        expect(typeof res[0].name).toBe('string');
        expect(Array.isArray(res[0].photos)).toBeTruthy();
        expect(Array.isArray(res[0].locations)).toBeTruthy();
    });
    test('works: inner method calls', async () => {
        const mockListTaxaIdsWithCommas = jest.spyOn(Fauna, 'listTaxaIdsWithCommas');
        const mockGetRandomItem = jest.spyOn(Fauna, 'getRandomItem');
        const mockBuildUrl = jest.spyOn(Fauna, 'buildUrl');
        axios.get.mockResolvedValueOnce(mockAllObservationsResponse);
        await Fauna.findByContinent(continentIds);
        expect(mockListTaxaIdsWithCommas).toHaveBeenCalled();
        expect(mockGetRandomItem).toHaveBeenCalled();
        expect(mockBuildUrl).toHaveBeenCalled();
        mockListTaxaIdsWithCommas.mockRestore();
        mockGetRandomItem.mockRestore();
        mockBuildUrl.mockRestore();
    });
    test('works: none found', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findByContinent(['yttuf']);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
    test('works: invalid parameter', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findByContinent({});
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
});

/************************************** findByPlace */

describe('findByPlace', () => {
    test('works', async () => {
        axios.get.mockResolvedValueOnce(mockAllObservationsResponse);
        const lat = -20.917574;
        const lng = 142.702789;
        const res = await Fauna.findByPlace(lat, lng);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res[0]).toBeInstanceOf(Fauna);
        expect(typeof res[0].id).toBe('number');
        expect(typeof res[0].name).toBe('string');
        expect(Array.isArray(res[0].photos)).toBeTruthy();
        expect(Array.isArray(res[0].locations)).toBeTruthy();
    });
    test('works: inner method calls', async () => {
        const mockListTaxaIdsWithCommas = jest.spyOn(Fauna, 'listTaxaIdsWithCommas');
        const mockIsAllNumeric = jest.spyOn(Fauna, 'isAllNumeric');
        const mockCreateFaunae = jest.spyOn(Fauna, 'createFaunae');
        const mockCreateTaxa = jest.spyOn(Fauna, 'createTaxa');
        const mockBuildUrl = jest.spyOn(Fauna, 'buildUrl');
        const lat = -20.917574;
        const lng = 142.702789;
        axios.get.mockResolvedValueOnce(mockAllObservationsResponse);
        await Fauna.findByPlace(lat, lng);
        expect(mockListTaxaIdsWithCommas).toHaveBeenCalled();
        expect(mockIsAllNumeric).toHaveBeenCalled();
        expect(mockCreateFaunae).toHaveBeenCalled();
        expect(mockCreateTaxa).toHaveBeenCalled();
        expect(mockBuildUrl).toHaveBeenCalled();
        mockListTaxaIdsWithCommas.mockRestore();
        mockIsAllNumeric.mockRestore();
        mockCreateFaunae.mockRestore();
        mockCreateTaxa.mockRestore();
        mockBuildUrl.mockRestore();
    });
    test('works: invalid parameter', async () => {
        axios.get.mockResolvedValueOnce(mockNoFaunaResponse);
        const res = await Fauna.findByPlace({}, 'lng', []);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res).toEqual([]);
    });
});

/************************************** helper methods */

describe('listTaxaIdsWithCommas', () => {
    test('convert object values into a string separated by commas', () => {
        const obj = { one: '1', two: '2', three: '3' };
        expect(Fauna.listTaxaIdsWithCommas(obj)).toEqual('1,2,3');
    });
    test('convert empty object into empty string', () => {
        const obj = {};
        expect(Fauna.listTaxaIdsWithCommas(obj)).toEqual('');
    });
});

describe('listParamatersInUrl', () => {
    test('convert object keys and values into formatted string for URL parameters', () => {
        const params = { id: '1', taxon: 'mammalia' };
        expect(Fauna.listParamatersInUrl(params)).toEqual('&id=1&taxon=mammalia');
    });
    test('convert empty object into empty string', () => {
        const params = {};
        expect(Fauna.listParamatersInUrl(params)).toEqual('');
    });
});

describe('buildUrl', () => {
    const subdirectory = 'subdirectory';
    const path = 'path';
    const params = { id: '1', taxon: 'mammalia' };
    test('builds URL based on given parameters', () => {
        expect(Fauna.buildUrl(subdirectory, path, params)).toEqual('https://api.inaturalist.org/v1/subdirectory/path?verifiable=any&spam=false&order=desc&id=1&taxon=mammalia');
    });
    test('builds URL given no values', () => {
        expect(Fauna.buildUrl()).toEqual('https://api.inaturalist.org/v1');
    });
    test('builds URL given invalid parameters', () => {
        expect(Fauna.buildUrl(path, params)).toEqual('https://api.inaturalist.org/v1');
    });
    test('builds URL given invalid parameters', () => {
        expect(Fauna.buildUrl(subdirectory, path, 3)).toEqual('https://api.inaturalist.org/v1/subdirectory/path?verifiable=any&spam=false&order=desc');
    });
    test('inner method calls', async () => {
        const mockListParamatersInUrl = jest.spyOn(Fauna, 'listParamatersInUrl');
        Fauna.buildUrl(subdirectory, path, params);
        expect(mockListParamatersInUrl).toHaveBeenCalled();
        mockListParamatersInUrl.mockRestore();
    });
});

describe('formatFaunaPhotos', () => {
    test('return array of object(s) from given data values', () => {
        expect(Fauna.formatFaunaPhotos(faunae)).toEqual([
            {'name': 'name_1', 'url': 'url_1'}, 
            {'name': 'name_2', 'url': 'url_2'}
        ]);
    });
    test('return empty array given invalid data values', () => {
        expect(Fauna.formatFaunaPhotos([{ invalid: null, photos: [] }])).toEqual([]);
    });
    test('return empty array given invalid data type', () => {
        expect(Fauna.formatFaunaPhotos(3)).toEqual([]);
    });
});

describe('createTaxa', () => {
    test('return array of taxonomy names from given array of objects (faunae)', () => {
        expect(Fauna.createTaxa(faunae)).toEqual(['taxon_1', 'taxon_2']);
    });
    test('return empty array given invalid object values', () => {
        expect(Fauna.createTaxa([1, {id: 2}])).toEqual([]);
    });
    test('return empty array given invalid parameter', () => {
        expect(Fauna.createTaxa(3)).toEqual([]);
    });
});

describe('getRandomItem', () => {
    const arr = ['one', 'two', 'three'];
    test('returns random item from given array', () => {
        expect(Fauna.getRandomItem(arr)).toEqual('two');
    });
    test('returns empty string if given empty array', () => {
        expect(Fauna.getRandomItem([])).toEqual('');
    });
    test('returns empty string if given invalid parameter', () => {
        expect(Fauna.getRandomItem({})).toEqual('');
    });
});

describe('isAllNumeric', () => {
    const arr = [1,2,3];
    test('returns true if given array contains all numeric values', () => {
        expect(Fauna.isAllNumeric(arr)).toBeTruthy();
    });
    test('returns false if given array contains non-numeric value', () => {
        expect(Fauna.isAllNumeric(['a', 'b', 'c'])).not.toBeTruthy();
    });
    test('returns false with invalid parameter', () => {
        expect(Fauna.isAllNumeric({})).not.toBeTruthy();
    });
});

describe('createFaunae', () => {
    test('returns array of Fauna objects', () => {
        expect(Array.isArray(Fauna.createFaunae(faunae))).toBeTruthy();
        expect(Fauna.createFaunae(faunae)[0]).toBeInstanceOf(Fauna);
        expect(Fauna.createFaunae(faunae)[0].id).toEqual(1);
        expect(Fauna.createFaunae(faunae)[0].name).toEqual('name_1');
        expect(Fauna.createFaunae(faunae)[1]).toBeInstanceOf(Fauna);
        expect(Fauna.createFaunae(faunae)[1].id).toEqual(2);
        expect(Fauna.createFaunae(faunae)[1].name).toEqual('name_2');
    });
    test('returns empty array if given empty array', () => {
        expect(Fauna.createFaunae([])).toEqual([]);
    });
    test('returns empty array if given invalid parameter', () => {
        expect(Fauna.createFaunae(1)).toEqual([]);
    });
    test('inner method calls', async () => {
        const mockFormatFaunaPhotos = jest.spyOn(Fauna, 'formatFaunaPhotos');
        Fauna.createFaunae(faunae);
        expect(mockFormatFaunaPhotos).toHaveBeenCalled();
        mockFormatFaunaPhotos.mockRestore();
    });
});

describe('createFaunaPlaceArrays', () => {
    test('returns object of place arrays (location, observations, taxaListings)', async () => {
        let res = await Fauna.createFaunaPlaceArrays(faunae[0]);
        expect(res).toBeInstanceOf(Object);
        expect(Array.isArray(res.locations)).toBeTruthy();
        expect(Array.isArray(res.taxaListings)).toBeTruthy();
        expect(Array.isArray(res.observations)).toBeTruthy();
    });
    test('returns object of empty arrays given empty item parameter', async () => {
        let res = await Fauna.createFaunaPlaceArrays({});
        expect(res).toEqual({ locations: [], observations: [], taxaListings: [] });
    });
    test('returns object of empty arrays given invalid parameter', async () => {
        let res = await Fauna.createFaunaPlaceArrays(1);
        expect(res).toEqual({ locations: [], observations: [], taxaListings: [] });
    });
    test('inner method calls', async () => {
        const mockGetLocations = jest.spyOn(Location, 'getLocations');
        const mockGetObservations = jest.spyOn(Fauna, 'getObservations');
        await Fauna.createFaunaPlaceArrays(faunae[0]);
        expect(mockGetLocations).toHaveBeenCalled();
        expect(mockGetObservations).toHaveBeenCalled();
        mockGetLocations.mockRestore();
        mockGetObservations.mockRestore();
    });
});
