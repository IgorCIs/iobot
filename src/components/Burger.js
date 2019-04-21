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
  
  render() {
    const { opened } = this.state
    return (
      <>
        { opened ? 
            <div className='navbar'> 
              
            </div>
            : ''
        }
          
        <div onClick={this.toggle} className={`burger ${opened ? 'active' : '' }`}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </>
    )
  }
}

export default Burger
