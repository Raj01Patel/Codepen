import { combineReducers } from "@reduxjs/toolkit";
import userAuthReducer from "./userAuthReducer";
import proojectReducer from "./ProjectReducer";

const myReducer = combineReducers({
    user : userAuthReducer,
    projects:proojectReducer
})

export default myReducer