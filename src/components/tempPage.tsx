import { Link } from "react-router-dom";

function TempPage() {
  return (
    <div className="flex justify-center items-center">
      <h1>This page is not available right now</h1>
      <Link to={"/"}>
        <h2 className="font-bold text-blue-500 underline hover:text-blue-200">
          GO TO HOME
        </h2>
      </Link>
    </div>
  );
}

export default TempPage;
