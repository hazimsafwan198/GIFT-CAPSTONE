import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Component/Login/login'
import Background from './Component/Background/bg'
import Register from './Component/Register/reg'
import Home from './Component/Home/home'
import Forgot from './Component/Forgot/forgotPassword'
import Life from './Component/Life/life'
import Tech from './Component/Tech/tech'
import Voucher from './Component/Detail/detvou'
import Profile from './Component/Profile/about'
import Cart from './Component/Cart/cart'
import Dev from './Component/DevItem/devitem'
import Redeem from './Component/Redeem/redeem'
import 'bootstrap/dist/css/bootstrap.css';
  

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<BackgroundWrapper><Login /></BackgroundWrapper>}/>
        <Route path="/Login" element={<BackgroundWrapper><Login /></BackgroundWrapper>}/>
        <Route path='/Register' element={<BackgroundWrapper><Register/></BackgroundWrapper>}/>
        <Route path='/Forgot' element={<BackgroundWrapper><Forgot/></BackgroundWrapper>}/>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/Life' element={<Life/>}/>
        <Route path='/Tech' element={<Tech/>}/>
        <Route path='/Voucher/:id' element={<Voucher/>}/>
        <Route path='/Cart' element={<Cart/>}/>
        <Route path='/Redeem' element={<Redeem/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/Dev' element={<Dev/>}/>
      </Routes>
    </Router>
  )
}

// Helper component to wrap pages with Background
const BackgroundWrapper = ({ children }) => (
  <>
    <Background />
    {children}
  </>
)
export default App