import ResultCard from './ResultCard';

const Result = ({ fauna }) => {
    return (
        <div className="result-item d-flex flex-column mb-1">
            <ResultCard fauna={fauna} />
        </div>
    )
}

export default Result;