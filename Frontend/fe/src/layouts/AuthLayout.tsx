import { Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'
import logo from '../assets/en2436.svg'
import bg from '../assets/green-background.jpg'

const AuthLayout = () => {
  return (
    <div className='flex justify-center items-center h-screen min-h-screen bg-green-50 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-black/10"></div>
      <Container fixed maxWidth="xs" className='relative flex flex-col gap-5 justify-center items-center z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl'>
        <img src={logo} className='h-30' />
        <Outlet/>
      </Container>
    </div>
  )
}

export default AuthLayout