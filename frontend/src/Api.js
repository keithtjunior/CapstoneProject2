import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

/** API Class **/

class FaunaFinderApi {

    static async request(endpoint, data = {}, method = 'get') {
        console.debug('API Call:', endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const params = (method === 'get') ? data : {};

        try {
            return (await axios({ url, method, data, params })).data;
        } catch (err) {
            console.error('API Error:', err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    static async getFaunae(data) {
        let res = await this.request('faunae', data);
        return res.results;
    }  

    static async getFaunaeAuto(data) {
        let res = await this.request('faunae/auto', data);
        return res.results;
    } 

    static async getFaunaeByPlace(data) {
        let res = await this.request('faunae/place', data);
        return res.results;
    }  

    static async getFaunaeByContinent(data) {
        let res = await this.request('faunae/continent', data);
        return res.results;
    }  

    static async getFauna(id) {
        let res = await this.request(`faunae/${id}`);
        return res.results;
    }

    static async getByLocations(data) {
        let res = await this.request('locations', data);
        return res.results;
    }

    static async getLocationByName(data) {
        let res = await this.request('locations/name', data);
        return res.results;
    }

    static async getLocationById(id) {
        let res = await this.request(`locations/${id}`);
        return res.results;
    }

    static async getLocationsAuto(data) {
        let res = await this.request('locations/auto', data);
        return res.results;
    }

}

export default FaunaFinderApi;
