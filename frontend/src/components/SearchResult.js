import { useContext } from 'react';
import { ListGroupItem } from 'reactstrap'; 

import SelectedContext from '../context/SelectedContext';
import SearchResultCard from './SearchResultCard';

const SearchResult = ({ fauna }) => {
    const { setValues } = useContext(SelectedContext);
    return (
        <ListGroupItem 
            className='search-result-item'
            onClick={(e) => setValues(fauna.commonName || fauna.matchedTerm)}
            style={{ height: '75px'}}>
            <SearchResultCard fauna={fauna} />

        </ListGroupItem>
    )
}

export default SearchResult;
