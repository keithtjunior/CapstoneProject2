import { Container, Row, Col } from 'reactstrap'; 

const AboutUs = ({ imgNum }) => {

    return (
        <Container fluid className='about py-5'>
            <Container className='py-5'>
                <Row className='g-5'>
                    <Col className='col-xl-5'>
                        <div className='h-100'>
                            <img src={`img/about-${imgNum}.jpg`} className='img-fluid w-100 h-100' alt='About Image' />
                        </div>
                    </Col>
                    <Col className='col-xl-7'>
                        <h5 className='text-uppercase text-primary'>About Us</h5>
                        <h1 className='mb-4'>Traveling Abroad or Exploring Your Own Backyard...</h1>
                        <p className='fs-5 mb-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has
                        </p>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default AboutUs;