import React, { Component } from 'react'
import CloudViewer from './../libs/cloudViewer.js'

class Project extends Component {
  state = {
    openedImage: null,
    activeSlide: 0,
  }

  componentDidMount() {
    this.setViewer()
  }

  setSlide(activeSlide) {
    this.props.fullpageApi.moveTo(this.props.section + 1, activeSlide)
    this.setState({ activeSlide })
  }

  componentDidUpdate() {
    const { data, slideChanges, section, isSectionActive} = this.props
    const { activeSlide } = this.state
    const isProjectChanged = slideChanges ? section === slideChanges.origin.index : false

    if(isProjectChanged && activeSlide !== slideChanges.direction.index) {
      this.setState({ activeSlide: slideChanges.direction.index })
    }

    if(!isSectionActive && activeSlide !== 0) {
      this.setSlide(0)
    }
    
    const isImage = data.images[activeSlide - 1]
    
    if(!isImage & this.state.openedImage) {
      this.setState({ openedImage: false })
    }

    if (isSectionActive && activeSlide === 0 && this.viewer) {
      if (this.viewer) this.viewer.enabled = true
    } else {     
      if (this.viewer) this.viewer.enabled = false
    }
  }

  setViewer() {
    const { data, active } = this.props

    setTimeout(() => {
      this.viewer = new CloudViewer(this._canvas, f=>f, data['fist-slide-color'], [data.model], active)
    }, 0)
  }

  render() {
    const { data } = this.props
    const { images, title, description } = this.props.data
    const { activeSlide, openedImage } = this.state
    
    return (
      <div className={`section fp-noscroll projects`} ref={node => this._element = node} data-slides={`${activeSlide === 0 ? 'first' : ''}${activeSlide === images.length + 1 ? 'last' : ''}`} >
        <div className='slide fp-noscroll'>
          <div className='first-slide'>
            <div className='main-title'> {data.title} </div>
            <div ref={node => this._canvas = node} className='project-scene'> </div>
          </div>
        </div>
        
        {images.map((item, i) =>
          <div key={i} className='slide fp-noscroll'> 
            <div className='image-slide' style={{ backgroundImage: `url(${item})` }}>
            </div>
          </div>)
        }

        <div className='slide descr-wrapper fp-noscroll' style={{background: data['last-slide-color']}}>
          <div className='descr-slide' >
            <div className='title' data-animation='projectsTitle'> {title} </div>
            <div className='descr'>
              {description}
            </div>
          </div>
        </div>
        
        <div className='pagination-list'>
          {[...images, ')', ')'].map((_, i) => 
            <div key={i} onClick={() => this.setSlide(i)} className={`item ${activeSlide === i ? 'active' : '' }`}>
              <div/>
            </div>
          )}
        </div>

        {activeSlide !== 0 && activeSlide !== images.length + 1 ? 
          <div className='fit-image' onClick={() => this.setState({ openedImage: true })}></div>
          : ''
        }

        {openedImage ? 
          <div className='image-popup'>
            <div className='image-popup-close' onClick={() => this.setState({ openedImage: false })}> 
              <div></div>
              <div></div>
            </div>
            <img src={images[activeSlide - 1]} alt='project img'/>
          </div> : ''
        }

      </div>

    )
  }
}

const Projects = ({ data, onLoad, fullpageApi, slideChanges, active }) => (
  <>
    {data.map((project, i) => (
      <Project onLoad={onLoad} data={project} slideChanges={slideChanges} isSectionActive={active === i + 2} fullpageApi={fullpageApi} key={i} section={i + 1}/>
    ))}
  </>
)

export default Projects
