import React, { PureComponent } from 'react'
import { Viewer } from '../libs/imageSwitcherViewer';



export class Projects extends PureComponent {
  componentDidMount() {
    this.setViewer()
    console.log( this._images.querySelectorAll('img'))
  }
  
  setViewer() {
    this.viewer = new Viewer(this._canvas, this._images.querySelectorAll('img'))
  }
  
  render() {
    const { active, activeSlide, setCurrentSlide, setProject, data } = this.props

    return (
      <> 
        <div className='section fp-noscroll projects'>
          <div className='project'> 
            <div className='project-title' onClick={() => this.viewer.changeImage()}> {data[active].name} </div>
            <div ref={node => this._canvas = node} className='project-scene'> </div>
            <div className='project-description'> {data[active].description} </div>
          </div>
        </div>
        <div ref={node => this._images = node} className='project-images'> 
          {
            data[active].images.map((item, i) => 
              <img crossOrigin='Anonymous' key={i} src={item}/>
            )
          }
          <img crossOrigin='Anonymous' src='https://yt3.ggpht.com/a-/AAuE7mCax9HNjRt69R3m26m--nqsN28pEhOwOMHvQw=s900-mo-c-c0xffffffff-rj-k-no'/>

        </div>
        <div className='project-all-images'>
          {
            data.map(project =>
              project.images.map((item, i) => 
                <img key={i} src={item}/>
            ))
          }
          <img src='https://yt3.ggpht.com/a-/AAuE7mCax9HNjRt69R3m26m--nqsN28pEhOwOMHvQw=s900-mo-c-c0xffffffff-rj-k-no'/>
        </div>
      </>
    )
  }
}

export default Projects
