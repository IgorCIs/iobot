import React, { PureComponent } from 'react'

export class Pagination extends PureComponent {
  render() {
    return (
      <div className='pagination'>
        {
          [...Array(4)].map((item, i) =>  (
            <div className={`item ${this.props.active === i + 1 ? 'active' : '' }`} key={i} onClick={() => this.props.onClick(i + 1)}> </div>
          ))
        } 
      </div>
    )
  }
}

export default Pagination
