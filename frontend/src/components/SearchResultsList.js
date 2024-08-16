import { Link } from 'react-router-dom';
import { ListGroup } from 'reactstrap'; 

import SearchResult from './SearchResult';
import NoResultsCard from './NoResultsCard';

const SearchResultsList = ({ faunae }) => {
    if(!faunae) 
        return (
            <ListGroup>
                <NoResultsCard />
            </ListGroup>
        )
    return (
        <ListGroup type='unstyled'>
            {faunae.map(fauna => {
                return (
                    <Link 
                        key={fauna.id}
                        to={`/faunae/${fauna.id}`}
                        className='search-result-link'>
                        <SearchResult key={fauna.id} fauna={fauna} />
                    </Link>
                );
            })}
        </ListGroup>
    )
}

export default SearchResultsList;



