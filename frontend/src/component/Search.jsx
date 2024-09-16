import React, { useState, useRef, useEffect } from 'react';
 // FontAwesome search icon (you can install it via npm if not installed)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUser, faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../css/Search.css';
import { useAllData } from '../context/AllDataCOntext';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Example suggestions, replace with actual data or API call
  // const suggestions = ['React', 'JavaScript', 'Node.js', 'YouTube Search', 'CSS Tricks'];
  const {files }= useAllData();
  console.log("search ",files);
  
 const suggestions = files.map(file=> file.name);
console.log("s",suggestions);

  const searchInputRef = useRef(null);
  const suggestionListRef = useRef(null);

  // Handle the search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter suggestions based on the query
    if (query.trim()) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false); // Hide the suggestions after selection
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current && !searchInputRef.current.contains(event.target) &&
        suggestionListRef.current && !suggestionListRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search action (can be a redirect or an API call)
  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div className='youtube-search-container'>
      <div className='youtube-search-bar'>
        <input
          type='text'
          placeholder='Search'
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          ref={searchInputRef}
          className='youtube-search-input'
        />
        <button onClick={handleSearch} className='youtube-search-button'>
        <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className='youtube-suggestions-list' ref={suggestionListRef}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelectSuggestion(suggestion)}
              className='youtube-suggestion-item'
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
