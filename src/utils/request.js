const headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
})

function get(url) {
    return fetch(url, {
        method: 'GET',
        headers: headers
    }).then(responce => {
        return handleResponce(url, responce)
    }).catch(error => {
        console.error(`GET Request fail. url:${url}. message:${error}`)
        return Promise.reject({
            error: {
                message: 'GET Request failed.'
            }
        })
    })
}

function post(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: headers,
        data: data
    })
        .then(responce => {
            return handleResponce(url, responce)
        })
        .catch(error => {
            console.error(`POST Request fail. url:${url}. message:${error}`)
            return Promise.reject({
                error: {
                    message: 'POST Request failed.'
                }
            })
        })
}

function handleResponce(url, responce) {
    let res = responce
    if (res.status === 200) {
        return res.json()
    } else {
        console.error(`Request fail. url:${url}`)
        Promise.reject({
            error: {
                message: 'Request failed due to server error'
            }
        })
    }
}

export {
    get,
    post
}