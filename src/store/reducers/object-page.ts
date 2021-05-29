import {Action} from "../../@types/redux-types";
import {ActionTypes} from "../actions/action-types";
import {AboutSubPageData} from "../../@types/about-sub-page-data";

export interface ObjectPageReducerStateType {
    loading: boolean;
    pageData: {
        [key: string] : AboutSubPageData;
    } | null;
    error: string | null;
}

const objectPageReducerInitialState: ObjectPageReducerStateType = {
    loading: true,
    pageData: null,
    error: null,
};

const reducer = (state: ObjectPageReducerStateType = objectPageReducerInitialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.GET_OBJECT_PAGE_CONTENT:
            return {
                ...state,
                loading: true
            };
        case ActionTypes.GET_OBJECT_PAGE_CONTENT_SUCCESS:
            return {
                ...state,
                pageData: action.payload,
                error: null,
                loading: false,
            };
        case ActionTypes.GET_OBJECT_PAGE_CONTENT_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
