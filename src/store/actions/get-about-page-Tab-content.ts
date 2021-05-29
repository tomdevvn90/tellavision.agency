import {AboutMenuItem} from "../../@types/about-menu";
import {ActionTypes} from "./action-types";
import client from "../../client/tellavision-client";
import {Action} from "../../@types/redux-types";
import {AboutSubPageData} from "../../@types/about-sub-page-data";

interface AboutTabDataContainer {
    [id: string] : AboutSubPageData
}

export const getAboutPageTabContent = (list: AboutMenuItem[]) => async (dispatch: (action: Action) => void) => {
    dispatch({
        type: ActionTypes.GET_ABOUT_US_PAGE_MENU_CONTENT
    });
    const data: AboutTabDataContainer = {};
    for(const menuItem of list) {
        let counter = 0;
        while (true) {
            try {
                const res = await client.fetchPageContent(menuItem.object_id);
                data[menuItem.object_id] = res.data;
                break;
            } catch (e) {
                if (counter >=3) {
                    dispatch({
                        type: ActionTypes.GET_ABOUT_US_PAGE_MENU_CONTENT_ERROR,
                        payload: `Error fetching ${menuItem.title}`
                    });
                    break;
                }
                counter++;
                }
            }
    }
    dispatch({
        type: ActionTypes.GET_ABOUT_US_PAGE_MENU_CONTENT_SUCCESS,
        payload: data
    })
};
