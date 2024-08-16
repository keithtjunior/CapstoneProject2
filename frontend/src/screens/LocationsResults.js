import { Container, Row } from 'reactstrap';

import Hero from '../components/Hero';
import LocationsList from '../components/LocationsList';
import NoResultsCard from '../components/NoResultsCard';
import Footer from '../components/Footer';


const LocationsResults = ({ locations, setSearchItem, getFaunaeByPlace }) => {
    if(!locations.length) 
    return (
        <>

        <Hero 
            imgNum={4}
            title={'Locations'}
            subtitle={''}/>

        <Container fluid className='blog py-5'>
            <Container className='py-5'>
                <Row className='g-4' style={{ marginBottom: '125px'}}>
                    <NoResultsCard />
                </Row>
            </Container>
        </Container>

        <Footer />

        </>
    )
    return (
        <>

        <Hero 
            imgNum={4}
            title={'Locations'}
            subtitle={''}/>

        <Container fluid className='blog py-5'>
            <Container className='py-5'>
                <Row>
                    <LocationsList 
                        locations={locations}
                        setSearchItem={setSearchItem} 
                        getFaunaeByPlace={getFaunaeByPlace} />
                </Row>
            </Container>
        </Container>

        <Footer />

        </>
    )
}

export default LocationsResults;