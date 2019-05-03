import React, { Component } from 'react'
import { animate } from '../libs/animateNode';
import CloudViewer from './../libs/cloudViewer.js'



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
    // this.setScroll()
  }

  // setScroll() {
    // const scrollSlide = e => {
      // if (e.deltaX) {
      //   const delta = e.deltaX >= 1 ? 1 : -1
      //   console.log(delta)
      //   const nextSlide = this.slidesLength < this.props.activeSlide + 0 ? 1 : this.props.activeSlide + 1 
      //   delta === 1 ? setCurrentSlide(nextSlide) : setCurrentSlide(this.props.activeSlide - 1)

        
      //   this._element.removeEventListener('mousewheel', scrollSlide)
      //   this._element.addEventListener('mousewheel', scrollSlide)
      // }
    // }
    
    // this._element.addEventListener('mousewheel', scrollSlide)
  // }
  
  setViewer() {
    const { data, active } = this.props

    setTimeout(() => {
      if(!this.viewer) this.viewer = new CloudViewer(this._canvas, () => this.setState({ loader: false }), data[active]['fist-slide-color'], [data[0].model], active)
    }, 0)
  }

  render() {
    const { isSectionActive, active, activeSlide, setCurrentSlide, data, onLoad } = this.props

    const activeProject = data[active]
    this.slidesLength = activeProject.images.length + 1
    
    if (this.viewer) {
      if (this.viewer.activeProject !== active) {
        this.viewer.activeProject = active
        this.viewer.loadModel(activeProject.model, () => onLoad(true))
        this.viewer.setColor(activeProject['fist-slide-color'])
        setTimeout(() => onLoad(false), 0)
      }
      
      if (isSectionActive && activeSlide === 0) {
        this.viewer.enabled = true
      } else {
        this.viewer.true = false
      }
    }

    if (this.slidesLength === activeSlide) {
      setTimeout(() => animate(true, [this._title], f=>f, true), 1000)
    } else {
      setTimeout(() => {
        if(this._title)this._title.classList.remove('animated', this._title.dataset.animation)
      }, 100)
    }

    return (
      <div className={`section fp-noscroll projects`} ref={node => this._element = node} data-slides={`${(activeProject.images.length === activeSlide - 1) ? 'last' : ''}${activeSlide === 0 ? 'first' : ''}`}>
        <div className='slide fp-noscroll'>
          <div className='first-slide'>
            <div className='main-title'> {activeProject.title} </div>
            <div ref={node => this._canvas = node} className='project-scene'> </div>
          </div>
        </div>

        {activeProject.images.map((item, i) =>       
          <div key={i} className='slide fp-noscroll'> 
            <div className='image-slide' style={{ backgroundImage: `url(${item})` }}>
            </div>
          </div>)
        }

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
      </div>
    )
  }
}

export default Projects
