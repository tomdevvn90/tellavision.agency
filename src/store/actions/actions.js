

import APIService from "../../services";
import {
    GET_VISUALS_DATA,
    GET_VISUALS_DATA_SUCCESS,
    GET_VISUALS_DATA_ERROR,
    GET_WRITERS_DATA,
    GET_STORYBOARDS_DATA,
    GET_GRAPHIC_DESIGN_DATA,
    GET_EUROPEAN_TALENT_DATA,
    GET_WRITERS_DATA_SUCCESS,
    GET_STORYBOARDS_DATA_SUCCESS,
    GET_GRAPHIC_DESIGN_DATA_SUCCESS,
    GET_EUROPEAN_TALENT_DATA_SUCCESS,
    GET_WRITERS_DATA_ERROR,
    GET_STORYBOARDS_DATA_ERROR,
    GET_GRAPHIC_DESIGN_DATA_ERROR,
    GET_EUROPEAN_TALENT_DATA_ERROR, GET_CORPORATE_DATA_ERROR, GET_CORPORATE_DATA_SUCCESS, GET_CORPORATE_DATA
} from "./types";

const RETRY_COUNTER = 3;

// export const getData = ()  => async dispatch => {
//     getPageData('visuals');
//     getPageData('writers');
//     getPageData('storyboards');
//     getPageData('graphic-design');
//     getPageData('european-talent');
// }

export const getPageData = (menuTitle) => async dispatch => {
   dispatch({
       type: getInitialActionFromTitle(menuTitle),
   });

   let counter = 0;

   while (true) {
       try {
           const data = await APIService.fetchMenuItemMainPageData(menuTitle);
           dispatch({
               type: getSuccessActionFromTitle(menuTitle),
               payload: data.data,
           });
           break;
       } catch (e) {
           if (counter >= RETRY_COUNTER) {
               dispatch({
                   type: getErrorActionFromTitle(menuTitle),
                   payload: e.response.data.message,
               });
               break;
           }
           console.log('retrying');
           counter++;
       }
   }
};

const getInitialActionFromTitle = (menuTitle) => {
    switch (menuTitle) {
        case ('visuals'):
            return GET_VISUALS_DATA;
        case ('writers'):
            return GET_WRITERS_DATA;
        case ('storyboards'):
            return GET_STORYBOARDS_DATA;
        case ('graphic-design'):
            return GET_GRAPHIC_DESIGN_DATA;
        case ('european-talent'):
            return GET_EUROPEAN_TALENT_DATA;
        case ('corporates'):
            return GET_CORPORATE_DATA;
        default:
            return GET_VISUALS_DATA;
    }
};

const getSuccessActionFromTitle = (menuTitle) => {
    switch (menuTitle) {
        case ('visuals'):
            return GET_VISUALS_DATA_SUCCESS;
        case ('writers'):
            return GET_WRITERS_DATA_SUCCESS;
        case ('storyboards'):
            return GET_STORYBOARDS_DATA_SUCCESS;
        case ('graphic-design'):
            return GET_GRAPHIC_DESIGN_DATA_SUCCESS;
        case ('european-talent'):
            return GET_EUROPEAN_TALENT_DATA_SUCCESS;
        case ('corporates'):
            return GET_CORPORATE_DATA_SUCCESS;
        default:
            return GET_VISUALS_DATA_SUCCESS;
    }
};

const getErrorActionFromTitle = (menuTitle) => {
    switch (menuTitle) {
        case ('visuals'):
            return GET_VISUALS_DATA_ERROR;
        case ('writers'):
            return GET_WRITERS_DATA_ERROR;
        case ('storyboards'):
            return GET_STORYBOARDS_DATA_ERROR;
        case ('graphic-design'):
            return GET_GRAPHIC_DESIGN_DATA_ERROR;
        case ('european-talent'):
            return GET_EUROPEAN_TALENT_DATA_ERROR;
        case ('corporates'):
            return GET_CORPORATE_DATA_ERROR;
        default:
            return GET_VISUALS_DATA_ERROR;
    }
};

