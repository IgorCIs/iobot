import React, { Component } from 'react'
import { animate } from '../libs/animateNode';

class About extends Component {
  componentDidMount() {
    this.elements = [...document.querySelectorAll('.about [data-animation]')]

    window.addEventListener('resize', () => this.centerTitle())
  }

  componentDidUpdate() {
    console.log(this._descrOffset, window.innerWidth <= 1024, window.innerWidth >= 575)
    
    this.centerTitle()
  }
  
  centerTitle() {
    if(this._descrOffset && window.innerWidth <= 1024 && window.innerWidth >= 575) {
      if (this._title && this._subTitle) {
        this._title.style.paddingLeft = this._descrOffset.offsetLeft - 30 + 'px'
        this._subTitle.style.paddingLeft = this._descrOffset.offsetLeft - 30 + 'px'
      }
    } else {
      if (this._title && this._subTitle) {
        this._title.style.paddingLeft = 'unset'
        this._subTitle.style.paddingLeft = 'unset' 

      }
    }
  }
  
  render() {
    const { data, active } = this.props
    animate(active, this.elements)
    
    return (
      <div className='about section'>
        <div className='wrapper'> 
          <div ref={node => this._title = node} className='title' data-animation='fadeInRight'> {data.title} </div>
          <div ref={node => this._subTitle = node} className='subtitle' data-animation='fadeInRight' > {data.subtitle} </div>
          <div className='description'> 
            <div className='item' ref={node => this._descrOffset = node}>
              <div className='description-title' data-animation='fadeInRight'> {data.text.column1.title} </div>
              <div className='text' data-animation='fadeInRight'> 
                {
                  data.text.column1.paragraphs.map((item, key) => (
                    <div key={key}> {item} </div>
                  ))
                }
              </div>
              <div className='button mdn' data-animation='fadeInRight'>
                <a target='_blank' rel='noopener noreferrer' href={data.cvLink}> Download full cv (pdf) </a>
              </div>
            </div>
            <div className='item' >
              <div className='description-title' data-animation='fadeInRight'> {data.text.column2.title} </div>
              <div className='text' data-animation='fadeInRight'> 
                {
                  data.text.column2.paragraphs.map((item, key) => (
                    <div key={key}> {item} </div>
                  ))
                }
                <div className='button mdb' data-animation='fadeInRight'>
                  <a target='_blank' rel='noopener noreferrer' href={data.cvLink}> Download full cv (pdf) </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default About
