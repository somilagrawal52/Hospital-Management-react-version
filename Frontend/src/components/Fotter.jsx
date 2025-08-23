import React from 'react'
import { assets } from '../assets/assets'

const Fotter = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* left section */}
        <div>
            <img className='w-40 mb-5' src={assets.logo} alt="" />
            <p className='w-full leading-6 text-gray-600 md:w-2/3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus consequatur, quaerat in tenetur accusamus deserunt, eos excepturi eius rem, modi nesciunt quo quos aliquam vitae provident corrupti consequuntur nobis natus commodi atque maxime ipsum laboriosam possimus voluptatem! Unde nulla, laudantium obcaecati odit mollitia, in vel ipsam, neque hic aut fugiat!</p>
        </div>
        {/* center section */}
        <div>
            <p className='mb-5 text-xl font-medium'>Company</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
              <li>Home</li>
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Privacy Policy</li>
            </ul>
        </div>
        {/* right section */}
        <div>
            <p className='mb-5 text-xl font-medium'>Get in touch</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
              <li>+1-212-345-6547</li>
              <li>example@gmail.com</li>
            </ul>
        </div>
      </div>
      {/* copyright text */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ Prescripto - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Fotter
