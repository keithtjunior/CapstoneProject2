import Spinner from '../components/Spinner';
import Footer from '../components/Footer';

const Loading = () => {
    return (
        <>
            <div className="container-fluid blog py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <Spinner />
                    </div>
                </div>
            </div>

            <Footer />

        </>
    );
}

export default Loading;