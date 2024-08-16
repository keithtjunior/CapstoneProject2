import { useState, useRef } from 'react';

import SelectedContext from '../context/SelectedContext';
import SearchResultsList from './SearchResultsList';

const SearchBar = ({ faunae, getFaunae, getFaunaeAuto, setSearchItem }) => {
    const [input, setInput] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const inputRef = useRef();
    
    const handleChange = async (val) => {
        setSelectedValue('');
        setInput(val);
        setSearchItem(val);
        await getFaunaeAuto(val);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let val = e.target.value;
            setSearchItem(val);
            await getFaunae(val);
        }
    };

    const handleClick = async () => {
        let val = inputRef.current.props.value;
        setSearchItem(val);
        await getFaunae(val);
    }

    const setValues = (val) => {
        setInput(val);
        setSearchItem(val);
        setSelectedValue(val);
    }

    return (
        <SelectedContext.Provider value={{setValues}}>
            <div className='input-group mb-3'>
                <input type='text' className='form-control' placeholder='Species' aria-label='Species' 
                 ref={inputRef} value={input} onChange={(e) => handleChange(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} />
                <button className='btn-hover-bg btn btn-primary text-white' type='button' id='button-addon2' onClick={handleClick}>Search</button>
            </div>
            {input !== selectedValue && faunae && faunae.length > 0 && <SearchResultsList faunae={faunae} />}
        </SelectedContext.Provider>
    )
}

export default SearchBar;