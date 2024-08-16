import { Container } from 'reactstrap'; 
import { Link } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import SearchHistory from '../components/SearchHistory';
import AboutUs from '../components/AboutUs';
import Continents from '../components/Continents';
import Footer from '../components/Footer';

const Home = ({ faunae, getFaunae, getFaunaeAuto, getFaunaeByContinent, searchItems, setSearchItem, searchOptions, clearStorage, continents }) => {

    return (
        <>
            <Container fluid className='home-container' style={{backgroundImage: 'url("img/home-1.jpg")'}}>
                <div className='home-main'>
                    <div className='p-3 home-text'>
                        <h4 className='text-white text-uppercase fw-bold mb-2'>
                            Species
                        </h4>
                        <h1 className='display-1 text-capitalize text-white mb-2'>Search the World</h1>
                        <p className='mb-3 fs-8 home-text-light'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                        </p>
                    </div>
                    <div className='d-flex justify-content-around mb-3 home-links'>
                        <Link to='/' className='p-2 g-col-6 home-link-species-active'>Search by species</Link>
                        <Link to='/locations' className='p-2 g-col-6 home-link-location'>Search by location</Link>
                    </div>
                    <div>
                        <SearchBar 
                            faunae={faunae} 
                            getFaunae={getFaunae}
                            getFaunaeAuto={getFaunaeAuto}
                            setSearchItem={setSearchItem} />
                    </div>
                    <SearchHistory 
                        searchItems={searchItems}
                        searchOptions={searchOptions}
                        clearStorage={clearStorage} />
                    </div>
            </Container>

            <AboutUs imgNum={1} />

            <Continents 
                imgLabel={''}
                continents={continents}
                getFaunaeByContinent={getFaunaeByContinent} />

            <Footer />
        </>
    )
}

Home.defaultProps = {
    continents: {
        africa: [7055, 7141, 7046, 6986, 7100, 7144, 51754, 6846, 7306, 10321],
        southAmerica: [6878, 7190, 7196, 7513, 7182, 6924],
        northAmerica: [674, 6793, 14, 35, 18, 27608, 21, 42, 6924, 6, 7085, 13336, 6883],
        europe: [7183, 7161, 6753, 6857, 6774, 7207, 6774, 6973, 7094, 7800, 7399, 11833, 7278, 7704],
        asia: [6737, 6966, 6681, 6903, 6873, 7154, 7076, 8206, 7358, 7359, 6967, 7161, 200244],
        australia: [7308, 14687, 18684, 49078, 49087, 8345, 6803, 6825, 7830, 6827, 6899, 7083, 6829, 9994],
        antartica: [67583, 206462]
    }
}

export default Home;