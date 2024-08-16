import { useEffect } from 'react';
import { 
    Container, 
    Row, 
    CardBody, 
    CardTitle, 
    CardText 
} from "reactstrap";

import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Error = () => {

  return (
        <>
            <Hero 
                imgNum={5}
                title={'500'}
                subtitle={'Error: Internal Server Error'} />
    
            <Container fluid className='blog py-5'>
                <Container className='py-5' style={{ width: '80%'}}>
                    <Row className='g-4' style={{ marginBottom: '125px'}}>
                        <CardBody 
                            className="text-center p-3" 
                            style={{ border: '1px solid rgba(0, 0, 0, .2)'}}>
                            <CardTitle>
                                <span style={{fontSize: '1.75rem'}} className="font-weight-bold">
                                    (500) Uh Oh!
                                </span>
                            </CardTitle>
                            <CardText>
                                We apologize for the inconvenience. Please try again later.
                            </CardText>
                        </CardBody>
                    </Row>
                </Container>
            </Container>

            <Footer />
        </>
  );
}

export default Error;