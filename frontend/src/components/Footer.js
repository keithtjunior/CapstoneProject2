import { Container, Row, Col } from 'reactstrap';

const Footer = () => {
    return (
        <Container fluid className='footer py-4'>
            <Container>
                <Row className='row g-4 align-items-center justify-content-between'>
                    <Col className='col-md-4 text-center text-md-start mb-md-0'>
                        <span className='text-body'><i className='fas fa-copyright text-light me-2'></i>FaunaFinder</span>
                    </Col>
                    <Col className='col-md-4 d-flex justify-content-end'>
                        <img src='./img/logo.png' className='footer-logo' alt='FaunaFinder Logo' />
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Footer;