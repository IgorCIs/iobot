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
    this.goToProject = this.goToProject.bind(this)
    this.unMountLoader = this.unMountLoader.bind(this)
    this.scroll = this.scroll.bind(this)
    this.fullpageApi = null
  }

  state = {
    contentLoaded: false,
    blockSlider: false,
    homeLoaded: false,
  }
  
  componentDidMount() {
    this.props.fetchData()
  }
  
  goToSection(i) {
    this.props.setCurrentSection(i)
    console.log(i)
    this.fullpageApi.moveTo(i)
  } 

  goToProject(i) {
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

  toggleLoader = (open = true) => {
    this.setState({ homeLoaded: open })
  }  

  render() {
    const { sections, setProject, data, projects } = this.props
    const { goToSection } = this
    const { contentLoaded, homeLoaded } = this.state
    if(data && (data.title !== document.title)) document.title = data.title

    return ( 
      <>
        { homeLoaded && contentLoaded ? '' : <Loader loaded={(!!data && homeLoaded)} unMount={this.unMountLoader}/> }
        { data ? 
            <>
              <Logo/>
              <Burger setProject={ this.goToProject } projectsData={data.projects}  projects={projects} onClick={this.goToSection} active={sections.currentSection}/>
              <Pagination pages={data.projects.length + 3} onClick={i => this.goToSection(i)} active={sections.currentSection}/>
              <ReactFullpage
                scrollOverflow={true}
                scrollHorizontally={true}
                onLeave={(origin, destination, direction) => {
                  this.scroll(destination)
                  this.setState({blockSlider: false})
                }}  
                onSlideLeave={(origin, destination, direction) => {
                  this.slideChanges = {origin, destination, direction}
                  if(destination.isLast && direction.isFirst) {
                    return false 
                  }
                }}  
                render={
                  ({ fullpageApi }) => {
                    if(fullpageApi) this.fullpageApi = fullpageApi
                    return (
                      <div>
                        <Home data={data.home} setSection={goToSection} onLoad={this.toggleLoader} active={sections.currentSection === 1}/>
                        <Projects data={data.projects} fullpageApi={fullpageApi} slideChanges={this.slideChanges} onLoad={this.toggleLoader} isSectionActive={sections.currentSection === 2} active={sections.currentSection } setProject={setProject} />
                        <About data={data.about} active={sections.currentSection === 3}/>
                        <Thanks data={data.last} onClick={(i) => goToSection(i)} active={sections.currentSection === 4}/>
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
