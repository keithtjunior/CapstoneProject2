import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

import { useEffect, useRef } from 'react';

const LocationMap = ({ location }) => {
    const mapDiv = useRef();

    useEffect(() => {
        if (location && mapDiv.current) {

            const webmap = new Map({
                basemap: 'topo'
            });

            const view = new MapView({
                container: mapDiv.current, 
                map: webmap, 
                center: [location.location.lng, location.location.lat],
                zoom: 7,
                constraints: {
                    snapToZoom: false
                },
                ui: {
                    components: [] 
                },
                navigation: {
                  mouseWheelZoomEnabled: false,
                  browserTouchPanEnabled: false
                }
            });
        }
        
    }, []);

    return <div className='mapDiv' ref={mapDiv}></div>;
}

export default LocationMap;