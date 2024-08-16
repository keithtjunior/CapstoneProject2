import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap'; 

import LocationMap from './LocationMap';

const LocationCard = ({ location }) => {
    return (
        <Card className='location-result-card'>
            <LocationMap location={location} />
            <CardBody className='location-result-body'>
                <CardTitle className='location-result-title'>
                    {location.displayName}
                </CardTitle>
                <CardSubtitle className='location-result-subtitle'>
                    {location.name}
                </CardSubtitle>
            </CardBody>
        </Card>
    )
}

export default LocationCard;
