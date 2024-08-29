import { Link } from 'react-router-dom';
import { Container, Row, Col, ListGroup } from 'reactstrap'; 

import LocationResult from './LocationResult';
import NoResultsCard from './NoResultsCard';

const LocationsList = ({ locations, setSearchItem, getFaunaeByPlace }) => {

    const handleClick = async (e, location) => {
        e.stopPropagation();
        e.preventDefault();
        let data = {
            lat: location.lat,
            lng: location.lng,
            place_ids: location.ancestorPlaceIds || [],
            per_page: undefined,
            radius: undefined
        }
        setSearchItem(location.name);
        await getFaunaeByPlace(data);
    }

    if(!locations) 
        return (
            <Container>
                <Row>
                    <Col>
                        <NoResultsCard />
                    </Col>
                </Row>
            </Container>
        )
    return (
        <ListGroup type='unstyled' className='location-result-listgroup'>
            {locations.map(location => {
                return (
                    <Link 
                        key={location.id}
                        to={'#'}
                        onClick={(e) => handleClick(e, location)}
                        className='location-result-link'>
                        <LocationResult location={location} />
                    </Link>
                );
            })}
        </ListGroup>
    )
}

export default LocationsList;



