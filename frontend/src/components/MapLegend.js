const MapLegend = () => {
    return (
        <div className='my-legend'>
            <div className='legend-title'>Map Legend</div>
            <div className='legend-labels'>
                <div><span className='circle' style={{backgroundColor: '#ff0a0a'}}></span>Taxa Locations</div>
                <div><span className='circle' style={{backgroundColor: '#ff8c0a'}}></span>Verifiable Observations</div>
                <div><span style={{backgroundColor: '#ee9ec5'}}></span>Observational Range</div>
                <div><span style={{backgroundColor: '#b7d186'}}></span>Regional Range (Verified)</div>
                <div><span style={{backgroundColor: '#e8cb80'}}></span>Regional Range (Unverified)</div>
                <div><span style={{backgroundColor: '#919191'}}></span>Observations (Unverified)</div> 
                <div><span style={{ border: 'none'}}><i className="fas fa-search-plus"></i></span>Zoom (Click to Zoom)</div> 
            </div>
            <div className='legend-source'>Source: <a href='https://www.inaturalist.org/' target='_blank'>iNaturalist</a></div>
        </div>
    )
}

export default MapLegend;


