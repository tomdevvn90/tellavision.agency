import {MenuItem} from "../../@types/primary-menu";
import {ActionTypes} from "./action-types";

export const setSelectedTabBasicDetails =  (tab: MenuItem) => {
    return {
        type: ActionTypes.SET_SELECTED_ABOUT_TAB,
        payload: tab,
    };
};
