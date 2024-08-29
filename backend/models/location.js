'use strict';

const axios = require('axios');

const { INAT_API_URL } = require('../config');

/** Related functions for locations */

class Location {

    constructor(id, uuid, name, displayName, adminLevel, ancestorPlaceIds=[], lat, lng ){
        this.id = id || null;
        this.uuid = uuid || '';
        this.name = name || '';
        this.displayName = displayName || '';
        this.adminLevel = adminLevel || '';
        this.ancestorPlaceIds = ancestorPlaceIds;
        this.lat = lat || null;
        this.lng = lng || null;
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

    static async findAll({lat, lng, swlat, swlng, nelat, nelng, radius=75, perPage=999999}) {
        let taxonIds = Object.values(this.TaxologyIds).join(',');
        let url = this.buildUrl('observations', 'species_counts', {
            lat, lng, swlat, swlng, nelat, nelng, radius, per_page: perPage, 
            order_by: 'observations_count', taxon_id: taxonIds
        });
        const res = await axios.get(url);
        let data = this.createTaxa(res.data.results);
        return this.createFaunae(data);
    }

    static async get({name, swlat, swlng, nelat, nelng}) {
        let url = this.buildUrl('places', 'nearby', {name, nelat, nelng, swlat, swlng});
        const res = await axios.get(url);
        return this.createLocation(res.data.results.standard);
    }

    static async getById(id) {
        let url = this.buildUrl('places', id);
        const res = await axios.get(url);
        return this.createLocation(res.data.results)[0];
    }

    static async getByTerm(term) {
        let url = this.buildUrl('places', 'autocomplete', {q: term.split(/[ ,]+/)[0], per_page: '10'});
        const res = await axios.get(url);
        return this.createLocation(res.data.results);
    }

    static async getLocations(name) {
        let url = this.buildUrl('places', 'autocomplete', {q: name, per_page: '1'});
        return await axios.get(url)
        .then(result => {
            if(result && result.data.results.length){
                let lat = null;
                let lng = null;
                if(result.data.results[0].location){
                    lat = Number(result.data.results[0].location.split(',')[0]);
                    lng = Number(result.data.results[0].location.split(',')[1]);
                }
                let data = new Location(
                    result.data.results[0].id,
                    result.data.results[0].uuid || null,
                    result.data.results[0].name,
                    result.data.results[0].display_name,
                    result.data.results[0].admin_level || null,
                    result.data.results[0].ancestor_place_ids || [],
                    lat,
                    lng
                )
                return data;
            }
        });
    }

    static createLocation(items){
        let data = [];
        for(let item of items){
            data.push(new Location(
                item.id,
                item.uuid,
                item.name,
                item.display_name,
                item.admin_level,
                item.ancestor_place_ids,
                Number(item.location.split(',')[0]),
                Number(item.location.split(',')[1])
            ))
        }
        return data;
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

    // formatFaunaPhotos, createTaxa & createFaunae methods
    // duplicated to avoid circular dependency issue between
    // Fauna and Location modules/classes

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

    static createFaunae(items){
        let data = [];
        for(let item of items){
            if(item.rank === 'species'){
                data.push({
                    id: item.id || null,
                    name: item.name || 'Unavailable',
                    rank: item.rank || 'Unavailable',
                    photoUrl: item.default_photo ? item.default_photo.url : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                    squareUrl: item.default_photo ? item.default_photo.square_url : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                    mediumUrl: item.default_photo ? item.default_photo.medium_url : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                    commonName: item.preferred_common_name || 'Unavailable',
                    matchedTerm: item.matched_term || 'Unavailable',
                    taxonName: item.iconic_taxon_name || 'Unavailable',
                    parentId: item.parent_id || null,
                    ancestorIds: item.ancestor_ids || [],
                    summary: item.wikipedia_summary || 'Unavailable',
                    wikiUrl: item.wikipedia_url || '#',
                    locations: [],
                    taxaListings: [],
                    observations: [],
                    photos: this.formatFaunaPhotos(items)
                })
            }
        }
        return data;
    }

}

module.exports = Location;