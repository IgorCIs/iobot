import React, { PureComponent } from 'react'
import isMobile from 'is-mobile'

class Burger extends PureComponent {
  state = {
    closed: true
  }

  toggle = () => {
    this.setState((prevState) => ({
      closed: !prevState.closed
    }))
  }

  scrollTo = (index) => {
    this.toggle()
    this.props.onClick(index)
  }

  scrollToProject = (project) => {
    this.toggle()
    this.props.setProject(project)
    this.props.onClick(project + 2)

  
    setTimeout(() => {
      this.props.onClick(project + 2)
      this.props.setProject(project)
    }, 0)
  }
  
  render() {
    const { closed } = this.state
    const { scrollTo, toggle, scrollToProject } = this
    const { active, projectsData } = this.props

    return (
      <>
        <div className={`navbar ${closed ? 'closed' : ''}`}> 
          <div className={`${isMobile() ? 'mobile' : ''} navbar-logo`}> </div>
          <div className='menu'> 
            <div className={`item ${active === 1 ? 'active' : '' }`} onClick={() => scrollTo(1)}> Start </div>
            {
              projectsData.map((item, i) => (
                <div key={i} onClick={() => scrollToProject(i)} className={`item ${active === i + 2 ? 'active' : ''}`}> {item.title} </div>
              ))
            }
            <div className={`item ${active === projectsData.length + 2 ? 'active' : ''}`} onClick={() => scrollTo(projectsData.length + 2)}> About me </div>
          </div>
        </div>
          
        <div onClick={toggle} className={`burger animated fadeInRight ${closed ? '' : 'active' }`}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </>
    )
  }
}

export default Burger
