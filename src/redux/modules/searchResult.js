import url from "../../utils/url";
import { schema } from './entities/shops'
import { FETCH_DATA } from '../middleware/api'
import { getShopById } from "./entities/shops";

export const types = {
    // 搜索结果页
    FETCH_SEARCH_RESULT_REQUEST: 'SEARCH/FETCH_SEARCH_RESULT_REQUEST',
    FETCH_SEARCH_RESULT_SUCCESS: 'SEARCH/FETCH_SEARCH_RESULT_SUCCESS',
    FETCH_SEARCH_RESULT_FAILURE: 'SEARCH/FETCH_SEARCH_RESULT_FAILURE',
}

const initState = {
    /**
     * searchResult结构
     * {
     *     'keywordid': {
     *          isFetching,
     *          ids
     *      }
     * }
     */
    searchResult: {}
}

export const actions = {
    //
    loadSearchResult: (keywordId) => {
        return (dispatch, getState) => {
            // 如果该关键词已经请求过，就不必重复请求
            const keywords = getState().searchResult
            if (keywords[keywordId]) {
                return null
            }
            const endpoint = url.getSearchResult(keywordId)
            return dispatch(fetchSearchResult(endpoint, keywordId))
        }
    }
}

const fetchSearchResult = (endpoint, keywordId) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_SEARCH_RESULT_REQUEST,
            types.FETCH_SEARCH_RESULT_SUCCESS,
            types.FETCH_SEARCH_RESULT_FAILURE
        ],
        endpoint,
        schema
    },
    keywordId
})

const reducer = (state = initState.searchResult, action) => {
    switch (action.type) {
        case types.FETCH_SEARCH_RESULT_REQUEST:
        case types.FETCH_SEARCH_RESULT_SUCCESS:
        case types.FETCH_SEARCH_RESULT_FAILURE:
            return {
                ...state,
                [action.keywordId]: reducerById(state[action.keywordId], action)
            }
        default:
            return state
    }
}

const reducerById = (state = {
    isFetching: false,
    ids: []
}, action) => {
    switch (action.type) {
        case types.FETCH_SEARCH_RESULT_REQUEST:
            return {
                ...state,
                isFetching: true,
            }
        case types.FETCH_SEARCH_RESULT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                ids: state.ids.concat(action.response.ids)
            }
        case types.FETCH_SEARCH_RESULT_FAILURE:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}

export default reducer

// selectors
export const getSearchShops = (state) => {
    // 从历史记录的第一位中拿到当前搜索关键字
    const keywordId = state.search.historyKeywords[0]
    if (!keywordId) {
        return []
    }
    const shops = state.searchResult[keywordId]
    if (!shops) {
        return []
    }
    const result = shops.ids.map(id => {
        return getShopById(state, id)
    })
    return result
}