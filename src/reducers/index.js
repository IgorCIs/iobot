import { combineReducers } from 'redux';
import sections from './sections';
import data from './data';
import projects from './projects';

const rootReducer = combineReducers({
  sections,
  data,
  projects  
})

export default rootReducer
