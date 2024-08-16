import { Container, Row } from 'reactstrap'; 

const Gallery = ({ photos, commonName, matchedTerm, getModalPhoto }) => {

    const handleClick = (photo) => {
        getModalPhoto(photo);
    }

    const renderImages = (photos) => {
        let finalArr = [];
        let columns = [];
        photos && photos.map((photo, i) => {
          columns.push(
            <div key={i} onClick={() => handleClick(photo)}>
                <div className='gallery-item' style={{ height: '200px', cursor: 'pointer' }}>
                    <img src={photo.url} className='img-fluid w-100' alt={photo.name} />
                    <div className='gallery-content'>
                        <div className='gallery-inner pb-5'></div>
                    </div>
                </div>
            </div>
          );
          if((i+1) % 2 === 0) {
            finalArr.push(<div key={i+1} className='col-lg-4'>{columns}</div>);
            columns = [];
          }
        });
        return finalArr;
    }

    return (
        <Container fluid className='gallery'>
            <div className='text-center mx-auto pb-3' style={{maxWidth: '800px'}}>
                <h5 className='text-uppercase text-primary'>
                    {commonName || matchedTerm}
                </h5>
                <h1 className='mb-4'>Gallery</h1>
            </div>
            <Row className='g-0 gallery-container'>
                {renderImages(photos)}
            </Row>
        </Container>
    );
}

export default Gallery;