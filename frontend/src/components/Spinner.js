const Spinner = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '75vh'
        }}>
            <div className='loader'>
                <span>Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;