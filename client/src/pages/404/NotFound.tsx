import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-8xl font-bold text-black">404</h1>

      <p className="mt-4 text-xl text-gray-600">
        Oops! This board seems to have drifted away.
      </p>

      <p className="mt-2 text-gray-400">
        The page you are looking for doesn't exist or has been moved to a
        different workspace.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
