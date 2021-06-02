import {MenuItem} from "../../@types/primary-menu";
import {Action} from "../../@types/redux-types";
import {ActionTypes} from "./action-types";

import client from '../../client/tellavision-client';
import {TabData} from "../../@types/tab-data";

interface MenusTitleList {
    title: string;
    type: string;
}

interface MenuDataContainer {
    [title: string] : TabData[];
}

export const getMenusData = (menuList: MenuItem[]) => async (dispatch: (action: Action) => void) => {
    dispatch({
        type: ActionTypes.GET_MENUS_DATA
    });
    const menus: MenusTitleList[] = menuList?.map((menuItem) => {
        if (menuItem.post_name === 'home' || menuItem.post_name === 'Home') {
            return {title: 'visuals', type: menuItem.type};
        } else if (menuItem.post_name === 'corporate') {
            return {title: 'corporates', type: menuItem.type}
        }
        return {title: menuItem.post_name, type: menuItem.type};
    });
    console.log(menus);
    const data: MenuDataContainer = {};
    for(const menuItem of menuList) {
        if (menuItem.type === 'custom') {
            let counter = 0;
            while (true) {
                try {
                    let title = menuItem.post_name;
                    if (title === 'corporate') {
                        title = 'corporates'
                    } else if (title === 'home') {
                        title = 'visuals'
                    }
                    const res = await client.fetchMenuItemMainPageData(title);
                    const x = res.data;
                    data[menuItem.post_name] = x;
                    break;
                } catch (e) {
                    if (counter >=3) {
                        dispatch({
                            type: ActionTypes.GET_MENUS_DATA_ERROR,
                            payload: `Error fetching ${menuItem.title}`
                        });
                        break;
                    }
                    counter++

                }
            }
        }
    }
    dispatch({
        type: ActionTypes.GET_MENUS_DATA_SUCCESS,
        payload: data
    })


};
