import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import OptLogo from '../../assets/logo3.png'
import Slide1 from '../../assets/Item/PcCase.png'
import Slide2 from '../../assets/Item/MassageChair.png'
import tech1 from '../../assets/Item/monitor.png'
import life1 from '../../assets/Item/health.png'
import './home.css'

const home = () => {
  const navigate = useNavigate();
  //Array of items
  const itemSlide = [
    {
      title: 'HYTE HOSHIMACHI SUISEI Y70 PC CASE VOUCHER',
      points:'Points Needed : 150,000 pts',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet commodo nibh, id sagittis turpis. Nullam eget varius metus. In laoreet ante diam, ut consectetur mauris pellentesque eget. Morbi vitae ligula sed dolor sagittis interdum vel porttitor neque. Nam non orci at velit iaculis placerat nec sed dui. Donec luctus turpis ligula, ut gravida libero consectetur non. Mauris vulputate purus ac enim euismod, et tincidunt leo molestie.',
      image: Slide1,
    },
    {
      title: 'PRESTIGE MASSAGE CHAIR VOUCHER',
      points:'Points Needed : 300,000 pts',
      content: 'Proin volutpat leo non lorem auctor, vitae porttitor elit imperdiet. Sed congue leo ut nisl tincidunt egestas. Aliquam erat volutpat. Nunc ut dui sit amet ex pulvinar ultricies. Pellentesque et volutpat felis. Curabitur pellentesque urna justo, non iaculis nunc rutrum id. Mauris in felis et odio interdum faucibus nec in eros. Cras tincidunt ante in mauris malesuada, sed dictum sem molestie.',
      image: Slide2,
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % itemSlide.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='HomeContainer'>
      <div className='HeaderHome'>
        <img src={OptLogo} alt="" className='Opt1'/>
      </div>
      <NavBar/>
      {/*Slide Show*/}
      <div className='slideShow'>
        <div className='slideBox'>
          <div className='slide1Container'>
            <div className='slide1Image'>
              <img src={itemSlide[currentSlide].image} alt="" className='slide1Img'/>
            </div>
            <div className='slide1Detail'>
              <h1 className='slide1Title'>{itemSlide[currentSlide].title}</h1>
              <h3 className='slide1Point'>{itemSlide[currentSlide].points}</h3>
              <p className='slide1Content'>{itemSlide[currentSlide].content}</p>
            </div>
          </div>
        </div>
      </div>
      {/*Next Section */}
      <div className='NextSection'>
        <div className='HomeTechLife'>
          {/*Life Section*/}
          <div className='HomeLifeSection'>
            <div className='HomeLifeContainer'onClick={()=> navigate(`/Life`)}>
              <h2 className='catTitle'>Lifestyles Reward Vouchers</h2>
              <img src={life1} alt="" className="HomeitemImg" />
            </div>
          </div>
          {/*Tech Section*/}
          <div className='HomeTechSection'>
            <div className='HomeTechContainer'onClick={()=> navigate(`/Tech`)}>
              <h2 className='catTitle'>Technologies Reward Vouchers</h2>
              <img src={tech1} alt="" className="HomeitemImg" />
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>Contact Us</p>
            <p>About Us</p>
          </div>
          <div className="footer-right">
            <p>&copy; 2025 GIFT CAPSTONE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default home