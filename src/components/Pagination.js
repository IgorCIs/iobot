import React, { PureComponent } from 'react'

export class Pagination extends PureComponent {
  render() {
    const { pages, active, onClick } = this.props
    return (
      <div className='pagination'>
        {
          Array(pages).fill(null).map((_, i) =>  (
            <div className={`item ${active === i + 1 ? 'active' : '' }`} key={i} onClick={() => onClick(i + 1)}> </div>
          ))
        } 
      </div>
    )
  }
}

export default Pagination
