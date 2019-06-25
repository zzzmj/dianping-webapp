import { combineReducers } from 'redux'
import entities from './entities'
import home from './home'
import detail from './detail'
import search from './search'
import app from './app'

//合并成根reducer
const rootReducer = combineReducers({
    entities,
    home,
    detail,
    app,
    search
})

export default rootReducer
