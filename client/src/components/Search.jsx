import React, {useState, useEffect} from "react";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  // Check if the current page is the search page
  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };
  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 shadow-md group focus-within:border-primary-200">
      <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
        <IoSearch size={22} />
      </button>
      <div className="">
        {
          isSearchPage ? (
            //not in search page
            <div className="" onClick={redirectToSearchPage}>
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  'Search "milk"',
                  1000, // wait 1s before replacing "Mice" with "Hamsters"
                  'Search "bread"',
                  1000,
                  'Search "sugar"',
                  1000,
                  'Search "panner"',
                  1000,
                  'Search "chocolate"',
                  1000,
                  'Search "curd"',
                  1000,
                  'Search "rice"',
                  1000,
                  'Search "egg"',
                  1000,
                  'Search "chips"',
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
          ) : (
            // in search page
            <div className="">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent"
              />
            </div>
          )
        }
      </div>
      
    </div>
  );
};

export default Search;
