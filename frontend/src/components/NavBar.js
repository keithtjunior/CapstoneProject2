import { useState, useRef } from 'react';
import { NavLink } from "react-router-dom";
import { Button, Container, Navbar } from 'reactstrap';

import SelectedContext from '../context/SelectedContext';


const NavBar = ({ getFaunae, setSearchItem }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef();

    const handleChange = (val) => {
        setInput(val);
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
        let val = inputRef.current.value;
        setSearchItem(val);
        await getFaunae(val);
    }

    const setValues = (val) => {
        setInput(val);
    }

    return (
        <>
        <SelectedContext.Provider value={{setValues}}>
            <Container fluid className='fixed-top px-0'>
                <Container className='px-0'>
                    
                    <Navbar className='navbar-light bg-light navbar-expand-xl'>
                        <NavLink exact to='/' className='navbar-brand ms-3'>
                            <div className='navbar-links'>
                                <img src='./img/logo.png' className='navbar-logo' alt='FaunaFinder Logo' />
                                <h1 className='text-primary display-5 navbar-title'>FaunaFinder</h1>
                            </div>
                        </NavLink>
                        <Button 
                            className='navbar-toggler py-2 px-3 me-3' 
                            type='button' data-bs-toggle='collapse' 
                            data-bs-target='#navbarCollapse'>
                                <span className='fa fa-bars text-primary'></span>
                        </Button>
                        <div className='collapse navbar-collapse bg-light justify-content-end align-items-center' id='navbarCollapse'>

                            <div className='d-flex align-items-center flex-nowrap pt-xl-0' style={{marginLeft: '15px'}}>
                                <input ref={inputRef} value={input} onChange={(e) => handleChange(e.target.value)}  onKeyDown={(e) => handleKeyPress(e)} className='form-control me-2 nav-search' type='search' placeholder='Search by species...' aria-label='Search'/>
                                <button className='btn-hover-bg btn btn-primary text-white py-2 px-4 me-3' type='submit' onClick={handleClick}>Search</button>
                            </div>
                            
                        </div>
                    </Navbar>
                </Container>
            </Container>
        </SelectedContext.Provider>
        </>
    );
}

export default NavBar;
