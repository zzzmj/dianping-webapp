import { combineReducers } from 'redux'
import url from '../../utils/url'
import { FETCH_DATA } from '../middleware/api'
import { schema, getKeywordById } from './entities/keywords'

// action types
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
    SET_INPUT_TEXT: 'SEARCH/SET_INPUT_TEXT',
    CLEAR_INPUT_TEXT: 'SEARCH/CLEAR_INPUT_TEXT',
    // 历史查询记录
    ADD_HISTORY_KEYWORD: 'SEARCH/ADD_HISTORY_KEYWORD',
    CLEAR_HISTORY_KEYWORD: 'SEARCH/CLEAR_HISTORY_KEYWORD'
}

const initState = {
    inputText: '',
    // 保存流行词状态
    popularKeywords: {
        isFetching: false,
        ids: []
    },
    // 相关的关键字，建立关键词索引
    relatedKeywords: {},
    // 保存关键词id
    historyKeywords: []
}

// action creator
export const actions = {
    // 获取热门关键词
    loadPopularKeywords: () => {
        return (dispatch, getState) => {
            // 热门关键词只请求一次
            const { ids } = getState().search.popularKeywords;
            if (ids.length > 0) {
                return null;
            }
            const endpoint = url.getPopularKeywords()
            return dispatch(fetchPopularKeywords(endpoint))
        }
    },
    // 根据输入的内容获取相关关键词
    loadRelatedKeywords: text => {
        return (dispatch, getState) => {
            // 查询关键词索引是否建立
            const { relatedKeywords } = getState().search
            if (relatedKeywords[text]) {
                return null
            }
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
    addHistoryKeyword: keywordId => ({
        type: types.ADD_HISTORY_KEYWORD,
        text: keywordId
    }),
    clearHistoryKeywords: () => ({
        type: types.CLEAR_HISTORY_KEYWORD
    })
}

const fetchPopularKeywords = endpoint => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_POPULAR_KEYWORDS_REQUEST,
            types.FETCH_POPULAR_KEYWORDS_SUCCESS,
            types.FETCH_POPULAR_KEYWORDS_FAILURE
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
            types.FETCH_RELATED_KEYWORDS_FAILURE
        ],
        schema,
        endpoint
    },
    text
})

// popular Reducer
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
                ids: state.ids.concat(action.response.ids)
            }
        case types.FETCH_POPULAR_KEYWORDS_FAILURE:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}

// related Reducer
const relatedKeywords = (state = initState.relatedKeywords, action) => {
    switch (action.type) {
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
        case types.FETCH_RELATED_KEYWORDS_FAILURE:
            return {
                ...state,
                [action.text]: relatedKeywordsByText(state[action.text], action)
            }
        default:
            return state
    }
}

// related的子reducer
const relatedKeywordsByText = (
    state = { isFetching: false, ids: [] },
    action
) => {
    switch (action.type) {
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
            return { ...state, isFetching: true }
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                ids: state.ids.concat(action.response.ids)
            }
        case types.FETCH_RELATED_KEYWORDS_FAILURE:
            return { ...state, isFetching: false }
        default:
            return state
    }
}

// inputText reducer
const inputText = (state = initState.inputText, action) => {
    switch (action.type) {  
        case types.SET_INPUT_TEXT:
            return action.text
        case types.CLEAR_INPUT_TEXT:
            return ''
        default:
            return state
    }
}

// historyKeywords Reducer
const historyKeywords = (state = initState.historyKeywords, action) => {
    switch (action.type) {
        case types.ADD_HISTORY_KEYWORD:
            // 避免添加重复的记录
            const data = state.filter(item => item !== action.text)
            return [action.text, ...data]
        case types.CLEAR_HISTORY_KEYWORD:
            return []
        default:
            return state
    }
}

const reducer = combineReducers({
    popularKeywords,
    relatedKeywords,
    inputText,
    historyKeywords
})

export default reducer

// selectors
export const getInputText = (state) => {
    return state.search.inputText
}

export const getPopularKeywords = (state) => {
    let ids = state.search.popularKeywords.ids
    if (ids) {
        return ids.map(id => {
            return getKeywordById(state, id)
        })
    } else {
        return null
    }
}

export const getRelatedKeywords = state => {
    console.log('selector函数, getRelatedKeywords', state)

    const text = state.search.inputText;
    if(!text || text.trim().length === 0) {
        return [];
    } 
    const relatedKeywords = state.search.relatedKeywords[text];
    if(!relatedKeywords) {
        return []
    }
    return relatedKeywords.ids.map(id => {
        return getKeywordById(state, id)
    })
}

export const getHistoryKeywords = (state) => {
    console.log('selector函数, getHistoryKeywords', state)

    return state.search.historyKeywords.map(id => {
        return getKeywordById(state, id)
    })
}