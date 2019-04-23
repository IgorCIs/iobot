import React, { Component } from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import 'fullpage.js/vendors/scrolloverflow'
import Home from './Home';
import Logo from './Logo';
import Burger from './Burger';
import Thanks from './Thanks';
import About from './About';
import Pagination from './Pagination';
import Projects from './Projects';
// import data from './../data.json'

export class App extends Component {
  constructor(props) {
    super(props)

    this.goToSection = this.goToSection.bind(this)
    this.fullpageApi = null
  }
  
  componentDidMount() {
    this.props.fetchData()
  }
  
  goToSection(i) {
    this.props.setCurrentSection(i)
    this.fullpageApi.moveTo(i)
  } 
  
  render() {
    const { sections, setCurrentSlide, setProject, setCurrentSection, data, projects } = this.props
    const { goToSection } = this
    console.log(projects)
    return ( 
      <>
        { data ? 
            <>
              <Logo/>
              <Burger onClick={this.goToSection} active={sections.currentSection}/>
              <Pagination onClick={i => this.goToSection(i)} active={sections.currentSection}/>
              <ReactFullpage
                scrollOverflow={true}
                onLeave={(origin, destination, direction) => {
                  setCurrentSection(destination.index + 1)
                }}  
                render={
                  ({ fullpageApi }) => {
                    if(fullpageApi) this.fullpageApi = fullpageApi
                    return (
                      <div>
                        <Home data={data.home} active={sections.currentSection === 1}/>
                        <Projects data={data.projects} active={projects.active} setCurrentSlide={setCurrentSlide} setProject={setProject} activeSlide={projects.activeSlide}/>
                        <About data={data.about} active={sections.currentSection === 2}/>
                        <Thanks data={data.last} onClick={() => goToSection(1)} active={sections.currentSection === 3}/>
                      </div>
                    )
                  }
                }
              /> 
            </> 
            : 'im loader :)'
        }
      </>
    )
  }
}

export default App
