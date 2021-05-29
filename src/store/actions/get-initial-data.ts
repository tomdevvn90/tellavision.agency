import {Action} from "../../@types/redux-types";
import {ActionTypes} from "./action-types";
import client from '../../client/tellavision-client'

const RETRY_COUNTS = 3;

export const getInitialData = () => async (dispatch: (action: Action) => void) => {
    dispatch({
        type: ActionTypes.GET_ABOUTPAGE_CONTENT
    });
    dispatch({
        type: ActionTypes.GET_BASIC_CONTENT
    });
    dispatch({
        type: ActionTypes.GET_HOMEPAGE_CONTENT
    });
    dispatch({
        type: ActionTypes.GET_MENUS
    });

    let counter = 0;
    while (true) {
        try {
            const data = await client.fetchMenuItemStyle();
            dispatch({
                type: ActionTypes.GET_BASIC_CONTENT_SUCCESS,
                payload: data.data
            });
            break;
        } catch (e) {
            if (counter >= RETRY_COUNTS) {
                dispatch({
                    type: ActionTypes.GET_BASIC_CONTENT_ERROR,
                    payload: e.message,
                });
                break;
            }
            counter++;
        }
    }

    counter = 0;
    while (true) {
        try {
            const data = await client.fetchPrimaryMenu();
            dispatch({
                type: ActionTypes.GET_MENUS_SUCCESS,
                payload: data.data
            });
            break;
        } catch (e) {
            if (counter >= RETRY_COUNTS) {
                dispatch({
                    type: ActionTypes.GET_MENUS_ERROR,
                    payload: e.message,
                });
                break;
            }
            counter++;
        }
    }

    counter = 0;
    while (true) {
        try {
            const data = await client.fetchHomeContent();
            dispatch({
                type: ActionTypes.GET_HOMEPAGE_CONTENT_SUCCESS,
                payload: data.data
            });
            break;
        } catch (e) {
            if (counter >= RETRY_COUNTS) {
                dispatch({
                    type: ActionTypes.GET_HOMEPAGE_CONTENT_ERROR,
                    payload: e.message,
                });
                break;
            }
            counter++;
        }
    }

    counter = 0;
    while (true) {
        try {
            const data = await client.fetchAboutUsContent();
            dispatch({
                type: ActionTypes.GET_ABOUTPAGE_CONTENT_SUCCESS,
                payload: data.data
            });
            break;
        } catch (e) {
            if (counter >= RETRY_COUNTS) {
                dispatch({
                    type: ActionTypes.GET_ABOUTPAGE_CONTENT_ERROR,
                    payload: e.message,
                });
                break;
            }
            counter++;
        }
    }

    dispatch({
        type: ActionTypes.COMPLETED_LAND_DATA_LOAD
    })

}
