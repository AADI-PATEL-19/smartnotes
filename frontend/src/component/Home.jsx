import React, { useState } from 'react';
import '../css/Home.css'; // Assuming you have some basic styling here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faUmbrella, faUpload } from '@fortawesome/free-solid-svg-icons';
import NavBar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
                     
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(file);
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTextFromImage = async (file) => {
    // Replace this with your actual OCR API call
    // For example, using a mock function:
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Extracted text from the image will appear here.');
      }, 1000);
    });
  };
  const handleExtractText = ()=>{
    // navigate('/extract-text');
    //  const baseUrl = process.env.REACT_APP_BASE_URL;
    window.open(`/extract-text` ,'_blank')
  }

  return (<>
  <NavBar/>
    <div className="home-container">
        
      <h1>Image Text Extractor</h1>
      <div className="image-upload-container">
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleImageChange}
            className="image-upload-input"
          />
          <label htmlFor="file-input" className="image-upload-label">
            {imagePreview ? (
              <img src={imagePreview} alt="Post" className="post-image-preview" />
            ) : (
              <div className="image-upload-placeholder">
                <p className='fa-image'>   <FontAwesomeIcon icon={faImage} className='fa-image-icon' /></p>
                <p>Click to select image</p>
              </div>
            )}
          </label>
{/* <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleImageChange}
            className="image-upload-input"/>

<label htmlFor="file-input" className="">

          <FontAwesomeIcon icon={faUpload} className='fa-image-icon' />
          <h1>Uppload image</h1>
    </label> */}




        </div>


        <button className='extract-txt-btn' onClick={()=>handleExtractText()}> Extract text </button>


     
     
    </div>
    </>
  );
};

export default Home;
