// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import '../css/TextDisplay.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCopy, faSave, faDownload, faFilePdf, faFileWord, faFileAlt } from '@fortawesome/free-solid-svg-icons';
// import axiosInstance from '../utils/axiosInstance';

// const downloadFile = (content, filename, mimeType) => {
//   const blob = new Blob([content], { type: mimeType });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// };

// export default function TextDisplay() {
//   const username = localStorage.getItem('username');
//   const textareaRef = useRef(null);
//   const dropdownRef = useRef(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [saveModal, setSaveModal] = useState(false);
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [folderName, setFolderName] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [folderNames, setFolderNames] = useState([]); // Store all folder names
//   const [filteredFolderNames, setFilteredFolderNames] = useState([]); // Store filtered folder names
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const folderInputRef = useRef(null);
//   const suggestionListRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         folderInputRef.current && !folderInputRef.current.contains(event.target) && 
//         suggestionListRef.current && !suggestionListRef.current.contains(event.target)
//       ) {
//         setShowSuggestions(false); // Close the suggestion list if clicked outside
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchFolders = async () => {
//       try {
//         const response = await axiosInstance.get('/folders/'); // Replace with your backend endpoint
//         setFolderNames(response.data); // Store all folder names
//         setFilteredFolderNames(response.data); // Initialize filtered folders with all folder names
//       } catch (error) {
//         console.error('Error fetching folders:', error);
//       }
//     };
//     fetchFolders();
//   }, []);

//   const autoResize = () => {
//     const textarea = textareaRef.current;
//     textarea.style.height = 'auto';
//     textarea.style.height = `${textarea.scrollHeight}px`;
//   };

//   useEffect(() => {
//     const textarea = textareaRef.current;
//     textarea.addEventListener('input', autoResize);
//     autoResize();
//     return () => {
//       textarea.removeEventListener('input', autoResize);
//     };
//   }, []);

//   const copyToClipboard = () => {
//     const textarea = textareaRef.current;
//     textarea.select();
//     document.execCommand('copy');
//   };

//   const saveText = () => {
//     setSaveModal(true);
//     setFolderName(''); // Reset folder name input
//     setFilteredFolderNames(folderNames); // Reset filtered folders to all folders
//   };

//   const handleDownload = (format) => {
//     const textarea = textareaRef.current;
//     const text = textarea.value;
//     const filename = `document.${format}`;

//     if (format === 'pdf') {
//       import('jspdf').then(({ jsPDF }) => {
//         const doc = new jsPDF();
//         doc.text(text, 10, 10);
//         doc.save(filename);
//       });
//     } else if (format === 'doc') {
//       downloadFile(text, filename, 'application/msword');
//     } else if (format === 'txt') {
//       downloadFile(text, filename, 'text/plain');
//     }
//     setDropdownOpen(false);
//   };

//   const handleSave = async () => {
//     try {
//         // Define a default folder name
//         const defaultFolderName = 'DefaultFolder';

//         // Use the default folder name if none is provided
//         const folderToUse = folderName.trim().length > 0 ? folderName : defaultFolderName;

//         // Prepare the data to send to the backend
//         const data = {
//             username: username, // Ensure username is set
//             folder_name: folderToUse,
//             file_name: fileName,
//             content: textareaRef.current.value,
//         };

//         console.log('Sending data:', data); // Add this line to log the data being sent

//         // Make a POST request to the backend
//         await axiosInstance.post('/create-folder-file/', data); // Ensure the URL matches your Django endpoint

//         // Show success message
//         alert('Folder and file saved successfully!');

//         // Reset state and close modal
//         setSaveModal(false);
//         setFileName('');
//         setFolderName('');
//     } catch (error) {
//         console.error('Error saving file:', error.response ? error.response.data : error.message);

//         // Show error message
//         alert('Error saving file. Please try again.');
//     }
// };




  
//   const handleCancel = () => {
//     setSaveModal(false);
//     setFileName('');
//     setFolderName('');
//   };

//   useEffect(() => {
//     if (fileName.length > 0 && folderName.length > 0) {
//       setIsDisabled(false);
//     } else {
//       setIsDisabled(true);
//     }
//   }, [fileName, folderName]);

//   // Handle folder name input change
//   const handleFolderNameChange = (e) => {
//     const input = e.target.value;
//     setFolderName(input);

//     // Filter folder names based on input
//     const filtered = folderNames.filter((folder) =>
//       folder.toLowerCase().includes(input.toLowerCase())
//     );
//     setFilteredFolderNames(filtered);

//     // Enable/disable OK button
//     if (fileName.length > 0 && input.length > 0) {
//       setIsDisabled(false);
//     } else {
//       setIsDisabled(true);
//     }
//   };

//   const handleOnFocus = () => {
//     setShowSuggestions(true);
//   };

//   const handleSelectFolder = (folder) => {
//     setFolderName(folder);
//     setFilteredFolderNames([]); // Hide suggestions after selection
//   };

//   return (
//     <>
//       <div className='header'>Extracted Text</div>
//       <div className='text-container'>
//         <textarea 
//           ref={textareaRef}
//           placeholder="Extracted Text Display here..." 
//           className="text-input"
//         />
//         <div className='buttons'>
//           <button onClick={copyToClipboard} className='btn'>
//             <FontAwesomeIcon icon={faCopy} /> Copy
//           </button>
//           <button onClick={saveText} className='btn'>
//             <FontAwesomeIcon icon={faSave} /> Save
//           </button>
//           <div className='dropdown open' ref={dropdownRef}>
//             <button 
//               onClick={() => setDropdownOpen(!dropdownOpen)} 
//               className='btn dropdown-button'
//             >
//               <FontAwesomeIcon icon={faDownload} /> Download
//             </button>
//             {dropdownOpen && (
//               <div className='dropdown-menu'>
//                 <button onClick={() => handleDownload('txt')} className='dropdown-item txt'>
//                   <FontAwesomeIcon icon={faFileAlt} className='text-file' /> TXT
//                 </button>
//                 <button onClick={() => handleDownload('pdf')} className='dropdown-item pdf'>
//                   <FontAwesomeIcon icon={faFilePdf} className='pdf-file' /> PDF
//                 </button>
//                 <button onClick={() => handleDownload('doc')} className='dropdown-item doc'>
//                   <FontAwesomeIcon icon={faFileWord} className='doc-file' /> Word
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {saveModal && (
//         <div className='modal'>
//           <div className='modal-content'>
//             <h2>Save Document</h2>
//             <p className='input-label'>File Name</p>
//             <input 
//               type='text' 
//               placeholder='Enter File Name' 
//               value={fileName}
//               onChange={(e) => setFileName(e.target.value)}
//               className='modal-input'
//             />
//             <div className='folder-input-container'>
//               <p className='input-label'>Folder Name</p>
//               <input 
//                 ref={folderInputRef}
//                 type='text' 
//                 placeholder='Enter Folder Name' 
//                 value={folderName}
//                 onChange={handleFolderNameChange}
//                 onFocus={handleOnFocus}
//                 className='modal-input'
//               />
//               {/* Display matching folder names */}
//               {showSuggestions && filteredFolderNames.length > 0 && (
//                 <ul className='folder-suggestions' ref={suggestionListRef}>
//                   {filteredFolderNames.map((folder, index) => (
//                     <li 
//                       key={index} 
//                       onClick={() => handleSelectFolder(folder)}
//                       className='folder-suggestion-item'
//                     >
//                       {folder}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//             <div className='modal-buttons'>
//               <button onClick={handleCancel} className='modal-btn cancel'>
//                 Cancel
//               </button>
//               <button onClick={handleSave} disabled={isDisabled} className={`modal-btn ${isDisabled ? 'disabled' : ''}`}>
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import '../css/TextDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faSave, faDownload, faFilePdf, faFileWord, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useAllData } from '../context/AllDataCOntext';

export default function TextDisplay() {
  const username = localStorage.getItem('username');
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);
  const folderInputRef = useRef(null);
  const suggestionListRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [folderNames, setFolderNames] = useState([]); // Store all folder names
  const [filteredFolderNames, setFilteredFolderNames] = useState([]); // Store filtered folder names
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { folders, loading, error } = useAllData();
  useEffect(() => {
    if (!loading && !error) {
      const folderNames = folders.map(folder => folder.folder_name); // Extract folder names
      setFilteredFolderNames(folderNames);
    }
  }, [folders, loading, error]);

  // useEffect(() => {
  //   const fetchFolders = async () => {
  //     const username = localStorage.getItem('username')
  //     console.log(username);
      
  //           try {
  //       const response = await axiosInstance.get('folders/', {
  //         params: { username } // Sending username as a query parameter
  //       });
  //       console.log(response.data);
    
  //       // Extract folder names from the response data
  //       const folders = response.data.folders;
  //       const folderNames = folders.map(folder => folder.folder_name); // Extract folder names
    
  //       setFolderNames(folderNames); // Set folder names state
  //       setFilteredFolderNames(folderNames); // Initialize filtered folder names
    
  //       console.log('Extracted folder names:', folderNames);
  //     } catch (error) {
  //       console.error('Error fetching folders:', error);
  //     }
  //   };
    
  //   fetchFolders();
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        folderInputRef.current && 
        !folderInputRef.current.contains(event.target) &&
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target)
      ) {
        setShowSuggestions(false); // Close suggestions if clicking outside
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const copyToClipboard = () => {
    const textarea = textareaRef.current;
    textarea.select();
    document.execCommand('copy');
  };

  const saveText = () => {
    setSaveModal(true);
    setFolderName('');
    setFilteredFolderNames(folderNames); // Reset filtered folders
  };

  const handleDownload = (format) => {
    const textarea = textareaRef.current;
    const text = textarea.value;
    const filename = `document.${format}`;

    if (format === 'pdf') {
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();
        doc.text(text, 10, 10);
        doc.save(filename);
      });
    } else if (format === 'doc') {
      // downloadFile(text, filename, 'application/msword');
    } else if (format === 'txt') {
      // downloadFile(text, filename, 'text/plain');
    }
    setDropdownOpen(false);
  };

  const handleSave = async () => {
    const content = textareaRef.current.value;
    
    try {
      await axiosInstance.post('create-folder-file/', {
        username, // Assuming you store or input the username
        folder_name: folderName,
        file_name: fileName,
        content: content,
      });

      setSaveModal(false);
      setFileName('');
      setFolderName('');
    } catch (error) {
      console.error('Error saving file:', error.response ? error.response.data : error.message);
    }
  };

  const handleCancel = () => {
    setSaveModal(false);
    setFileName('');
    setFolderName('');
  };

  useEffect(() => {
    if (fileName.length > 0 && folderName.length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [fileName, folderName]);

  const handleFolderNameChange = (e) => {
    const input = e.target.value;
    setFolderName(input);
  
    // Filter based on the folder names
    const filtered = folderNames.filter((folder) =>
      folder.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredFolderNames(filtered);
  
    setShowSuggestions(filtered.length > 0);
    setIsDisabled(!(fileName.length > 0 && input.length > 0));
  };
  

  const handleSelectFolder = (folder) => {
    setFolderName(folder);
    setFilteredFolderNames([]); // Hide suggestions after selection
    setShowSuggestions(false); // Hide suggestions
  };

  return (
    <>
      <div className='header'>Extracted Text</div>
      <div className='text-container'>
        <textarea 
          ref={textareaRef}
          placeholder="Extracted Text Display here..." 
          className="text-input"
        />
        <div className='buttons'>
          <button onClick={copyToClipboard} className='btn'>
            <FontAwesomeIcon icon={faCopy} /> Copy
          </button>
          <button onClick={saveText} className='btn'>
            <FontAwesomeIcon icon={faSave} /> Save
          </button>
          <div className='dropdown open' ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
              className='btn dropdown-button'
            >
              <FontAwesomeIcon icon={faDownload} /> Download
            </button>
            {dropdownOpen && (
              <div className='dropdown-menu'>
                <button onClick={() => handleDownload('txt')} className='dropdown-item txt'>
                  <FontAwesomeIcon icon={faFileAlt} className='text-file' /> TXT
                </button>
                <button onClick={() => handleDownload('pdf')} className='dropdown-item pdf'>
                  <FontAwesomeIcon icon={faFilePdf} className='pdf-file' /> PDF
                </button>
                <button onClick={() => handleDownload('doc')} className='dropdown-item doc'>
                  <FontAwesomeIcon icon={faFileWord} className='doc-file' /> Word
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {saveModal && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Save Document</h2>
            <p className='input-label'>File Name</p>
            <input 
              type='text' 
              placeholder='Enter File Name' 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className='modal-input'
            />
            <div className='folder-input-container'>
              <p className='input-label'>Folder Name</p>
              <input 
                ref={folderInputRef}
                type='text' 
                placeholder='Enter Folder Name' 
                value={folderName}
                onChange={handleFolderNameChange}
                onFocus={() => setShowSuggestions(true)}
                className='modal-input'
              />
              {showSuggestions && filteredFolderNames.length > 0 && (
                <ul className='folder-suggestions' ref={suggestionListRef}>
                  {filteredFolderNames.map((folder, index) => (
                    <li 
                      key={index} 
                      onClick={() => handleSelectFolder(folder)}
                      className='folder-suggestion-item'
                    >
                      {folder}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='modal-buttons'>
              <button onClick={handleCancel} className='modal-btn cancel'>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isDisabled} className={`modal-btn ${isDisabled ? 'disabled' : ''}`}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
