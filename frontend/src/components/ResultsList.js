import { Link } from 'react-router-dom';

import Result from './Result';
import NoResultsCard from './NoResultsCard';

const ResultsList = ({ faunae }) => {

    if(!faunae) 
        return (
            <NoResultsCard />
        )
    return (
        <>
            {faunae.map(fauna => {
                return (
                    <Link 
                        key={fauna.id}
                        to={`/faunae/${fauna.id}`}
                        className='result-link'>
                        <Result fauna={fauna} />
                    </Link>
                );
            })}
        </>
    )
}

export default ResultsList;



