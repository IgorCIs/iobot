import React, { Component } from 'react'

export class Thanks extends Component {
  render() {
    return (
      <div className='thanks section'>
        <div className='title'> Thank you </div> 

        <div className='footer'>
          <div className='subtitle'>Haven’t had enough? </div>
          <div className='contacts'>
            <div className='email'>
              <a href='#'> kuba@iobotic.com </a>
            </div>
            <div className='back' onClick={() => this.props.onClick()}> go back up </div>
            <div className='phone'>
              <a href='#'> +971 55 496 8206 </a>
            </div>
          </div>
        </div>
      </div>      
    )
  }
}

export default Thanks
