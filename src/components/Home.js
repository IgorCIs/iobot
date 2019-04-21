import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    return (
      <div className='home section'>

        <div className='title'>
            <div> 
            My name is <span>Kuba</span>, <br/>
            I do cool sh*t &<br/>
            this is my <span>book</span>.
            </div>
        </div>
        <div className='contacts'>
          <div className='wrapper'>
            <div className='email'>
              <a href='#'> kuba@iobotic.com </a>
            </div>
            <div className='phone'>
              <a href='#'> +971 55 496 8206 </a>
            </div>
          </div>

        </div>

      </div>  
    )
  }
}
