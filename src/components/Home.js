import React, { PureComponent } from 'react'
import { animate } from './../libs/animateNode'
import CloudViewer from '../libs/cloudViewer';

export default class Home extends PureComponent {
  
  elements = []

  componentDidMount() {
    const { data, onLoad } = this.props
    
    this.viewer = new CloudViewer(this._canvas, () => onLoad(true), null, [data.model])
  }
  
  render() {
    const { data, active, setSection, aboutSectionId} = this.props
    animate(active, this.elements)

    if (this.viewer) {
      if (!active) {
        this.viewer.enabled = false
      } else {
        this.viewer.enabled = true
      }
    }

    return (
      <div className='home fp-noscroll section' id='home'>
        <div style={{ backgroundColor: data.color }} ref={node => this._canvas = node} id='homescene' className='scene'> </div>
        <div ref={node => this.elements.push(node)} data-animation='fadeInRight' className='title'>
          <div>
            My name is <span onClick={() => setSection(aboutSectionId)}>Kuba</span>, <br/>I do cool sh*t & <br/> this is my <span onClick={() => setSection(2)}> book </span>
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
