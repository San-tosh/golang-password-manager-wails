import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  
    return (
      <>
        <div className="flex justify-center items-center h-screen bg-navy-600">
          <div id="error-page">
            <h1 className="lg:text-6xl font-bold text-2xl text-white">Oops!</h1>
            <p className="text-xl text-white mb-3 mt-3">
              Sorry, an unexpected error has occurred.
            </p>
            <p className="text-3xl text-white">
              Access Denied
            </p>
            <div className="mt-5">
              <Link
                to="/"
                className="px-5 py-2 bg-white rounded-md hover:bg-gray-100"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }