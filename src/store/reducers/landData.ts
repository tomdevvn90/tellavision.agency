import {SiteOptions} from "../../@types/options";
import {MenuItem, PrimaryMenu} from "../../@types/primary-menu";
import {HomePageContent} from "../../@types/home-page";
import {AboutMenuContent} from "../../@types/about-menu";
import {Action} from "../../@types/redux-types";
import {ActionTypes} from "../actions/action-types";

interface StoreData<T> {
    data: T;
    error: string | null;
}


export interface LandDataStateType {
    loading: boolean;
    options: StoreData<SiteOptions> | null;
    menus: StoreData<PrimaryMenu> | null;
    homePageContent: StoreData<HomePageContent> | null;
    aboutPageContent: StoreData<AboutMenuContent> | null;
    selectedTabBasicDetails: MenuItem | null;
    appName: string;
};

const initialState: LandDataStateType = {
    loading: true,
    options: null,
    menus: null,
    homePageContent: null,
    aboutPageContent: null,
    selectedTabBasicDetails: null,
    appName: 'Tellavision Agency',
};

const reducer = (
    state: LandDataStateType = initialState,
    action: Action,
) => {
    switch (action.type) {
        case ActionTypes.GET_BASIC_CONTENT:
        case ActionTypes.GET_MENUS:
        case ActionTypes.GET_HOMEPAGE_CONTENT:
        case ActionTypes.GET_ABOUTPAGE_CONTENT:
            return {
                ...state,
                loading: true,
            };
        case ActionTypes.GET_BASIC_CONTENT_SUCCESS:
            return {
                ...state,
                options: {
                    data: action.payload,
                    error: null,
                }
            };
        case ActionTypes.GET_MENUS_SUCCESS:
            return {
                ...state,
                menus: {
                    data: action.payload,
                    error: null,
                },
            };
        case ActionTypes.GET_HOMEPAGE_CONTENT_SUCCESS:
            return {
                ...state,
                homePageContent: {
                    data: action.payload,
                    error: null,
                },
            };
        case ActionTypes.GET_ABOUTPAGE_CONTENT_SUCCESS:
            return {
                ...state,
                aboutPageContent: {
                    data: action.payload,
                    error: null,
                },
            };
        case ActionTypes.GET_ABOUTPAGE_CONTENT_ERROR:
            return {
                ...state,
                aboutPageContent: {
                    ...state.aboutPageContent,
                    error: action.payload,
                },
            };
        case ActionTypes.GET_BASIC_CONTENT_ERROR:
            return {
                ...state,
                options: {
                    ...state.options,
                    error: action.payload,
                },
            };
        case ActionTypes.GET_HOMEPAGE_CONTENT_ERROR:
            return {
                ...state,
                homePageContent: {
                    ...state.homePageContent,
                    error: action.payload,
                },
            };
        case ActionTypes.GET_MENUS_ERROR:
            return {
                ...state,
                menus: {
                    ...state.menus,
                    error: action.payload,
                },
            };
        case ActionTypes.COMPLETED_LAND_DATA_LOAD:
            return {
                ...state,
                loading: false,
            };
        case ActionTypes.SET_SELECTED_TAB_BASIC_DETAILS:
            return {
                ...state,
                selectedTabBasicDetails: action.payload,
            };
        default:
            return state;

    }
};

export default reducer;
