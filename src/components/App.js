import React, { Component } from 'react'
import ReactFullpage from '@fullpage/react-fullpage';
import Home from './Home';
import Logo from './Logo';
import Burger from './Burger';
import Thanks from './Thanks';
import About from './About';
import Pagination from './Pagination';

let api

export class App extends Component {
  constructor(props) {
    super(props)

    this.goToSection = this.goToSection.bind(this)
  }
  
  goToSection(i) {
    this.props.setCurrentSection(i)
    api.moveTo(i)
  } 
  
  render() {
    const { sections, setCurrentSection } = this.props
    const { goToSection } = this
    
    return ( 
      <>
        <Logo/>
        <Burger/>
        <Pagination onClick={i => this.goToSection(i)} active={sections.currentSection}/>
        <ReactFullpage
          onLeave={(origin, destination, direction) => {
            setCurrentSection(destination.index + 1)
          }}
          render={
            ({ fullpageApi }) => {
              if(fullpageApi) api = fullpageApi
              return (
                <div>
                  <Home/>
                  <About/>
                  <Thanks onClick={() => goToSection(1)}/>
                </div>
              )
            }
          }
        /> 
      </>
    )
  }
}

export default App
