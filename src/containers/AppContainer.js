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
        dispatch(setCurrentSection(section))
      },
      fetchData() {
        dispatch(fetchData())
      },
      setProject(project) {
        dispatch(setCurrentProject(project))
      },
      setCurrentSlide(slide, project) {
        dispatch(setCurrentSlide(slide, project))
      }
    })
)(App)
