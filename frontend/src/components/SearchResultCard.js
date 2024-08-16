import { Card, CardBody, CardText, CardTitle } from 'reactstrap'; 

const SearchResultCard = ({ fauna }) => {

    return (
        <Card className='flex-row search-result-card'>
            <img className='card-img-left example-card-img-responsive search-result-img' src={fauna.photoUrl}/>
            <CardBody className='search-result-body'>
                <CardTitle className='h6 h6-sm search-result-title'>
                    {fauna.commonName || fauna.matchedTerm}
                </CardTitle>
                <CardText className='search-result-text'>
                    {fauna.name}
                </CardText>
            </CardBody>
        </Card>
    )
}

export default SearchResultCard;
