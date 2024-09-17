'use strict';

const axios = require('axios');

const Location = require('./location');
const { INAT_API_URL } = require('../config');

/** Related functions for fauna */

class Fauna {

    constructor(id, name, rank, photoUrl, squareUrl, mediumUrl, commonName, matchedTerm, taxonName, parentId, ancestorIds, summary, wikiUrl, locations, taxaListings, observations, photos){
        this.id = id || null;
        this.name = name || '';
        this.rank = rank || '';
        this.photoUrl = photoUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
        this.squareUrl = squareUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
        this.mediumUrl = mediumUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
        this.commonName = commonName || '';
        this.matchedTerm = matchedTerm || '';
        this.taxonName = taxonName || '';
        this.parentId = parentId || null;
        this.ancestorIds = ancestorIds || [];
        this.summary = summary || '';
        this.wikiUrl = wikiUrl || '#';
        this.locations = locations || [];
        this.taxaListings = taxaListings || [];
        this.observations = observations || [];
        this.photos = photos || [];
    }

    static TaxologyIds = Object.freeze({
        Animals: '1',
        Birds: '3',
        Amphibians: '20978',
        Reptiles: '26036',
        Mammals: '40151',
        Molluscs: '47115',
        Arachnids: '47119',
        Arthropods: '47120',
        Insects: '47158',
        Elasmobranchs: '47273',
        RayFinnedFishes: '47178',
        Chimaeras: '60450',
        LobeFinnedFishes: '85497',
        Vertebrates: '355675',
        JawlessFishes: '797045'
    });

    static async get(id) {
        const res = await axios.get(`${INAT_API_URL}/taxa/${id}`)
        .catch(err => {
            console.error(`${err.response.message}: ${err.response.status}`);
            return undefined;
        });
        return res && res.data ? res.data.results[0] : undefined;
    }

    static async getFauna(id) {
        const data = await this.get(id)
        .then(res => res)
        .then(async data => {
            if(data){
                let places = await this.createFaunaPlaceArrays(data);
                return {fauna: this.createFaunae([data])[0], places};
            }else{
                return {fauna: undefined, places: undefined};
            }
        })
        .then(({fauna, places}) => {
            if(fauna){
                fauna['locations'] = places.locations;
                fauna['taxaListings'] = places.taxaListings;
                fauna['observations'] = places.observations;
                return fauna;
            }else{
                return;
            }
        })
        .catch(err => {
            console.error(`${err.response.message}: ${err.response.status}`);
            return {
                'results': {
                    'total_results': 0,
                    'page': 1,
                    'per_page': 30,
                    'results': []
                }
            }
        });
        return data;
    }

    static async findAll(species) {
        if(!species || typeof species !== 'string') return [];
        let search_param = species.trim().replace(/\s+/g, '+').toLowerCase();
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let url = this.buildUrl('taxa', '', {q: search_param, taxon_id: taxonIds, order_by: 'observations_count'});
        const res = await axios.get(url);
        return res.data ? this.createFaunae(res.data.results) : [];
    }

    static async findAllAuto(species) {
        if(!species || typeof species !== 'string') return [];
        let search_param = species.trim().replace(/\s+/g, '+').toLowerCase();
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let url = this.buildUrl('taxa', 'autocomplete', {q: search_param, taxon_id: taxonIds});
        const res = await axios.get(url);
        return res.data ? this.createFaunae(res.data.results) : [];
    }

    // static async getByObservation(id) {
    //     const res = await axios.get(`${INAT_API_URL}/grid/${1}/${0}/${0}.png?taxon_id=42888`, {responseType: 'blob'})
    //         .then(response => {
    //             let blob = new Blob(
    //                 [response.data], 
    //                 { type: response.headers['content-type'] }
    //             );
    //             return URL.createObjectURL(blob);
    //         })
    //     return res;
    //     return this.createFaunae(res.data.results)[0];
    // }

    static async findByContinent(place_ids) {
        if(!Array.isArray(place_ids) || !this.isAllNumeric(place_ids)) return [];
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let orderByArr = ['votes', 'created_at', 'observed_on', 'species_guess', 'observations_count'];
        let url = this.buildUrl('observations', 'species_counts', {
            place_ids: place_ids.join(','), 
            order_by: this.getRandomItem(orderByArr), 
            taxon_id: taxonIds,
            native: 'true'
        });
        const res = await axios.get(url);
        let data = res.data ? this.createTaxa(res.data.results) : [];
        return this.createFaunae(data);
    }

    static async findByPlace(lat, lng, radius=200, place_ids=[], per_page=999999) {
        if(!Array.isArray(place_ids) || 
            !this.isAllNumeric(place_ids) || 
                !this.isAllNumeric([lat, lng, radius, per_page])) return [];
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let url = this.buildUrl('observations', 'species_counts', {
            lat, lng, radius, per_page,
            place_ids: place_ids.join(','), 
            order_by: 'observations_count', 
            taxon_id: taxonIds
        });
        const res = await axios.get(url);
        let data = res.data ? this.createTaxa(res.data.results) : [];
        return this.createFaunae(data);
    }

