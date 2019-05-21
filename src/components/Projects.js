import React, { Component } from 'react'
import CloudViewer from './../libs/cloudViewer.js'

export class Projects extends Component {
  constructor(props) {
    super(props)
    this.canvases = []
    this.images = []
  }

  state = {
    blockScroll: false,
    openedImage: null
  }
  
  componentDidMount() {
    this.setViewer()
    this.events = 0
  }

  componentDidUpdate() {
    const { active, activeSlide, data } = this.props

    const isImage = data[active].images[activeSlide - 1]

    if(!isImage & this.state.openedImage) {
      this.setState({ openedImage: false })
    }


  }
  
  setViewer() {
    const { data, active } = this.props

    setTimeout(() => {
      if(!this.viewer) this.viewer = new CloudViewer(this._canvas, () => this.setState({ loader: false }), data[active]['fist-slide-color'], [data[0].model], active)
    }, 0)
  }

  render() {
    const { isSectionActive, active, activeSlide, setCurrentSlide, data, onLoad } = this.props
    const { openedImage } = this.state

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
            <div className='title' data-animation='projectsTitle'> {activeProject.title} </div>
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

        {activeSlide !== 0 && activeSlide !== this.slidesLength ? 
          <div className='fit-image' onClick={() => this.setState({ openedImage: true })}></div>
          : ''
        }

        {
          openedImage ? 
            <div className='image-popup'>
              <div className='image-popup-close' onClick={() => this.setState({ openedImage: false })}> 
                <div></div>
                <div></div>
              </div>
              <img src={activeProject.images[activeSlide - 1]} alt='project img'/>
            </div> : ''
        }
      </div>
    )
  }
}

export default Projects
