import React, { Component } from 'react'

export class Projects extends Component {
  render() {
    const { active, activeSlide, setCurrentSlide, setProject } = this.props
    console.log(active + 1)

    return (
      <div className='section projects fp-noscroll '>
        <h1 onClick={() => setProject(active + 1)}> Project { active } </h1>
        <h2 onClick={() => setCurrentSlide(activeSlide + 1)}> ActiveSlide { activeSlide }</h2>
      </div>
    )
  }
}

export default Projects