    static async getObservations(id) {
        let url = this.buildUrl('observations', '', {taxon_id: id});
        let res = await axios.get(url);
        return res && res.data ? res : undefined;
    }

    static listTaxaIdsWithCommas(obj={}){
        return Object.values(obj).join(',');
    }

    static buildUrl(subdirectory='', path='', parameters={}){
        if(!subdirectory || typeof subdirectory !== 'string') return `${INAT_API_URL}`;
        if(typeof path !== 'string' && typeof path !== 'number') return `${INAT_API_URL}`;
        return `${INAT_API_URL}/${subdirectory}${path ? `/${path}` : ''}` + 
        `?verifiable=any&spam=false&order=desc${this.listParamatersInUrl(parameters)}`;
    }

    static listParamatersInUrl(parameters={}){
        if(!parameters || typeof parameters !== 'object' || !Object.keys(parameters).length) return '';
        let arr = [];
        for (let [key, value] of Object.entries(parameters)) {
            arr.push(`&${key}=${value}`);
        }
        return arr.join('');
    }

    static formatFaunaPhotos(data) {
        if (!data || !Array.isArray(data) || !data[0].taxon_photos) return [];
        const photos = data.map(i => i.taxon_photos
            .map(t => {return {name: t.photo.attribution, url: t.photo.original_url}}));
        return photos[0];
    }

    static createTaxa(items){
        if (!items || !Array.isArray(items)) return [];
        let data = [];
        for(let item of items){
            if(item.taxon) data.push(item.taxon)
        }
        return data;
    }

    static getRandomItem(arr) {
        if (!arr || !Array.isArray(arr) || !arr.length) return '';
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static isAllNumeric(arr) {
        if(!Array.isArray(arr)) return false;
        return arr.every(item => typeof item === 'number');
    }

    static createFaunae(items){
        if (!items || !Array.isArray(items) || !items.length) return [];
        let data = [];
        for(let item of items){
            if(item.rank === 'species'){
                data.push(new Fauna(
                    item.id || null,
                    item.name || 'Unavailable',
                    item.rank || 'Unavailable',
                    item.default_photo ? item.default_photo.url : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                    item.default_photo ? item.default_photo.square_url : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                    item.default_photo ? item.default_photo.medium_url : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                    item.preferred_common_name || 'Unavailable',
                    item.matched_term || 'Unavailable',
                    item.iconic_taxon_name || 'Unavailable',
                    item.parent_id || null,
                    item.ancestor_ids || [],
                    item.wikipedia_summary || 'Unavailable',
                    item.wikipedia_url || '#',
                    [],
                    [],
                    [],
                    this.formatFaunaPhotos(items)
                ))
            }
        }
        return data;
    }

    static async createFaunaPlaceArrays(item) {
        if (!item) return {};
        const placeIds = [];
        let places = {};
        let locations = [];
        let observations = [];
        let taxaListings = [];
        
        try {
            // get place data for each fauna location (convservations_statuses)
            // & add location id to place id array
            if(item.conservation_statuses){
                for(let place of item.conservation_statuses){
                    if(place.place && !placeIds.includes(place.place.id)){ 
                        let res = await Location.getLocations(place.place.display_name);
                        if(res){
                            locations.push(res);
                            placeIds.push(res.id);
                        }
                    }
                }
            }
            places['locations'] = locations;

            // get place data for each fauna observation
            let observationResults = await this.getObservations(item.id);
            if(observationResults){
                // build array of fauna observations names
                let names = [];
                let observationNames = [];
                for(let item of observationResults.data.results){
                    if(item.place_guess){ 
                        if(!names.includes(item.place_guess.split(',')[0].toLowerCase()) &&
                        /^[a-zA-Z]+$/.test(item.place_guess.split(',')[0])){ 
                            observationNames.push(item.place_guess.split(',')[0]);
                            names.push(item.place_guess.split(',')[0].toLowerCase());
                        }
                    }
                }
                // get place data for each observation name with unique place id
                // & add observation ids to place id array
                for(let name of observationNames){
                    let res = await Location.getLocations(name);
                    if(res && !placeIds.includes(res.id)){ 
                        observations.push(res)
                        placeIds.push(res.id);
                    }
                }
            }
            places['observations'] = observations;

            // get place data for each taxa listing (listed_taxa) with unique place id
            if(item.listed_taxa){
                for(let place of item.listed_taxa){
                    if(place.place && !placeIds.includes(place.place.id)){ 
                        let res = await Location.getLocations(place.place.display_name);
                        if(res) taxaListings.push(res);
                    }
                }
            }
            places['taxaListings'] = taxaListings;

            return places;
            
        } catch (err) {
            console.error(`${err.code}: ${err.message}`);
            return {
                locations: [],
                observations: [],
                taxaListings: []
            }
        }
    }

}

module.exports = Fauna;