
import './App.css';
import Navbar from './component/Navbar';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import SignIn from './component/SignIn';
import Signup from './component/SignUp';
import Home from './component/Home';
import TextDisplay from './component/TextDisplay';
import Folders from './component/Folders';
import { About } from './component/About';
import { AllDataProvider } from './context/AllDataCOntext';

function App() {
  return (
    <div className="App">
        
          <BrowserRouter>
          <AllDataProvider>
<Routes>
  <Route exact path="/home" element={< Home />} />
  <Route exact path="/" element={< SignIn />} />
  <Route exact path="/signUp" element={< Signup />} />
  <Route exact path="/extract-text" element={< TextDisplay />} />
  <Route exact path="/profile" element={< Folders />} />


</Routes>
</AllDataProvider>
</BrowserRouter>
          

    </div>
  );
}

export default App;
