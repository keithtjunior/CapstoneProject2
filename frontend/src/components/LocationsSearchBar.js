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
                data = {
                    lat: place.geometry.location.lat(), 
                    lng: place.geometry.location.lng(), 
                    swlat: place.geometry.viewport.Yh.lo || place.geometry.viewport.Wh.lo, 
                    swlng: place.geometry.viewport.Hh.lo || place.geometry.viewport.Gh.lo, 
                    nelat: place.geometry.viewport.Yh.hi || place.geometry.viewport.Wh.hi, 
                    nelng: place.geometry.viewport.Hh.hi || place.geometry.viewport.Gh.hi
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
