import { Container } from 'reactstrap'; 

const Hero = ({ imgNum, title, subtitle }) => {
    return (
        <Container 
            fluid 
            className='bg-hero' 
            style={{backgroundImage: `url(/img/hero-bg-${imgNum}.jpg)`}}>
                <Container className='text-center py-5 '>
                    <h3 className='text-white display-3 mb-2 '>{title}</h3>
                    <p className='fs-5 text-white mb-4 '>{subtitle}</p>
                </Container>
        </Container>
    );
}

export default Hero;