import { combineReducers } from 'redux'
import * as menu from './applicationReducer';
import * as connections from './connectionsReducer';
import * as recentProjects from './recentProjectsReducer';
import * as currentProject from './currentProjectReducer'
import * as file from './fileReducer'

export default combineReducers({
    appSettings: menu.reducer,
    connections: connections.reducer,
    recentProjects: recentProjects.reducer,
    currentProject: currentProject.reducer
});