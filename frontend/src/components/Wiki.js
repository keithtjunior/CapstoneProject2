const Wiki = ({url, commonName, matchedTerm}) => {
    return (
        <div className='wiki bg-white p-4 mb-3'>
            <div>
                <i className='fab fa-wikipedia-w fa-2x text-primary mb-2'></i>
                <h4>Wikipedia</h4>
                <p><a href={url} target='_blank' rel='noopener noreferrer'>{commonName || matchedTerm}</a></p>
            </div>
            <div>
            <a href={url} className='wiki-button btn-hover-bg btn btn-primary text-white' type='button' target='_blank' rel='noopener noreferrer'>
                View Wiki
            </a>
            </div>
        </div>
    );
}

export default Wiki;