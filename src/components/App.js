import React, { PureComponent } from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import 'fullpage.js/vendors/scrolloverflow'
import 'fullpage.js/dist/fullpage.extensions.min.js'

import Home from './Home';
import Logo from './Logo';
import Burger from './Burger';
import Thanks from './Thanks';
import About from './About';
import Pagination from './Pagination';
import Projects from './Projects';
import Loader from './Loader';

export class App extends PureComponent {
  constructor(props) {
    super(props)

    this.goToSection = this.goToSection.bind(this)
    this.goToSlide = this.goToSlide.bind(this)
    this.goToProject = this.goToProject.bind(this)
    this.unMountLoader = this.unMountLoader.bind(this )
    this.scroll = this.scroll.bind(this)
    this.fullpageApi = null
  }

  state = {
    contentLoaded: false,
    blockSlider: false,
    homeLoaded: false
  }
  
  componentDidMount() {
    this.props.fetchData()
  }
  
  async goToSection(i, block = true) {
    if(block) await this.setState({blockSlider: true})
    this.props.setCurrentSection(i)
    this.fullpageApi.moveTo(i)
  } 

  goToSlide(i) {
    this.props.setCurrentSlide(i)
    this.fullpageApi.moveTo(2, i)

  }

  goToProject(i) {
    this.goToSlide(0) 
    this.props.setProject(i)
  }

  unMountLoader() {
    this.setState({contentLoaded: true})
  }

  scrollSlider({ origin, destination, direction, scroll }) {
    const { projects, data } = this.props
    const project = data.projects[projects.active]
    const projectLength = project.images.length + 1

    
    if (origin.index === 1) {
      if (direction === 'up' && projects.activeSlide !== 0) {
        this.fullpageApi.moveSlideLeft()
        return false
      } else if (direction === 'down' && project.activeSlide !== projectLength ) {
        this.fullpageApi.moveSlideRight()
        const res = direction === 'down' && projects.activeSlide === projectLength
        res && scroll(destination)
        return res
      } else {
        scroll(destination)
        return true
      }
    }
  }

  scroll(destination) {
    this.props.setCurrentSection(destination.index + 1)
  }
  
  render() {
    const { sections, setCurrentSlide, setProject, data, projects } = this.props
    const { goToSection } = this
    const { contentLoaded, homeLoaded } = this.state
    
    return ( 
      <>
        { homeLoaded && contentLoaded ? '' : <Loader loaded={(!!data && homeLoaded)} unMount={this.unMountLoader}/> }
        { data ? 
            <>
              <Logo/>
              <Burger setProject={ this.goToProject } projectsData={data.projects}  projects={projects} onClick={this.goToSection} active={sections.currentSection}/>
              <Pagination onClick={i => this.goToSection(i)} active={sections.currentSection}/>
              <ReactFullpage
                scrollOverflow={true}
                scrollHorizontally={true}
                onLeave={(origin, destination, direction) => {
                  origin.index !== 1 && this.scroll(destination)
                  if (!this.state.blockSlider) {
                    return this.scrollSlider({ origin, destination, direction, scroll: this.scroll })
                  }
                  this.setState({blockSlider: false})
                }}  
                onSlideLeave={(origin, destination, direction) => {
                  setCurrentSlide(direction.index)
                }}  
                render={
                  ({ fullpageApi }) => {
                    if(fullpageApi) this.fullpageApi = fullpageApi
                    return (
                      <div>
                        <Home data={data.home} onLoad={() => this.setState({ homeLoaded : true })} active={sections.currentSection === 1}/>
                        <Projects data={data.projects} active={projects.active} setCurrentSlide={this.goToSlide} setProject={setProject} activeSlide={projects.activeSlide}/>
                        <About data={data.about} active={sections.currentSection === 3}/>
                        <Thanks data={data.last} onClick={() => goToSection(1)} active={sections.currentSection === 4}/>
                      </div>
                    )
                  }
                }
              /> 
            </> 
          : '' }
      </>
    )
  }
}

export default App
