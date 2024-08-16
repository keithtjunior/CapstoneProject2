import { Card, CardBody, CardText } from 'reactstrap'; 

const NoResultsCard = ({ fauna }) => {
    return (
        <Card className='flex-row list-card' style={{ marginBottom: '95px' }}>
            <CardBody className='list-body'>
                <CardText className='list-text text-center'>
                    No Results Found
                </CardText>
            </CardBody>
        </Card>
    )
}

export default NoResultsCard;