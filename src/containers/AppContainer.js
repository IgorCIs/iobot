import { connect } from 'react-redux'

import App from '../components/App'
import { setCurrentSection } from '../actions/SectionsActions';

export default connect(
  state => 
    ({
      sections: state.sections
    }),
  dispatch => 
    ({
      setCurrentSection(section) {
        dispatch(setCurrentSection(section))
      }
    })
)(App)
