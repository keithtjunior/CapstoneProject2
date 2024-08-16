'use strict';

const axios = require('axios');

const { INAT_API_URL } = require('../config');

/** Related functions for fauna */

class Fauna {

    constructor(id, name, rank, photoUrl, squareUrl, mediumUrl, commonName, matchedTerm, taxonName, parent_id, summary, wikiUrl, locations, listedTaxa, observations, photos){
        this.id = id;
        this.name = name;
        this.rank = rank;
        this.photoUrl = photoUrl;
        this.squareUrl = squareUrl;
        this.mediumUrl = mediumUrl;
        this.commonName = commonName;
        this.matchedTerm = matchedTerm; 
        this.taxonName = taxonName;
        this.parent_id = parent_id;
        this.summary = summary;
        this.wikiUrl = wikiUrl;
        this.locations = locations;
        this.listedTaxa = listedTaxa;
        this.observations = observations;
        this.photos = photos;
    }

    static async findAll(species) {
        let search_param = species.trim().replace(/\s+/g, '+').toLowerCase();
        const res = await axios.get(`${INAT_API_URL}/taxa?q=${search_param}&taxon_id=1,3,20978,26036,40151,47115,47119,47120,47158,47178,355675&verifiable=true&spam=false&order=desc&order_by=observations_count`);
        return this.createFaunae(res.data.results);
    }

    static async findAllAuto(species) {
        let search_param = species.trim().replace(/\s+/g, '+').toLowerCase();
        const res = await axios.get(`${INAT_API_URL}/taxa/autocomplete?q=${search_param}&taxon_id=1,3,20978,26036,40151,47115,47119,47120,47158,47178,355675&verifiable=true&spam=false`);
        return this.createFaunae(res.data.results);
    }

    static async get(id) {
        const res = await axios.get(`${INAT_API_URL}/taxa/${id}`);
        const data = this.createFaunae(res.data.results)[0];
        let promises = await this.getPlaces(data, true);
        const locations = await Promise.all(promises);
        const photos = res.data.results.map(i => i.taxon_photos
            .map(t => {return {name: t.photo.attribution, url: t.photo.original_url}}));

        let ids = [];
        if(locations) ids = locations.map(item => item.id);

        const observationRes = await axios.get(`${INAT_API_URL}/observations?taxon_id=${id}`);
        const placeNames = this.createPlaces(observationRes.data.results);
        const placePromises = await this.getPlaces(placeNames, false);
        let placeLocations = await Promise.all(placePromises);
        placeLocations = placeLocations.filter(e => e !== undefined)
            .filter(i => !ids.includes(i.id));

        const taxaLocations = {locations: data['listedTaxa']
            .map(i => {return {display_name: i.display_name}})}
        const taxaPromises = await this.getPlaces(taxaLocations, false);
        let listedTaxa = await Promise.all(taxaPromises);
        listedTaxa = listedTaxa.filter(e => e !== undefined)
            .filter(i => !ids.includes(i.id));
        
        data['observations'] = placeLocations.sort((a, b) => a.id - b.id);
        data['listedTaxa'] = listedTaxa.sort((a, b) => a.id - b.id);
        data['locations'] = locations.sort((a, b) => a.id - b.id);
        data['photos'] = photos[0];
        return data;
    }

    static async getByObservation(id) {
        const res = await axios.get(`${INAT_API_URL}/grid/${1}/${0}/${0}.png?taxon_id=42888`, {responseType: 'blob'})
            .then(response => {
                let blob = new Blob(
                    [response.data], 
                    { type: response.headers['content-type'] }
                );
                return URL.createObjectURL(blob);
            })
        return res;
        return this.createFaunae(res.data.results)[0];
    }

