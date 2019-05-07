import React, { Component } from 'react'
import { animate } from '../libs/animateNode';

export class Thanks extends Component {
  constructor(props) {
    super(props)

    this.elements = []
  }
  
  render() {
    const { data, active } = this.props
    animate(active, this.elements)
    
    return (
      <div className='thanks fp-noscroll section'>
          <div className='title' ref={node => this.elements.push(node)} data-animation='fadeInRight'> {data.title} </div> 
          <div className='email' ref={node => this.elements.push(node)} data-animation='fadeInLeft'>
            <a href={`mailto:${data.links.email} `}> {data.links.email} </a>
          </div>
          <div className='phone' ref={node => this.elements.push(node)} data-animation='fadeInRight'>
            <a href={`tel:${data.links.mobile} `}> {data.links.mobile} </a>
          </div>

        <div className='footer'>
          <div className='subtitle' ref={node => this.elements.push(node)} data-animation='flipInX'> {data.subtitle} </div>
          <div className='contacts'>
            <div className='back' ref={node => this.elements.push(node)} data-animation='fadeInUp' onClick={() => this.props.onClick()}> go back up </div>
            </div>
        </div>
      </div>      
    )
  }
}

export default Thanks
