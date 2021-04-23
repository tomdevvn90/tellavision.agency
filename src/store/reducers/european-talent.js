import {GET_EUROPEAN_TALENT_DATA, GET_EUROPEAN_TALENT_DATA_ERROR, GET_EUROPEAN_TALENT_DATA_SUCCESS} from "../actions/types";

const initialState = {
    loading: false,
    data: [],
    error: null
};

export default function (state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GET_EUROPEAN_TALENT_DATA:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_EUROPEAN_TALENT_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                data: payload,
                error: null,
            };
        case GET_EUROPEAN_TALENT_DATA_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        default:
            return state;
    }
}
