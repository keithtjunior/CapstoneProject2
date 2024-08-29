import { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { Container, Row, Col } from 'reactstrap'; 

import { useToggle } from '../hooks/useToggle';

import Loading from './Loading';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Wiki from '../components/Wiki';
import MapLegend from '../components/MapLegend';
import FaunaMap from '../components/FaunaMap';
import Footer from '../components/Footer';
import Gallery from '../components/Gallery';
import FaunaModal from '../components/FaunaModal';
import FaunaSelect from '../components/FaunaSelect';

const Fauna = ({ fauna, getFauna, getFaunae, getFaunaeByPlace, setSearchItem }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalPhoto, setModalPhoto] = useState({});
    const [modal, setModal] = useToggle(false);
    const { id } = useParams();
    const selectRef = useRef(null);
    let history = useHistory();

    useEffect(() => {
        const loadFauna = async () => {
            if(/^\d+$/.test(id)){ 
                setIsLoading(true);
                let res = await getFauna(id);
                if(res && fauna) setIsLoading(false);
                else history.push('/notfound');
            }
            else history.push('/notfound');
        }
        loadFauna();
    }, []);

    const getModalPhoto = (photo) => {
        setModalPhoto(photo);
        setModal();
    };

    const toggleModal = () => setModal();

    if (isLoading) 
    return (
        <Loading />
    );
    return (
        <>
            <NavBar 
                getFaunae={getFaunae}
                setSearchItem={setSearchItem} />

            <Hero 
                imgNum={3}
                title={fauna.name}
                subtitle={fauna.taxonName} />

            <Container fluid>
                <Container>
                    <div className='fauna'>
                        <Row className='px-5 pt-5 mb-3'>
                            <Col>
                                <div className='mb-4 d-flex justify-content-center'>
                                    <img src={fauna.mediumUrl} />
                                </div>
                                <div className='mb-2 text-center'>Listed Taxa Locations / Conservations / Captive:</div>
                                <FaunaSelect 
                                    fauna={fauna}
                                    taxa={fauna.taxaListings}
                                    getFaunaeByPlace={getFaunaeByPlace} />
                            </Col>
                            <Col>
                                <h1 className='mb-4'>{fauna.commonName || fauna.matchedTerm}</h1>
                                <div className='mb-4' dangerouslySetInnerHTML={{ __html: fauna.summary }} />
                                <Wiki 
                                    url={fauna.wikiUrl}
                                    commonName={fauna.commonName}
                                    matchedTerm={fauna.matchedTerm} />
                            </Col>
                        </Row>

                        <MapLegend />

                        <Row className='px-5'>
                            <Col>
                                <FaunaMap 
                                    locations={fauna.locations}
                                    observations={fauna.observations}
                                    getFaunaeByPlace={getFaunaeByPlace} />
                            </Col>
                        </Row>
                        <Row className='px-5 pb-5' style={{marginTop: '2.75rem'}}>
                            <Gallery 
                                photos={fauna.photos}
                                commonName={fauna.commonName}
                                matchedTerm={fauna.matchedTerm}
                                getModalPhoto={getModalPhoto} />
                        </Row>

                    </div>
                </Container>
            </Container>

            <FaunaModal 
                photo={modalPhoto}
                modal={modal}
                toggle={toggleModal} /> 

            <Footer />
        </>
    )
}

export default Fauna;