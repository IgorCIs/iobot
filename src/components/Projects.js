import React, { Component } from 'react'
import { Viewer } from '../libs/imageSwitcherViewer';
import { animate } from '../libs/animateNode';



export class Projects extends Component {
  constructor(props) {
    super(props)
    this.canvases = []
    this.images = []
  }

  state = {
    blockScroll: false
  }
  
  componentDidMount() {
    this.setViewer()
    this.events = 0
    this.setScroll()
  }

  setScroll() {
    const { setCurrentSlide } = this.props
    
    const scrollSlide = e => {
      // if (e.deltaX) {
      //   const delta = e.deltaX >= 1 ? 1 : -1
      //   console.log(delta)
      //   const nextSlide = this.slidesLength < this.props.activeSlide + 0 ? 1 : this.props.activeSlide + 1 
      //   delta === 1 ? setCurrentSlide(nextSlide) : setCurrentSlide(this.props.activeSlide - 1)

        
      //   this._element.removeEventListener('mousewheel', scrollSlide)
      //   this._element.addEventListener('mousewheel', scrollSlide)
      // }
    }
    
    // this._element.addEventListener('mousewheel', scrollSlide)
  }
  
  setViewer() {
    const { data } = this.props
    
    const firstImage = this._images.querySelectorAll('img')[0]

    const initViewer = () => {
      this.viewer = new Viewer(this._canvas, this._images.querySelectorAll('img'), data[0]['fist-slide-color'], true)
      firstImage.removeEventListener('load', initViewer)
    }

    firstImage.addEventListener('load', initViewer)
  }

  render() {
    const { active, activeSlide, setCurrentSlide, data } = this.props
    const activeProject = data[active]
    this.slidesLength = activeProject.images.length + 1

    if (activeSlide === 0 && this.viewer && this._titles) {
      const activeImage = this._titles.querySelectorAll('img')[active]
      if (this.viewer.activeImage.src !== activeImage.src) {
        this.viewer.setImage(activeImage)
        this.viewer.setColor(activeProject['fist-slide-color'])
      }
    } 
    
    if (this.slidesLength === activeSlide) {
      setTimeout(() => animate(true, [this._title], f=>f, true), 1000)
    } else {
      setTimeout(() => {
        if(this._title)this._title.classList.remove('animated', this._title.dataset.animation)
      }, 100);
    }
      
    return (
      <div className={`section fp-noscroll projects`} ref={node => this._element = node} data-slides={`${(activeProject.images.length === activeSlide - 1) ? 'last' : ''}${activeSlide === 0 ? 'first' : ''}`}>
        <div className='slide fp-noscroll'>
          <div className='first-slide'>
            <div ref={node => this._canvas = node} className='project-scene'> </div>
          </div>
        </div>

        {activeProject.images.map((item, i) =>       
          <div key={i} className='slide fp-noscroll'> 
            <div className='image-slide' style={{ backgroundImage: `url(${item})` }}>
            </div>
          </div>
        )}

        <div className='slide descr-wrapper fp-noscroll' style={{background: activeProject['last-slide-color']}}>
          <div className='descr-slide' >
            <div className='title' data-animation='projectsTitle' ref={node => this._title = node}> {activeProject.name} </div>
            <div className='descr'>
              {activeProject.description}
            </div>
          </div>
        </div>

        <div className='pagination-list'>
          {[...activeProject.images, 's', 's'].map((item, i) => 
            <div key={i} onClick={() => setCurrentSlide(i)}  className={`item ${activeSlide === i ? 'active' : '' }`}>
              <div/>
            </div>
          )}
        </div>

        <>
          <div ref={node => this._images = node} className='project-images'> 
              <img crossOrigin='Anonymous' alt='' src={activeProject['title-image']}/>
              <img crossOrigin='Anonymous' alt='' src={activeProject['title-image']}/>
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
