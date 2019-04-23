import { combineReducers } from 'redux';
import sections from './sections';
import data from './data';

const rootReducer = combineReducers({
  sections,
  data
})

export default rootReducer