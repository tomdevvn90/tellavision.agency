import {combineReducers} from "redux";

import corporate from "./corporate";
import europeanTalent from './european-talent';
import graphicDesign from './graphic-design';
import storyboards from "./storyboards";
import visuals from "./visuals";
import writers from "./writers";

export default combineReducers({
    corporate,
    europeanTalent,
    graphicDesign,
    storyboards,
    visuals,
    writers
});
