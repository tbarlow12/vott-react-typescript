import * as ActionTypes from '../actions/actionTypes';
import { IProject } from "../store/applicationState";

export const reducer = (state: IProject[] = [], action: any) => {
    switch (action.type) {
        case ActionTypes.LOAD_PROJECTS_SUCCESS:
            return [...action.projects];
        case ActionTypes.LOAD_PROJECT_SUCCESS:
        case ActionTypes.SAVE_PROJECT_SUCCESS:
            return [
                { ...action.project },
                ...state.filter(project => project.id !== action.project.id)
            ];
        case ActionTypes.DELETE_PROJECT_SUCCESS:
            return [...state.filter(project => project.id !== action.project.id)];
        default:
            return state;
    }
}
