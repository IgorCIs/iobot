import { connect } from 'react-redux'

import App from '../components/App'
import { setCurrentSection } from '../actions/SectionsActions';
import { fetchData } from '../actions/DataActions';

export default connect(
  state => 
    ({
      sections: state.sections,
      data: state.data.data
    }),
  dispatch => 
    ({
      setCurrentSection(section) {
        dispatch(setCurrentSection(section))
      },
      fetchData() {
        dispatch(fetchData())
      }
    })
)(App)
