// FolderContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

// Create a Context for all data
const AllDataContext = createContext();

// Create a provider component
export const AllDataProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]); // State for all files
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await axiosInstance.get('folders/', {
          params: { username }
        });
        console.log(response.data);
        
        setData(response.data);
        setFolders(response.data.folders);

        // Flatten the file arrays from each folder
        const allFiles = response.data.folders.flatMap(folder => folder.files);
        setFiles(allFiles);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  return (
    <AllDataContext.Provider value={{ data, folders, files, loading, error }}>
      {children}
    </AllDataContext.Provider>
  );
};

// Custom hook to use the AllDataContext
export const useAllData = () => useContext(AllDataContext);
