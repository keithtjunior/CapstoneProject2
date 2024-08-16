import { useLocation } from 'react-router-dom';

const SearchHistory = ({ searchItems, searchOptions, clearStorage }) => {
    const { pathname } = useLocation();

    const handleClick = async (item) => {
        await searchOptions(item);
    }

    const handleClear = () => {
        clearStorage(pathname);
    }

    if(!searchItems.length) 
        return (
            <></>
        )
    return (
        <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    <span style={{ marginRight: '.25rem' }}>Search History</span>/<span style={{ marginLeft: '.25rem', color: 'yellow'}}>Pages Visited</span>
                </button>
                <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                        {searchItems.map((item, idx) => {
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => handleClick(item)}
                                    type='button'
                                    className='accordion-links'>
                                        <span className={item.method === 'g' ? 'page' : 'term'}>{item.term}</span>
                                        <span className='date'>
                                            {new Date(item.time).toLocaleString('en-US', { timeZoneName: 'short' })}
                                        </span>
                                </button>
                            );
                        })}
                        <button 
                            onClick={handleClear}
                            type='button'
                            className='accordion-links clear'>
                                Clear History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchHistory;