import { createStore, applyMiddleware } from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

import rootReducer from './reducers'

const initialState = undefined;

const middeware = [thunk];

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middeware)));

export default store;