    static async getByContinent(place_ids) {
        const orderByArr = ['votes', 'created_at', 'observed_on', 'species_guess', 'observations_count'];
        const res = await axios.get(`${INAT_API_URL}/observations/species_counts?verifiable=any&spam=false&native=true&place_id=${place_ids.join(',')}&taxon_id=1,3,20978,26036,40151,47115,47119,47120,47158,47178,355675&order=desc&order_by=${this.getRandomItem(orderByArr)}`);
        let data = this.createTaxa(res.data.results);
        return this.createFaunae(data);
    }

    static async findByPlace(lat, lng, radius=200, place_ids, per_page=999999) {
        const res = await axios.get(`${INAT_API_URL}/observations/species_counts?verifiable=any&spam=false&place_id=${place_ids.join(',')}&lat=${lat}&lng=${lng}&radius=${radius}&per_page=${per_page}&taxon_id=1,3,20978,26036,40151,47115,47119,47120,47158,47178,355675&order=desc&order_by=observations_count`);
        let data = this.createTaxa(res.data.results);
        return this.createFaunae(data);
    }

    static getRandomItem(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static async getPlaces(data, isComplete){
        return await data.locations.map(async (location, idx) => {
            return await axios.get(`${INAT_API_URL}/places/autocomplete?q=${location.display_name}&per_page=1`)
            .then(result => {
                if(isComplete){
                    if(result){
                        if(location && location.id && location.id === result.data.results[0].id){
                            const newLocation = { 
                                ...data.locations[idx], 
                                lat: Number(result.data.results[0].location.split(',')[0]),
                                lng: Number(result.data.results[0].location.split(',')[1])
                            };
                            return newLocation;
                        }else{
                            return data.locations[idx];
                        }
                    }else{
                        return data.locations[idx];
                    }
                }else{
                    if(result && result.data.results.length){
                        let lat = null;
                        let lng = null;
                        if(result.data.results[0].location){
                            lat = Number(result.data.results[0].location.split(',')[0]);
                            lng = Number(result.data.results[0].location.split(',')[1]);
                        }
                        let data =  {
                            id: result.data.results[0].id,
                            name: result.data.results[0].name,
                            display_name: result.data.results[0].display_name,
                            admin_level: result.data.results[0].admin_level || null,
                            ancestor_place_ids: result.data.results[0].ancestor_place_ids || [],
                            lat: lat,
                            lng: lng
                        }
                        if(data) return data;
                    }
                }
            })
        });
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
                    item.wikipedia_summary || 'Unavailable',
                    item.wikipedia_url || '#',
                    this.createLocations(item),
                    this.createListedTaxa(item),
                    [],
                    []
                ))
            }
        }
        return data;
    }

    static createLocations(item){
        let data = [];
        let ids = [];
        if(item.conservation_statuses){
            for(let place of item.conservation_statuses){
                if(place.place && !ids.includes(place.place.id)){ 
                    data.push(place.place);
                    ids.push(place.place.id);
                }
            }
        }
        return data.sort((a, b) => a.id - b.id);
    }

    static createListedTaxa(item){
        let data = [];
        let ids = [];
        if(item.listed_taxa){
            for(let place of item.listed_taxa){
                if(place.place && !ids.includes(place.place.id)){ 
                    data.push(place.place);
                    ids.push(place.place.id);
                }
            }
        }
        return data.sort((a, b) => a.id - b.id);
    }

    static createTaxa(items){
        let data = [];
        for(let item of items){
            if(item.taxon) data.push(item.taxon)
        }
        return data;
    }

    static createPlaces(items){
        let data = [];
        let names = [];
        for(let item of items){
            if(item.place_guess){ 
                if(!names.includes(item.place_guess.split(',')[0].toLowerCase()) &&
                /^[a-zA-Z]+$/.test(item.place_guess.split(',')[0])){ 
                    data.push({display_name: item.place_guess.split(',')[0]});
                    names.push(item.place_guess.split(',')[0].toLowerCase());
                }
            }
        }
        return {locations: data};
    }

}

module.exports = Fauna;