import React, { Component } from 'react'
import { animate } from '../libs/animateNode';

export class Thanks extends Component {
  componentDidMount() {
    this.elements = [...document.querySelectorAll('.thanks [data-animation]')]
  }

  render() {
    const { data, active } = this.props
    animate(active, this.elements)
    
    return (
      <div className='thanks fp-noscroll section'>
          <div className='title' data-animation='fadeInRight'> {data.title} </div> 
          <div className='email' data-animation='fadeInLeft'>
            <a href={`mailto:${data.links.email}`}> {data.links.email} </a>
          </div>
          <div className='phone' data-animation='fadeInRight'>
            <a href={`tel:${data.links.mobile}`}> {data.links.mobile} </a>
          </div>

        <div className='footer'>
          <div className='subtitle' data-animation='flipInX'> {data.subtitle} </div>
          <div className='contacts'>
            <div className='back' data-animation='fadeInUp' onClick={() => this.props.onClick()}> go back up </div>
            </div>
        </div>
      </div>      
    )
  }
}

export default Thanks
