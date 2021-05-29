import {Action} from "../../@types/redux-types";
import {TabData} from "../../@types/tab-data";
import {ActionTypes} from "../actions/action-types";

export interface MenusReducerStateType {
    loading: boolean;
    tabData: {
        [key: string] : TabData[];
    } | null;
    error: string | null;
}

const menusReducerInitialState: MenusReducerStateType = {
    loading: true,
    tabData: null,
    error: null
}

const menusReducers = (state: MenusReducerStateType = menusReducerInitialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.GET_MENUS_DATA:
            return {
                ...state,
                loading: true
            };
        case ActionTypes.GET_MENUS_DATA_SUCCESS:
            return {
                ...state,
                tabData: action.payload,
                error: null,
                loading: false,
            };
        case ActionTypes.GET_MENUS_DATA_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default menusReducers;
