import { connect } from 'react-redux'

import App from '../components/App'
import { setCurrentSection } from '../actions/SectionsActions';
import { fetchData } from '../actions/DataActions';
import { setCurrentProject, setCurrentSlide } from '../actions/ProjectsActions';

export default connect(
  state => 
    ({
      sections: state.sections,
      data: state.data.data,
      projects: state.projects
    }),
  dispatch => 
    ({
      setCurrentSection(section) {
        console.log(section)
        dispatch(setCurrentSection(section))
      },
      fetchData() {
        dispatch(fetchData())
      },
      setProject(project) {
        console.log(project)
        dispatch(setCurrentProject(project))
      },
      setCurrentSlide(slide) {
        dispatch(setCurrentSlide(slide))
      }

    })
)(App)
