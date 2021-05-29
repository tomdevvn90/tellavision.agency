import {AboutSubPageData} from "../../@types/about-sub-page-data";
import {Action} from "../../@types/redux-types";
import {ActionTypes} from "../actions/action-types";

export interface AboutReducerStateType {
    loading: boolean;
    aboutTabData: {
        [key: string] : AboutSubPageData;
    } | null;
    error: string | null;
    selectedAboutPage: string | null;
};

const aboutMenusReducerInitialState: AboutReducerStateType = {
    loading: true,
    aboutTabData: null,
    error: null,
    selectedAboutPage: null,
};

const reducer = (state: AboutReducerStateType = aboutMenusReducerInitialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.GET_ABOUT_US_PAGE_MENU_CONTENT:
            return {
                ...state,
                loading: true
            };
        case ActionTypes.GET_ABOUT_US_PAGE_MENU_CONTENT_SUCCESS:
            return {
                ...state,
                loading: false,
                aboutTabData: action.payload,
            };
        case ActionTypes.GET_ABOUT_US_PAGE_MENU_CONTENT_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        case ActionTypes.SET_SELECTED_ABOUT_TAB:
            return {
                ...state,
                selectedAboutPage: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
