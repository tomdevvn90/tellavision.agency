import {MenuItem} from "../../@types/primary-menu";
import {Action} from "../../@types/redux-types";
import {ActionTypes} from "./action-types";

import client from '../../client/tellavision-client';
import {AboutSubPageData} from "../../@types/about-sub-page-data";

interface MenuDataContainer {
    [title: string] : AboutSubPageData;
}

export const getObjectPageData = (menuList: MenuItem[]) => async (dispatch: (action: Action) => void) => {
    console.log('inside getObjectPageData');
    dispatch({
        type: ActionTypes.GET_OBJECT_PAGE_CONTENT
    });
    const data: MenuDataContainer = {};
    for(const menuItem of menuList) {
        if (menuItem.object === 'page') {
            let counter = 0;
            while (true) {
                try {
                    const res = await client.fetchPageContent(menuItem.object_id);
                    const x = res.data;
                    data[menuItem.object_id] = x;
                    break;
                } catch (e) {
                    if (counter >=3) {
                        dispatch({
                            type: ActionTypes.GET_OBJECT_PAGE_CONTENT_ERROR,
                            payload: `Error fetching ${menuItem.object_id}`
                        });
                        break;
                    }
                    counter++

                }
            }
        }
    }
    console.log(data);
    dispatch({
        type: ActionTypes.GET_OBJECT_PAGE_CONTENT_SUCCESS,
        payload: data
    })
};
