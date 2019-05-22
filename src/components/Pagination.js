import React, { PureComponent } from 'react'

export class Pagination extends PureComponent {
  render() {
    const { pages } = this.props
    return (
      <div className='pagination'>
        {
          [...Array(pages)].map((_, i) =>  (
            <div className={`item ${this.props.active === i + 1 ? 'active' : '' }`} key={i} onClick={() => this.props.onClick(i + 1)}> </div>
          ))
        } 
      </div>
    )
  }
}

export default Pagination
