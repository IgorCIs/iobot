import React from 'react'
import isMobile from 'is-mobile'

const Logo = () => {
  return (
    <div className={`${isMobile() ? 'mobile' : ''} animated fadeInLeft logo`}>
      
    </div>
  )
}

export default Logo