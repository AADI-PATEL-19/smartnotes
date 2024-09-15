
import './App.css';
import Navbar from './component/Navbar';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import SignIn from './component/SignIn';
import Signup from './component/SignUp';
import Home from './component/Home';
import TextDisplay from './component/TextDisplay';


function App() {
  return (
    <div className="App">
        
          <BrowserRouter>

<Routes>

  <Route exact path="/home" element={< Home />} />
  <Route exact path="/" element={< SignIn />} />
  <Route exact path="/signUp" element={< Signup />} />
  <Route exact path="/extract-text" element={< TextDisplay />} />
 
</Routes>
</BrowserRouter>
          

    </div>
  );
}

export default App;
