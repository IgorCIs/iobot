import React from 'react'
import { animate } from '../libs/animateNode';

let _loader

const Loader = ({ loaded, unMount }) => {
  if(loaded) animate(loaded, [_loader], () => {
    unMount()
  })
  
  return (
    <div className='loader' ref={node => _loader = node} data-animation='fadeOut'>
      <div></div>
    </div>
  )
}

export default Loader