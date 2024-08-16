'use strict';

const axios = require('axios');

const Fauna = require('./fauna');
const { INAT_API_URL } = require('../config');

/** Related functions for locations */

class Location {

    constructor(id, uuid, name, displayName, location={}, ancestorPlaceIds=[]){
        this.id = id || null;
        this.uuid = uuid || '';
        this.name = name || '';
        this.displayName = displayName || '';
        this.location = location;
        this.ancestorPlaceIds = ancestorPlaceIds;
    }

    static async findAll({lat, lng, swlat, swlng, nelat, nelng, radius=75, perPage=999999}) {
        const res = await axios.get(`${INAT_API_URL}/observations/species_counts?verifiable=any&spam=false&lat=${lat}&lng=${lng}&swlat=${swlat}&swlng=${swlng}&nelat=${nelat}&nelng=${nelng}&radius=${radius}&per_page=${perPage}&taxon_id=1,3,20978,26036,40151,47115,47119,47120,47158,47178,355675&order=desc&order_by=observations_count`);
        let data = Fauna.createTaxa(res.data.results);
        return Fauna.createFaunae(data);
    }

    static async get({name, swlat, swlng, nelat, nelng}) {
        const res = await axios.get(`${INAT_API_URL}/places/nearby?name=${name}&nelat=${nelat}&nelng=${nelng}&swlat=${swlat}&swlng=${swlng}`);
        return this.createLocation(res.data.results.standard);
    }

    static async getById(id) {
        const res = await axios.get(`${INAT_API_URL}/places/${id}`);
        return this.createLocation(res.data.results)[0];
    }

    static async getByTerm(term) {
        const res = await axios.get(`${INAT_API_URL}/places/autocomplete?q=${term.split(/[ ,]+/)[0]}&per_page=10`);
        console.log('res: ', res)
        return this.createLocation(res.data.results);
    }

    static createLocation(items){
        let data = [];
        for(let item of items){
            data.push(new Location(
                item.id,
                item.uuid,
                item.name,
                item.display_name,
                {
                    'lat': Number(item.location.split(',')[0]), 
                    'lng': Number(item.location.split(',')[1])
                },
                item.ancestor_place_ids
            ))
        }
        return data;
    }

}

module.exports = Location;