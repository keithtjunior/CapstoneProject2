import { Link } from 'react-router-dom';
import { 
    Container, 
    Row,
    ListGroupItem, 
    Button,
    Collapse
} from 'reactstrap'; 

import { useToggle } from '../hooks/useToggle';

import Hero from '../components/Hero';
import TaxaCard from '../components/TaxaCard';
import ResultsList from '../components/ResultsList';
import NoResultsCard from '../components/NoResultsCard';
import Footer from '../components/Footer';


const Taxa = ({ taxa, faunae, taxonNames, setTaxon }) => {
    const [isOpen, setIsOpen] = useToggle(false);
    const toggle = () => setIsOpen();

    if(Object.values(taxa).every(item => !item.length)) 
    return (
        <>
            <Hero 
                imgNum={5}
                title={'Taxa'}
                subtitle={'Species'} />
    
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
                imgNum={2}
                title={'Taxa'}
                subtitle={'Species'} />

            <Container fluid className='blog py-5'>
                <Container className='py-5'>
                    <Row className='g-4'>
                        <div className='taxa mb-3'>
                            {taxonNames && taxonNames.map(name => {
                                if(taxa[`${name[0]}`].length){
                                    return (
                                        <Link 
                                            key={name[0]}
                                            to={'/faunae'}
                                            onClick={() => {setTaxon(name)}}
                                            className='taxa-result-link'>
                                            <ListGroupItem className='taxa-item'>
                                                <TaxaCard taxa={taxa} name={name} />
                                            </ListGroupItem>
                                        </Link>
                                    ); 
                                }
                            })}
                        </div>
                        <div>
                            <Button 
                                onClick={toggle}
                                className='btn-hover-bg btn btn-primary text-white show-all-toggle' >
                                    {`Show all results (${faunae.length || 0})`}
                            </Button>
                            <Collapse isOpen={isOpen}>
                                <ResultsList faunae={faunae}/>
                            </Collapse>
                        </div>
                    </Row>
                </Container>
            </Container>

            <Footer />
        
        </>
    )
}

export default Taxa;