import React, { Component } from 'react'
import { Viewer } from '../libs/imageSwitcherViewer';
import { animate } from '../libs/animateNode';



export class Projects extends Component {
  constructor(props) {
    super(props)
    this.canvases = []
    this.images = []
  }
  
  componentDidMount() {
    this.setViewer()
  }
  
  setViewer() {
    const { data } = this.props

    this.viewer = new Viewer(this._canvas, this._images.querySelectorAll('img'), data[0]['fist-slide-color'], true)
  }

  render() {
    const { active, activeSlide, setCurrentSlide, data } = this.props
    const activeLastSlide = data[active].images.length + 1 === activeSlide

    if (activeSlide === 0 && this.viewer) {
      this.viewer.setImage(this._titles.querySelectorAll('img')[active])
      this.viewer.setColor(data[active]['fist-slide-color'])
    } 
    
    if(activeLastSlide) {
      this._title.style.display = 'block'
      setTimeout(() => animate(activeLastSlide, [this._title], () => this._title.style.display = 'none'), 1000 )
    } 
      
    return (
      <div className='section fp-noscroll projects'>
        <div className='slide fp-noscroll'>
          <div className='first-slide'>
            <div ref={node => this._canvas = node} className='project-scene'> </div>
          </div>
        </div>

        {data[active].images.map((item, i) =>       
          <div key={i} className='slide fp-noscroll'> 
            <div className='image-slide'>
              <img src={item} alt=''/>
            </div>
          </div>
        )}

        <div className='slide descr-wrapper fp-noscroll' style={{background: data[active]['last-slide-color']}}>
          <div className='descr-slide' >
            <div className='title' data-animation='fadeOutLeft' ref={node => this._title = node}> {data[active].name} </div>
            <div className='descr'>
              {data[active].description}
            </div>
          </div>
        </div>

        <div className='pagination-list'>
          {[...data[active].images, 's', 's'].map((item, i) => 
            <div key={i} onClick={() => setCurrentSlide(i)}  className={`item ${activeSlide === i ? 'active' : '' }`}>
              <div/>
            </div>
          )}
        </div>

        <>
          <div ref={node => this._images = node} className='project-images'> 
              <img crossOrigin='Anonymous' alt='' src={data[active]['title-image']}/>
              <img crossOrigin='Anonymous' alt='' src={data[active]['title-image']}/>
          </div>

          <div ref={node => this._titles = node} className='project-images'> 
            {
              data.map((item, i) => (
                <img crossOrigin='Anonymous' alt='' key={i} src={item['title-image']}/>
              ))
            }
          </div>
        </>
      </div>
    )
  }
}

export default Projects
