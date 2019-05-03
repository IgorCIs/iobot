import React from 'react'
import { animate } from '../libs/animateNode';

const elements = []

const About = ({ data, active }) => {
  animate(active, elements)
  
  return (
    <div className='about section'>
      <div className='wrapper'> 
        <div className='title' data-animation='fadeInRight' ref={node => elements.push(node)}> {data.title} </div>
        <div className='subtitle' data-animation='fadeInRight'  ref={node => elements.push(node)}> {data.subtitle} </div>
        <div className='description'> 
          <div className='item'>
            <div className='description-title' data-animation='fadeInRight' ref={node => elements.push(node)}> {data.text.column1.title} </div>
            <div className='text' data-animation='fadeInRight' ref={node => elements.push(node)}> 
              {
                data.text.column1.paragraphs.map((item, key) => (
                  <div key={key}> {item} </div>
                ))
              }
            </div>
            <div className='button' data-animation='fadeInRight' ref={node => elements.push(node)}>
              <a target='_blank' rel='noopener noreferrer' href={data.cvLink}> Download full cv (pdf) </a>
            </div>
          </div>
          <div className='item' >
            <div className='description-title' data-animation='fadeInRight' ref={node => elements.push(node)}> {data.text.column2.title} </div>
            <div className='text' data-animation='fadeInRight' ref={node => elements.push(node)}> 
              {
                data.text.column2.paragraphs.map((item, key) => (
                  <div key={key}> {item} </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
