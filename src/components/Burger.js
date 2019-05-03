import React, { PureComponent } from 'react'

class Burger extends PureComponent {
  state = {
    opened: false
  }

  toggle = () => {
    this.setState(prevState => ({
      opened: !prevState.opened
    }))
  }

  scrollTo = index => {
    this.toggle()
    this.props.onClick(index)
  }

  scrollToProject = project => {
    this.toggle()
    this.props.onClick(2, false)
    this.props.setProject(project)
  }
  
  render() {
    const { opened } = this.state
    const { scrollTo, toggle, scrollToProject } = this
    const { active, projects, projectsData } = this.props

    return (
      <>
        <div className={`navbar ${opened ? 'opened' : ''}`}> 
          <div className='navbar-logo'> </div>
          <div className='menu'> 
            <div className={`item ${active === 1 ? 'active' : '' }`} onClick={() => scrollTo(1)}> Start </div>
            {
              projectsData.map((item, i) => (
                <div key={i} onClick={() => scrollToProject(i)} className={`item ${active === 2 && projects.active === i ? 'active' : ''}`}> {item.title} </div>
              ))
            }
            <div className={`item ${active === 3? 'active' : ''}`} onClick={() => scrollTo(3)}> About me </div>
          </div>
        </div>
          
        <div onClick={toggle} className={`burger animated fadeInRight ${opened ? 'active' : '' }`}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </>
    )
  }
}

export default Burger
