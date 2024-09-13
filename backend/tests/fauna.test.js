'use strict';

const Fauna = require('../models/fauna');

const id = 41526;
const items = [
    {
        id: 1,
        rank: 'species',
        rank_level: 1,
        iconic_taxon_id: 1,
        ancestor_ids: [1,2,3],
        is_active: true,
        name: 'name_1',
        parent_id: 1,
        ancestry: '1/2/3',
        extinct: false,
        default_photo: {
            id: 1,
            license_code: null,
            attribution: '(c) copyright',
            url: 'url_1',
            original_dimensions: { height: 1200, width: 1200 },
            flags: [],
            square_url: 'url_1',
            medium_url: 'url_1'
        },
        taxon: 'taxon_1',
        taxon_changes_count: 1,
        taxon_schemes_count: 1,
        observations_count: 1,
        flag_counts: { resolved: 1, unresolved: 1 },
        current_synonymous_taxon_ids: null,
        atlas_id: null,
        complete_species_count: null,
        wikipedia_url: 'url_1',
        matched_term: 'term_1',
        iconic_taxon_name: 'taxon_1',
        preferred_common_name: 'common_name_1',
        place_guess: 'place_1',
        taxon_photos: [
            {
                photo: {
                    attribution: 'name_1',
                    original_url: 'url_1'
                }
            },
            {
                photo: {
                    attribution: 'name_2',
                    original_url: 'url_2'
                }
            }
        ],
        conservation_statuses: [
            {
                place: {
                    id: 1,
                    display_name: 'name_1'
                }
            }
        ],
        listed_taxa: [
            {
                place: {
                    id: 1,
                    display_name: 'name_1'
                }
            }
        ]
    },
    {
        id: 2,
        rank: 'species',
        rank_level: 2,
        iconic_taxon_id: 2,
        ancestor_ids: [1,2,3],
        is_active: true,
        name: 'name_2',
        parent_id: 2,
        ancestry: '1/2/3',
        extinct: false,
        default_photo: {
            id: 2,
            license_code: null,
            attribution: '(c) copyright',
            url: 'url_2',
            original_dimensions: { height: 1200, width: 1200 },
            flags: [],
            square_url: 'url_2',
            medium_url: 'url_2'
        },
        taxon: 'taxon_2',
        taxon_changes_count: 2,
        taxon_schemes_count: 2,
        observations_count: 2,
        flag_counts: { resolved: 2, unresolved: 2 },
        current_synonymous_taxon_ids: null,
        atlas_id: null,
        complete_species_count: null,
        wikipedia_url: 'url_2',
        matched_term: 'term_2',
        iconic_taxon_name: 'taxon_2',
        preferred_common_name: 'common_name_2',
        place_guess: 'place_2',
        taxon_photos: [
            {
                photo: {
                    attribution: 'name_1',
                    original_url: 'url_1'
                }
            },
            {
                photo: {
                    attribution: 'name_2',
                    original_url: 'url_2'
                }
            }
        ],
        conservation_statuses: [
            {
                place: {
                    id: 1,
                    display_name: 'name_2'
                }
            }
        ],
        listed_taxa: [
            {
                place: {
                    id: 1,
                    display_name: 'name_2'
                }
            }
        ]
    },
]

// mocks Math.random value
beforeEach(function() {
    jest
    .spyOn(Math, 'random')
    .mockReturnValue(.5);
});
  
afterEach(function() {
    Math.random.mockRestore();
});

jest.setTimeout(60000);


/************************************** get */

describe('get', () => {
    test('works', async () => {
        const res = await Fauna.get(id);
        expect(res).toBeInstanceOf(Object);
        expect(typeof res.id).toBe('number');
        expect(typeof res.name).toBe('string');
    });
    test('fails: no such id', async () => {
        const res = await Fauna.get(999999999999999);
        expect(res).toBeUndefined();
    });
    test('fails: invalid id', async () => {
        try {
            await Fauna.get('number');
            fail();
        } catch (err) {
            expect(err.response.status).toBe(422);
        }
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
});

describe('formatFaunaPhotos', () => {
    test('return array of object(s) from given data values', () => {
        expect(Fauna.formatFaunaPhotos(items)).toEqual([
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
    test('return array of taxonomy names from given array of objects (items)', () => {
        expect(Fauna.createTaxa(items)).toEqual(['taxon_1', 'taxon_2']);
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

describe('createFaunae', () => {
    test('returns array of Fauna objects', () => {
        expect(Array.isArray(Fauna.createFaunae(items))).toBeTruthy();
        expect(Fauna.createFaunae(items)[0]).toBeInstanceOf(Fauna);
        expect(Fauna.createFaunae(items)[0].id).toEqual(1);
        expect(Fauna.createFaunae(items)[0].name).toEqual('name_1');
        expect(Fauna.createFaunae(items)[1]).toBeInstanceOf(Fauna);
        expect(Fauna.createFaunae(items)[1].id).toEqual(2);
        expect(Fauna.createFaunae(items)[1].name).toEqual('name_2');
    });
    test('returns empty array if given empty array', () => {
        expect(Fauna.createFaunae([])).toEqual([]);
    });
    test('returns empty array if given invalid parameter', () => {
        expect(Fauna.createFaunae(1)).toEqual([]);
    });
});

describe('createFaunaPlaceArrays', () => {
    test('returns object of place arrays (location, observations, taxaListings)', async () => {
        let res = await Fauna.createFaunaPlaceArrays(items[0]);
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
});
