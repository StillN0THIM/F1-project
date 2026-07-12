import tyreImg from "../assets/tyre-removebg-preview.png";

function LoadingSpinner({ isSlow }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <img
                src={tyreImg}
                alt="Loading"
                className="w-16 h-16 animate-spin"
                style={{ animationDuration: "0.1s" }}
            />
            <p className="text-muted text-sm">Loading...</p>
            {isSlow && (
                <p className="text-xs text-muted text-center max-w-xs">
                    Server's waking up — this can take up to a minute on first load.
                </p>
            )}
        </div>
    );
}

export default LoadingSpinner;