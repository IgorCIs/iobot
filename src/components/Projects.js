import React, { Component } from 'react'
import CloudViewer from './../libs/cloudViewer.js'

class Project extends Component {
  state = {
    openedImage: null,
    activeSlide: 0,
  }

  setSlide(activeSlide) {
    const { fullpageApi } = this.props;
    
    this.setState({ activeSlide })
    fullpageApi.moveTo(this.props.section + 1, activeSlide)
  }

  componentDidUpdate() {
    const { data, slideChanges, section, isSectionActive, homeLoaded } = this.props
    const { activeSlide } = this.state
    const isProjectChanged = slideChanges ? section === slideChanges.origin.index : false

    //if project slide changed - change local state
    if(isProjectChanged && activeSlide !== slideChanges.direction.index) {
      this.setState({ activeSlide: slideChanges.direction.index })
    }
    
    //scroll slide to title if user changed project
    if(!isSectionActive && activeSlide !== 0) {
      this.setSlide(0)
    }

    if(homeLoaded && !this.viewer) {
      this.setViewer()
    }
    
    //close popup if user change slide in imageviewer
    if(!data.images[activeSlide - 1] & this.state.openedImage) {
      this.setState({ openedImage: false })
    }

    //disabling viewver if hes not on the screen for perfomance 
    if (isSectionActive && activeSlide === 0) {
      if (this.viewer) this.viewer.enabled = true
    } else {     
      if (this.viewer) this.viewer.enabled = false
    }
  }

  setViewer() {
    const { data, active } = this.props
    
    setTimeout(() => {
      this.viewer = new CloudViewer(this._canvas, f=>f, null, [data.model], active)
    }, 0)
  }

  render() {
    const { data } = this.props
    const { images, title, description } = this.props.data
    const { activeSlide, openedImage } = this.state
    
    return (
      <div className='section fp-noscroll projects' ref={node => this._element = node} data-slides={`${activeSlide === 0 ? 'first' : ''}${activeSlide === images.length + 1 ? 'last' : ''}`} >
        <div className='slide fp-noscroll'>
          <div className='first-slide' style={{background: data['fist-slide-color']}}>
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

        <div className='slide descr-wrapper fp-noscroll' style={{ background: data['last-slide-color'] }}>
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

const Projects = ({ data, active, ...rest }) => (
  <>
    {data.map((project, i) => (
      <Project  data={project}  {...rest} isSectionActive={active === i + 2} key={i} section={i + 1}/>
    ))}
  </>
)

export default Projects
