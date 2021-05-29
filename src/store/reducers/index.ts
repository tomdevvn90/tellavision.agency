import { combineReducers } from "redux";
import {DefaultRootState} from "react-redux";


import landData, { LandDataStateType } from './landData'
import menusData, {MenusReducerStateType} from "./menus";
import aboutTabData, {AboutReducerStateType} from './about-menu-data'
import objectPageData, {ObjectPageReducerStateType} from "./object-page";


export interface RootReducer extends DefaultRootState{
    landData: LandDataStateType;
    menusData: MenusReducerStateType;
    aboutTabData: AboutReducerStateType
    objectPageData: ObjectPageReducerStateType,
}

export default combineReducers({
    landData,
    menusData,
    aboutTabData,
    objectPageData
})
