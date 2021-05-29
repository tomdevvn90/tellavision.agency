import {ActionTypes} from "../store/actions/action-types";

export interface Action {
    type: ActionTypes,
    payload?: any
}

