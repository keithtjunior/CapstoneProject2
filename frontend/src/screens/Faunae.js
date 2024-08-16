import { Container, Row } from 'reactstrap'; 

import ResultsList from '../components/ResultsList';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const Faunae = ({ taxa, taxon }) => {

    return (
        <>

        <Hero 
            imgNum={1}
            title={taxon[1]}
            subtitle={'Faunae'}/>

        <Container fluid className='py-5'>
            <Container className='py-5'>
                <Row className='g-4'>
                    <ResultsList faunae={taxa[taxon[0]]}/>
                </Row>
            </Container>
        </Container>

        <Footer />
        
        </>
    )
}

export default Faunae;