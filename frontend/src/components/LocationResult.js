import { ListGroupItem } from 'reactstrap'; 

import LocationCard from './LocationCard';

const LocationResult = ({ location }) => {
    return (
        <ListGroupItem className='location-result-item'>
            <LocationCard location={location} />
        </ListGroupItem>
    )
}

export default LocationResult;