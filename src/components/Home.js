import React, { Component } from 'react'
import animateNode, { animate } from './../libs/animateNode'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.elements = []
  }
  

  
  render() {
    const { data, active } = this.props
    animate(active, this.elements)

    return (
      <div className='home fp-noscroll section'>
        <div ref={node => this.elements.push(node)} data-animation='fadeInRight' className='title'>
            <div dangerouslySetInnerHTML={{ __html: data.title }}> 
            </div>
        </div>
        <div className='contacts'>
          <div className='wrapper'>
            <div className='email'>
              <a className='fadeInUp' data-animation='fadeInUp' ref={node => this.elements.push(node)} href={`mailto:${data.links.email}`}> {data.links.email} </a>
            </div>
            <div className='phone'>
              <a className='fadeInUp' data-animation='fadeInUp' ref={node => this.elements.push(node)}  href={`tel${data.links.mobile}`}> {data.links.mobile} </a>
            </div>
          </div>

        </div>

      </div>  
    )
  }
}
