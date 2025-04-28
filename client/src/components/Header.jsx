import React from "react";
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "./Search";
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import {BsCart4} from 'react-icons/bs';
import {TiShoppingCart} from 'react-icons/ti'

const Header = () => {
  const [isMobile ]= useMobile()
  const location = useLocation()
  const navigate = useNavigate()
  const isSearchPage = location.pathname === "/search"

  const redirectToLoginPage = ()=>{
    navigate("/login")
  }
  return (
    <header className="h-20 shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {
        !(isSearchPage && isMobile) && (
          <div className="container mx-auto flex items-center px-2 justify-between">
            <div className="h-full">
              {/* logo */}
              <Link to={"/"} className="h-full flex justify-center items-center">
                <img
                  src={logo}
                  width={170}
                  height={60}
                  alt="logo"
                  className="hidden lg:block"
                />
                <img
                  src={logo}
                  width={120}
                  height={60}
                  alt="logo"
                  className="lg:hidden"
                />
              </Link>
            </div>
            {/**Search */}
            <div className="hidden lg:block">
              <Search />
            </div>

            {/* login and my cart */}
            <div className="">
              <button className='text-neutral-600 lg:hidden'>
                <FaRegUserCircle size={26}/>
              </button>

              {/* Desktop */}
              <div  className="hidden lg:flex items-center gap-10">
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  login
                </button>
                <button className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-2 py-3 rounded text-white">
                  {/* add to card icons */}
                  <div className="animate-bounce">
                    <BsCart4 size={30}/>
                  </div>
                  <div className="font-semibold">
                    <p>My Cart</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

        )
      }
      <div className='container mx-auto px-2 lg:hidden'>
            <Search/>
      </div>
    </header>
  );
};

export default Header;
