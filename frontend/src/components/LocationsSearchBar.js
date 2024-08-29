'use client';

import { useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const libraries = ['places', 'maps', 'geocoding'];
const options = { types: ['geocode'] };

const LocationsSearchBar = ({ location, setLocation, setSearchItem, getByLocations, getLocationsAuto }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries
    });
    const inputRef = useRef();
    const autoRef = useRef();

    const handlePlaceChange = async () => {
        let data = {};
        const place  = autoRef.current.getPlace();
        if(place){
            setSearchItem(place.name);
            if(place.geometry) {
                let viewport = Object.values(place.geometry.viewport).map(val => val);
                data = {
                    lat: place.geometry.location.lat(), 
                    lng: place.geometry.location.lng(), 
                    swlat: viewport[0].lo || place.geometry.location.lat(), 
                    swlng: viewport[1].lo || place.geometry.location.lng(), 
                    nelat: viewport[0].hi || place.geometry.location.lat(),
                    nelng: viewport[1].hi || place.geometry.location.lng()
                }
                await getByLocations(place.name, data);
            }else{
                await getLocationsAuto(place.name);
            }
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setLocation(e.target.value);
    }

    const handleClick = async () => {
        setSearchItem(location);
        await getLocationsAuto(location);
    }

    return (
        <>
        {
            isLoaded
            &&
            <Autocomplete
                onLoad={ref => autoRef.current = ref}
                onPlaceChanged={handlePlaceChange}
                options={options}>
                <div className='input-group mb-3'>
                    <input type='text' className='form-control' placeholder='Location' aria-label='Location' 
                    ref={inputRef} onChange={handleChange} />
                    <button className='btn-hover-bg btn btn-primary text-white' type='button' id='button-addon2' onClick={handleClick}>
                        Search
                    </button>
                </div>
            </Autocomplete>

        }
        </>
    )
}

export default LocationsSearchBar;
