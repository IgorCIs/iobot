import React, { Component } from 'react'

class Burger extends Component {
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
  
  render() {
    const { opened } = this.state
    const { scrollTo, toggle } = this
    const { active } = this.props

    return (
      <>
        { opened ? 
            <div className='navbar'> 
              <div className='navbar-logo'> </div>
              <div className='menu'> 
                <div className={`item ${active === 1 ? 'active' : ''}`} onClick={() => scrollTo(1)}> Start </div>
                {/* <div className={`item ${active ? 'active' : ''}`}> </div> */}
                <div className={`item ${active === 3? 'active' : ''}`} onClick={() => scrollTo(3)}> About me </div>
              </div>
            </div>
            : ''
        }
          
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
