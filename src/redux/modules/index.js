import { combineReducers } from 'redux'
import entities from './entities'
import home from './home'
import detail from './detail'
import search from './search'
import searchResult from './searchResult'
import login from './login'
import app from './app'
import user from './user'

//合并成根reducer
const rootReducer = combineReducers({
    entities,
    home,
    detail,
    app,
    search,
    searchResult,
    login,
    user
})

export default rootReducer