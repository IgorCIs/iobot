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
    homeLoaded: false,
  }
  
  componentDidMount() {
    this.props.fetchData()
  }
  
  goToSection(i) {
    this.props.setCurrentSection(i)
    this.fullpageApi.moveTo(i)
  } 

  goToProject(i) {
    this.props.setProject(i)
  }

  unMountLoader() {
    this.setState({ contentLoaded: true })
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
              <Burger setProject={this.goToProject} projectsData={data.projects} projects={projects} onClick={this.goToSection} active={sections.currentSection}/>
              <Pagination pages={data.projects.length + 3} onClick={i => this.goToSection(i)} active={sections.currentSection}/>
              <ReactFullpage
                scrollOverflow={true}
                scrollHorizontally={true}
                onLeave={(origin, destination) => {
                  this.scroll(destination)
                  this.setState({ blockSlider: false })
                }}  
                onSlideLeave={(origin, destination, direction) => {
                  if((destination.isLast && direction.isFirst) || (destination.isFirst && direction.isLast)) {
                    return false 
                  } 

                  this.slideChanges = {origin, destination, direction}
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
