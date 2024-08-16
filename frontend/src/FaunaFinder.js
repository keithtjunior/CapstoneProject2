import { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import FaunaFinderApi from './Api';
import SelectedContext from './context/SelectedContext';

import { useLocalStorage } from './hooks/useLocalStorage';

import Loading from './screens/Loading';
import NavBar from './components/NavBar';
import Home from './screens/Home';
import Fauna from './screens/Fauna';
import Faunae from './screens/Faunae';
import Taxa from './screens/Taxa';
import Locations from './screens/Locations'
import LocationsResults from './screens/LocationsResults';
import Error from './screens/Error';
import NotFound from './screens/NotFound';

const FaunaFinder = ({ initialFauna, initialLocation, taxonNames }) => {
    const [searchItems, setSearchItems] = useLocalStorage('searchItems', []);
    const [searchItem, setSearchItem] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [fauna, setFauna] = useState(initialFauna);
    const [faunae, setFaunae] = useState([]);
    const [taxon, setTaxon] = useState([]);
    const [taxa, setTaxa] = useState({});
    const [location, setLocation] = useState(initialLocation);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    let history = useHistory();

    useEffect(() => {
        try {
            setIsLoading(true);
            const newTaxa = taxonNames.reduce((acc, name) => {
                return { ...acc, [name[0]]: faunae
                    .filter(item => item.taxonName == name[0])}
            }, {});
            setTaxa(newTaxa);
            setIsLoading(false);
        } catch (err) {
            history.push('/error');
        }
    }, [faunae]);

    const getFauna = async (id) => {
        try {
            setFauna(initialFauna);
            return await FaunaFinderApi.getFauna(id)
            .then(res => {
                if(res.id){
                    addSearchItems('g', id, res.commonName || res.matchedTerm);
                    setFauna(res);
                    return res
                }else{
                    setFauna(null);
                    return null;
                }
            })
            .catch((err) => null)
        } catch (err) {
            history.push('/error');
        }
    }

    const getFaunae = async (val) => {
        try {
            setIsLoading(true);
            const res = await FaunaFinderApi.getFaunae({species: val.trim()});
            setFaunae(res);
            setIsLoading(false);
            history.push('/taxa');
            addSearchItems('gf', {species: val.trim()}, val.trim());
        } catch (err) {
            history.push('/error');
        }
    }

    const getFaunaeAuto = async (val) => {
        try {
            const res = await FaunaFinderApi.getFaunaeAuto({species: val.trim()});
            setFaunae(res);
        } catch (err) {
            history.push('/error');
        }
    }

    const getFaunaeByPlace = async (data) => {
        try {
            setIsLoading(true);
            const res = await FaunaFinderApi.getFaunaeByPlace(data);
            setFaunae(res);
            setIsLoading(false);
            history.push('/taxa');
            if(searchItem.length) addSearchItems('gfp', data);
        } catch (err) {
            history.push('/error');
        }
    }

    const getFaunaeByContinent = async (data) => {
        try {
            setIsLoading(true);
            const res = await FaunaFinderApi.getFaunaeByContinent(data);
            setFaunae(res);
            setIsLoading(false);
            history.push('/taxa');
            if(searchItem.length) addSearchItems('gfc', data);
        } catch (err) {
            history.push('/error');
        }
    }

    const getByLocations = async (term, data) => {
        try {
            setIsLoading(true);
            const res = await FaunaFinderApi.getByLocations(data);
            setFaunae(res);
            setIsLoading(false);
            history.push('/taxa');
            addSearchItems('gl', data, term);
        } catch (err) {
            history.push('/error');
        }
    }

    const getLocationsAuto = async (val) => {
        try {
            setIsLoading(true);
            const res = await FaunaFinderApi.getLocationsAuto({term: val.trim()});
            setLocations(res);
            setIsLoading(false);
            history.push('/locations/results');
            if(searchItem.length) addSearchItems('gla', {term: val.trim()});
        } catch (err) {
            history.push('/error');
        }
    }

    const addSearchItems = (method, data, term=searchItem) => {
        let newSearchItems = [...searchItems];
        newSearchItems.unshift({
            term, 
            method, 
            data,
            time: new Date()});
        newSearchItems = newSearchItems.slice(0, 5);
        setSearchItems(newSearchItems);
        setSearchItem('');
    }

    const searchOptions = async (data) => {
        switch(data.method) {
            case 'g':
                /^\d+$/.test(data.data) ? 
                    history.push(`/faunae/${data.data}`) : 
                    history.push('/notfound');
                break;
            case 'gf':
                await getFaunae(data.data.species);
                break;
            case 'gfa':
                await getFaunaeAuto(data.data);
                break;
            case 'gfp':
                await getFaunaeByPlace(data.data);
                break;
            case 'gfc':
                await getFaunaeByContinent(data.data);
                break;
            case 'gl':
                await getByLocations(data.term, data.data);
                break;
            case 'gla':
                await getLocationsAuto(data.data.term);
                break;
            default:
                history.push('/notfound');
                break;
        }
    }

    const clearStorage = (path) => {
        window.localStorage.removeItem('searchItems');
        setSearchItems([]);
        history.push(path);
    }

    if (isLoading) 
        return (
            <Loading />
        );
    return (
        <>
        <SelectedContext.Provider value={{searchTerm, setSearchTerm}}>
        <Switch>
            <Route exact path='/'>
            <NavBar 
                getFaunae={getFaunae}
                setSearchItem={setSearchItem} />
                <Home 
                    faunae={faunae} 
                    getFaunae={getFaunae}
                    getFaunaeAuto={getFaunaeAuto}
                    getFaunaeByContinent={getFaunaeByContinent}
                    searchItems={searchItems}
                    setSearchItem={setSearchItem}
                    searchOptions={searchOptions}
                    clearStorage={clearStorage} />
            </Route>
            <Route exact path='/taxa'>
                <NavBar 
                    getFaunae={getFaunae}
                    setSearchItem={setSearchItem} />
                <Taxa 
                    taxa={taxa}
                    faunae={faunae}
                    taxonNames={taxonNames}
                    setTaxon={setTaxon} />
            </Route>
            <Route exact path='/faunae' >
                <NavBar 
                    getFaunae={getFaunae}
                    setSearchItem={setSearchItem} />
                <Faunae 
                    taxa={taxa}
                    taxon={taxon}
                    faunae={faunae}
                    taxonNames={taxonNames} />
            </Route>
            <Route exact path='/locations'>
                <NavBar 
                    getFaunae={getFaunae}
                    setSearchItem={setSearchItem} />
                <Locations
                    location={location}
                    setLocation={setLocation} 
                    searchItems={searchItems}
                    setSearchItem={setSearchItem}
                    searchOptions={searchOptions}
                    getByLocations={getByLocations}
                    getLocationsAuto={getLocationsAuto}
                    getFaunaeByContinent={getFaunaeByContinent}
                    clearStorage={clearStorage} />
            </Route>
            <Route exact path='/locations/results'>
                <NavBar 
                    getFaunae={getFaunae}
                    setSearchItem={setSearchItem} />
                <LocationsResults 
                    locations={locations}
                    setSearchItem={setSearchItem}
                    getFaunaeByPlace={getFaunaeByPlace} />
            </Route>
            <Route path='/faunae/:id' >
                <Fauna 
                    fauna={fauna} 
                    getFauna={getFauna}
                    getFaunae={getFaunae}
                    getFaunaeByPlace={getFaunaeByPlace}
                    setSearchItem={setSearchItem} />
            </Route>
            <Route exact path='/error'>
                <NavBar 
                    getFaunae={getFaunae}
                    setSearchItem={setSearchItem} />
                <Error/>
            </Route>
            <Route>
                <NavBar 
                    getFaunae={getFaunae}
                    setSearchItem={setSearchItem} />
                <NotFound setIsLoading={setIsLoading} />
            </Route>
        </Switch>
        </SelectedContext.Provider>
        </>
    )
}

FaunaFinder.defaultProps = {
    initialFauna: {
        id: null,
        name: '',
        rank: '',
        photoUrl: '',
        squareUrl: '',
        mediumUrl: '',
        commonName: '',
        matchedTerm: '',
        taxonName: '',
        parent_id: null,
        summary: '',
        wikiUrl: '',
        locations: []
    },
    initialLocation: {
        id: null,
        name: '',
        formattedAddress: '',
        lat: null,
        lng: null,
        swlat: null,
        swlng: null,
        nelat: null,
        nelng: null
    },
    taxonNames: [
        ['Actinopterygii', 'Fish'],
        ['Amphibia', 'Amphibians'],
        ['Animalia', 'Animals'],
        ['Arachnida', 'Arachnids'],
        ['Aves', 'Birds'],
        ['Insecta', 'Insects'],
        ['Mammalia', 'Mammals'],
        ['Mollusca', 'Mollusks'],
        ['Reptilia', 'Reptiles']
    ]
}

export default FaunaFinder;