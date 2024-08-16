import { Container, Row, Col } from 'reactstrap'; 

const Continents = ({ imgLabel, continents, getFaunaeByContinent }) => {

    const handleClick = async (data) => {
        await getFaunaeByContinent(data);
    }

    return (
        <Container fluid className='continents py-5 bg-light'>
                <Container className='py-5'>
                    <div className='text-center mx-auto pb-5 continents-title' style={{maxWidth: '800px'}}>
                        <h5 className='text-uppercase text-primary'>Worldwide</h5>
                        <h1 className='mb-0'>Find Fauna On Every Continent</h1>
                    </div>
                    <Row className='g-4'>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.northAmerica)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-1${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0'>North America</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.southAmerica)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-2${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0' >South America</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.europe)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-3${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0' >Europe</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.africa)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-4${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0' >Africa</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.asia)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-5${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0' >Asia</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.australia)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-6${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0' >Australia</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                        <Col className='col-md-6 col-lg-6 col-xl-3'>
                            <a href='#' className='continents-item-container' onClick={() => handleClick(continents.antartica)} >
                                <div className='continents-item'>
                                    <img src={`img/continents-7${imgLabel}.jpg`} className='img-fluid w-100' alt='Image' />
                                    <div className='continents-link'>
                                        <span className='h4 mb-0' >Antarctica</span>
                                    </div>
                                </div>
                                <p className='my-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </Container>
    );
}

export default Continents;