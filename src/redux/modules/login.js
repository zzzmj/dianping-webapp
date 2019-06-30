const initState = {
    username: localStorage.getItem('username') || '',
    password: '',
    isFetching: '',
    status: localStorage.getItem('status') || false,
}

export const types = {
    LOGIN_REQUEST: 'LOGIN/LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN/LOGIN_SUCCESS',
    LOGIN_FAILUER: 'LOGIN/LOGIN_FAILUER',
    LOGOUT: 'LOGIN/LOGOUT',
    SET_USERNAME: 'LOGIN/SET_USERNAME',
    SET_PASSWORD: 'LOGIN/SET_PASSWORD'
}

export const actions = {
    login: () => {
        return (dispatch, getState) => {
            const { username, password } = getState().login
            if (!username || username.length <= 0 || !password || password.length <= 0) {
                return dispatch(loginFailure('用户名和密码不能为空'))
            }
            dispatch(loginRequst())
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    localStorage.setItem('username', username)
                    localStorage.setItem('status', true)
                    dispatch(loginSuccess())
                    resolve()
                }, 1000)
            })
        }
    },
    logout: () => {
        localStorage.removeItem('username');
        localStorage.removeItem('status');
        return {
            type: types.LOGOUT
        }
    },
    setUsername: (username) => ({
        type: types.SET_USERNAME,
        username
    }),
    setPassword: (password) => ({
        type: types.SET_PASSWORD,
        password
    })
}

const loginRequst = () => ({
    type: types.LOGIN_REQUEST,
})

const loginSuccess = () => ({
    type: types.LOGIN_SUCCESS,
    status: true
})

const loginFailure = (error) => ({
    type: types.LOGIN_FAILUER,
    error
})

const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.LOGIN_REQUEST:
            return {
                ...state,
                isFetching: true,
            }
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                isFetching: false,
                status: true,
                username: action.username,
                password: action.password
            }
        case types.LOGIN_FAILUER: 
            return {
                ...state,
                error: action.error
            }
        case types.LOGOUT:
            return {
                ...state,
                status: false,
            }
        case types.SET_USERNAME:
            return {
                ...state,
                username: action.username
            }
        case types.SET_PASSWORD:
            return {
                ...state,
                password: action.password
            }
        default:
            return state
    }
}

export default reducer

// selectors
export const getLoginUsername = (state) => state.login.username
export const getLoginPasswrod = (state) => state.login.passwrod
export const getLoginStatus = (state) => state.login.status