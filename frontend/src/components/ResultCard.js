import { Card, CardBody, CardText, CardTitle } from 'reactstrap'; 

const ResultCard = ({ fauna }) => {

    return (
        <Card className='flex-row result-card'>
            <img className='card-img-left example-card-img-responsive result-img' src={fauna.photoUrl}/>
            <CardBody className='result-body'>
                <CardTitle className='h6 h6-sm result-title'>
                    {fauna.commonName || fauna.matchedTerm}
                </CardTitle>
                <CardText className='result-text'>
                    {fauna.name}
                </CardText>
            </CardBody>
        </Card>
    )
}

export default ResultCard;
