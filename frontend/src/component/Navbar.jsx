import React, { useState, useRef, useEffect } from 'react';
import '../css/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import Search from './Search'; // Assuming the Search component is properly imported

const NavBar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sidebarRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current && !sidebarRef.current.contains(event.target) &&
      !event.target.closest('.sidebar-toggle')
    ) {
      setSidebarOpen(false);
    }

    if (
      searchRef.current && !searchRef.current.contains(event.target) &&
      !event.target.closest('.navbar-search')
    ) {
      setSearchOpen(false);
    }
  };

  // Track window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-name">
        { isSidebarOpen? <FontAwesomeIcon icon={faTimes} className="sidebar-toggle" onClick={toggleSidebar} />
         : <FontAwesomeIcon icon={faBars } className="sidebar-toggle" onClick={toggleSidebar} />
}
          <div className="navbar-title">Smart Notes</div>
        </div>
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <button type="button">Search</button>
        </div>
        <div className="navbar-profile">
          <FontAwesomeIcon icon={faUser} className="profile-icon" />
          <span className="profile-name">User Name</span>
        </div>
      </nav>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
      
      <Sidebar/>
       
      </div>
    </>
  );
};

export default NavBar;
