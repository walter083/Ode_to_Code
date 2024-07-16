import React, {useState} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload"
import Home from "./Home";
import Login from "./Login";
import Excel from "./Excel";
import Calendar from "./Calendar";
import SalesTodoList from "./SalesTodoList";
import { Route, Routes } from "react-router-dom";
import removeCookie from './utils/removeCookie';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isClicked, setIsClicked] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const isLoginPage = location.pathname === '/login';

  return (
    <>      
      { !isLoginPage && <><div className="home-navbar">
          <div className='company-name-menubar'>
             {isClicked ? <CloseIcon className='close-icon' onClick={() => { setIsShow(!isShow); setIsClicked(!isClicked) }} /> : <MenuIcon className='menu-icon' onClick={() => { setIsShow(!isShow); setIsClicked(!isClicked) }} />}                 <h1>SalesHub</h1>
          </div>
          <Navbar />
      </div>
      <Sidebar isShow={isShow} navigate={navigate} removeCookie={removeCookie} /> </>}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/dataEntry' element={<FileUpload/>}></Route>
        <Route path="/viewData" element={<Excel/>}></Route>
        <Route path="/scheduleAppointment" element={<Calendar/>}></Route>
        <Route path="/todo" element={<SalesTodoList/>}></Route>
      </Routes>
    </>
  )
}

export default App;
