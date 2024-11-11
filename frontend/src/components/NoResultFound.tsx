import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export const NoResultFound = ({ searchText }: { searchText: string }) => {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700">
          No results found
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          We couldn't find any results for "{searchText}". <br /> Try searching
          with a different term.
        </p>
        <Link to="/">
          <Button variant="contained" className="mt-4 bg-orange hover:bg-orangeHover">
            Go Back to Home
          </Button>
        </Link>
      </div>
    );
  };