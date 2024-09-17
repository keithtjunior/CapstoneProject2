import { Card, CardBody, CardTitle } from 'reactstrap'; 

const TaxaCard = ({ taxa, name }) => {
    return (
        <Card className='flex-row taxa-result-card'>
            <img className='card-img-left example-card-img-responsive taxa-result-img' src={taxa[`${name[0]}`][0] && taxa[`${name[0]}`][0].photoUrl}/>
            <CardBody className='list-body taxa-result-body'>
                <div>
                    <CardTitle className='h6 h6-sm mb-0 taxa-result-title'>
                        {name[1]}
                    </CardTitle>
                    <small className="taxa-text-muted" style={{display: 'block'}}>
                        {name[0]}
                    </small>
                </div>
                <div className='taxa-length'>
                    <span className='badge'>
                        {taxa[`${name[0]}`].length}
                    </span>
                </div>
            </CardBody>
        </Card>
    )
}

export default TaxaCard;