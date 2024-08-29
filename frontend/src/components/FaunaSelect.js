import { useState, useEffect, useRef } from 'react';

const FaunaSelect = ({ fauna, taxa, getFaunaeByPlace }) => {
    const [isLoading, setIsLoading] = useState(true);
    const selectRef = useRef(null);

    useEffect(() => {
        if(!taxa) setIsLoading(true)
        else setIsLoading(false)
    }, [fauna]);

    const handleClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if(/^\d+$/.test(selectRef.current.value)){
            let place = fauna.taxaListings.find(c => c.id == selectRef.current.value);
            if(place){
                let data = {
                    lat: place.lat,
                    lng: place.lng,
                    place_ids: place.ancestor_place_ids || [],
                    per_page: undefined,
                    radius: undefined
                }
                await getFaunaeByPlace(data);
            }
        }
    }

    if (isLoading) 
    return (
        <div className='input-group d-flex justify-content-center' style={{ minWidth: '120px', marginBottom: '1.5rem'}}>
            <span>Error: Locations unavailable...</span>
        </div>
    );
    else
    return (
        <div className='input-group d-flex justify-content-center' style={{ minWidth: '120px', marginBottom: '1.5rem'}}>
            <select 
                ref={selectRef}
                id='inputGroupSelect' 
                className='custom-select' 
                style={{ 
                    marginBottom: '1rem', 
                    height: '40px', 
                    width: '70%', 
                    padding: '.25rem'}}>
                <option value={null}>Choose a location...</option>
                {taxa && taxa.map((taxon, idx) => (
                    <option key={idx} value={taxon.id}>
                        {taxon.displayName}
                    </option>
                ))}
            </select>
            <div className='input-group-append'>
                <button className='btn-hover-bg btn btn-primary text-white' type='button' onClick={handleClick} style={{height: '40px'}}>
                    View All Fauna
                </button>
            </div>
        </div>
    )
}

export default FaunaSelect;


