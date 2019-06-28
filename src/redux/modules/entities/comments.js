export const schema = {
    name: 'comments',
    id: 'id'
}

export const types = {
    // 新增评论
    ADD_COMMENT: 'COMMENT/ADD_COMMENT'
}

export const actions = {
    addComment: (comment) => ({
        type: types.ADD_COMMENT,
        comment
    })
}

const reducer = (state = {}, action) => {
    if (action.type === types.ADD_COMMENT) {
        return {
            ...state,
            [action.comment.id]: action.comment
        }
    } else if (action.response && action.response.comments) {
        // 外部影响，实体组件如果存在响应，也应该进行更新
        return { ...state, ...action.response.comments }
    }
    return state
}

export default reducer