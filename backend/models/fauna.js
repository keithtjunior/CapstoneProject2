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
        let url = this.buildUrl('taxa', id);
        const res = await axios.get(url);
        return res.data.results[0];
    }

    static async getFauna(id) {
        return await this.get(id)
        .then(res => res)
        .then(async data => {
            let places = await this.createFaunaPlaceArrays(data);
            return {fauna: this.createFaunae([data])[0], places};
        })
        .then(({fauna, places}) => {
            fauna['locations'] = places.locations;
            fauna['taxaListings'] = places.taxaListings;
            fauna['observations'] = places.observations;
            return fauna;
        });
    }

    static async findAll(species) {
        let search_param = species.trim().replace(/\s+/g, '+').toLowerCase();
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let url = this.buildUrl('taxa', '', {q: search_param, taxon_id: taxonIds, order_by: 'observations_count'});
        const res = await axios.get(url);
        return this.createFaunae(res.data.results);
    }

    static async findAllAuto(species) {
        let search_param = species.trim().replace(/\s+/g, '+').toLowerCase();
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let url = this.buildUrl('taxa', 'autocomplete', {q: search_param, taxon_id: taxonIds});
        const res = await axios.get(url);
        return this.createFaunae(res.data.results);
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
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let orderByArr = ['votes', 'created_at', 'observed_on', 'species_guess', 'observations_count'];
        let url = this.buildUrl('observations', 'species_counts', {
            place_ids: place_ids.join(','), 
            order_by: this.getRandomItem(orderByArr), 
            taxon_id: taxonIds,
            native: 'true'
        });
        const res = await axios.get(url);
        let data = this.createTaxa(res.data.results);
        return this.createFaunae(data);
    }

    static async findByPlace(lat, lng, radius=200, place_ids=[], per_page=999999) {
        let taxonIds = this.listTaxaIdsWithCommas(this.TaxologyIds);
        let url = this.buildUrl('observations', 'species_counts', {
            lat, lng, radius, per_page,
            place_ids: place_ids.join(','), 
            order_by: 'observations_count', 
            taxon_id: taxonIds
        });
        const res = await axios.get(url);
        let data = this.createTaxa(res.data.results);
        return this.createFaunae(data);
    }

    static async getObservations(id) {
        let url = this.buildUrl('observations', '', {taxon_id: id});
        return await axios.get(url);
    }

    static listTaxaIdsWithCommas(obj){
        return Object.values(obj).join(',');
    }

    static buildUrl(subdirectory, path, parameters={}){
        return `${INAT_API_URL}/${subdirectory}${path ? `/${path}` : ''}` + 
            `?verifiable=any&spam=false&order=desc${this.listParamatersInUrl(parameters)}`;
    }

    static listParamatersInUrl(parameters){
        if(!Object.keys(parameters).length) return '';
        let arr = [];
        for (let [key, value] of Object.entries(parameters)) {
            arr.push(`&${key}=${value}`);
        }
        return arr.join('');
    }

    static formatFaunaPhotos(data) {
        if (!data[0].taxon_photos) return [];
        const photos = data.map(i => i.taxon_photos
            .map(t => {return {name: t.photo.attribution, url: t.photo.original_url}}));
        return photos[0];
    }

    static createTaxa(items){
        let data = [];
        for(let item of items){
            if(item.taxon) data.push(item.taxon)
        }
        return data;
    }

    static getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static createFaunae(items){
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
        const placeIds = [];
        let places = {};
        let locations = [];
        let taxaListings = []

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
        let observations = await this.getObservations(item.id)
        .then(async res => {
            let observationArr = [];
            if(res){
                // build array of fauna observations names
                let names = [];
                let observationNames = [];
                for(let item of res.data.results){
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
                        observationArr.push(res)
                        placeIds.push(res.id);
                    }
                }
            }
            return observationArr;
        });
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
        
    }

}

module.exports = Fauna;