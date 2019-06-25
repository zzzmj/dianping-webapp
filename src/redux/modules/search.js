import { combineReducers } from 'redux'
import url from '../../utils/url'
import { FETCH_DATA } from '../middleware/api'
import { schema } from './entities/keywords'

export const types = {
    // 获取热门关键词
    FETCH_POPULAR_KEYWORDS_REQUEST: 'SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST',
    FETCH_POPULAR_KEYWORDS_SUCCESS: 'SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS',
    FETCH_POPULAR_KEYWORDS_FAILURE: 'SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE',
    // 根据输入的文本获取相关的关键词
    FETCH_RELATED_KEYWORDS_REQUEST: 'SEARCH/FETCH_RELATED_KEYWORDS_REQUEST',
    FETCH_RELATED_KEYWORDS_SUCCESS: 'SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS',
    FETCH_RELATED_KEYWORDS_FAILURE: 'SEARCH/FETCH_RELATED_KEYWORDS_FAILURE',
    // 设置当前输入
    SET_INPUT_TEXT: "SEARCH/SET_INPUT_TEXT",
    CLEAR_INPUT_TEXT: 'SEARCH/CLEAR_INPUT_TEXT',
    // 历史查询记录
    ADD_HISTORY_KEYWORD: 'SEARCH/ADD_HISTORY_KEYWORD',
    CLEAR_HISTORY_KEYWORD: 'SEARCH/CLEAR_HISTORY_KEYWORD',
}

const initState = {
    inputText: '',
    // 保存流行词状态
    popularKeywords: {
        isFetching: false,
        ids: []
    },
    // 相关的关键字
    relatedKeywords: {
        
    },
    // 保存关键词id
    historyKeywords: [] 
}

export const actions = {
    // 获取热门关键词
    loadPopularKeywords: () => {
        return (dispatch, getState) => {
            const endpoint = url.getPopularKeywords()
            return dispatch(fetchPopularKeywords(endpoint))
        }
    },

    // 根据输入的内容获取相关关键词
    loadRelatedKeywords: (text) => {
        return (dispatch, getState) => {
            const endpoint = url.getRelatedKeywords()
            return dispatch(fetchRelatedKeywords(endpoint, text))
        }
    },

    setInputText: text => ({
        type: types.SET_INPUT_TEXT,
        text
    }),
    clearInputText: () => ({
        type: types.CLEAR_INPUT_TEXT
    }),
    addHistoryKeyword: (keywordId) => ({
        type: types.ADD_HISTORY_KEYWORD,
        text: keywordId
    }),
    clearHistoryKeywords: () => ({
        type: types.CLEAR_HISTORY_KEYWORD
    })
}

const fetchPopularKeywords = (endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_POPULAR_KEYWORDS_REQUEST,
            types.FETCH_POPULAR_KEYWORDS_SUCCESS,
            types.FETCH_POPULAR_KEYWORDS_FAILURE,
        ],
        schema,
        endpoint
    }
})

const fetchRelatedKeywords = (endpoint, text) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_RELATED_KEYWORDS_REQUEST,
            types.FETCH_RELATED_KEYWORDS_SUCCESS,
            types.FETCH_RELATED_KEYWORDS_FAILURE,
        ],
        schema,
        endpoint
    }, 
    text
})

const popularKeywords = (state = initState.popularKeywords, action) => {
    switch (action.type) {
        case types.FETCH_POPULAR_KEYWORDS_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                ids: state.ids.concat(action.response.id)
            }
        case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
            }
        default:
            return state
    }
}

const relatedKeywords = (state = initState.relatedKeywords, action) => {
    switch (action.type) {
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
            return {
                ...state,
                isFetching: true
            }
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                ids: state.ids.concat(action.response.id)
            }
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
            }
        default:
            return state
    }
}

const reducer = combineReducers({

})

export default reducer