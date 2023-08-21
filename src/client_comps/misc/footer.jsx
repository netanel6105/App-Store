import React from 'react'

const Footer = () => {
  return (
    <div className='container' style={{ textAlign: 'center', padding: '1rem 0' }}>
    <p>Copyright ©️ {new Date().getFullYear()} Your Company Name</p>
    <p>All rights reserved</p>
    <p>Contact us: <a href="mailto:info@yourcompany.com">info@yourcompany.com</a></p>
  </div>
  )
}

export default Footer



{/* <div className='container-fluid' style={{ 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    color: '#fff',
    padding: '1rem'
  }}>
    <p>Copyright ©️ {new Date().getFullYear()} Your Company Name</p>
    <p>All rights reserved</p>
    <p>Contact us: <a href="mailto:info@yourcompany.com" style={{ color: '#fff' }}>info@yourcompany.com</a></p>
  </div> */}