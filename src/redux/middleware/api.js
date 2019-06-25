import { get } from '../../utils/request'

// 执行网络请求
const fetchData = (endpoint, schema) => {
    console.log('第二步，开始发送网络请求，地址：', endpoint)
    return get(endpoint).then(data => {
        console.log('第三步，请求data成功', data)
        return normalizeData(data, schema)
    })
}

/*
范式化数据，将获取到的json按照normalizr的方式，来规范
schema类似于数据表

范式化前
product.json = [
    {id: 'p-1', price: 19.9, ...},
    {id: 'p-2', price: 29.9, ...},
    {id: 'p-3', price: 39.9, ...},
    ...
]

范式化后
{
    product: {
        'p-1': {id: 'p-1', price: 19.9, ...},
        'p-2': {id: 'p-2', price: 29.9, ...},
        'p-3': {id: 'p-3', price: 39.9, ...},
        ...
    },
    ids: ['p-1', 'p-2'] // 保证有序性
}

在 reducer 中捕获entities.product的变化, 更新entities
在 Likes组件(发起action的组件)的 reducer中维护ids的变化
*/
const normalizeData = (data, schema) => {
    const { id, name } = schema
    let kvObj = {}
    let ids = []
    if (Array.isArray(data)) {
        data.forEach(item => {
            kvObj[item[id]] = item
            ids.push(item[id])
        })
    } else {
        kvObj[data[id]] = data
        ids.push(data[id])
    }
    var newOjb = {
        [name]: kvObj,
        ids
    }
    console.log('第四步：扁平化后data数据：', newOjb)
    return {
        [name]: kvObj,
        ids
    }
}

// 经过中间件处理的action所具有的标识
export const FETCH_DATA = 'FETCH DATA'

export default store => next => action => {
    // 判断给action是否需要该中间件处理
    const callAPI = action[FETCH_DATA]
    
    if (typeof callAPI === 'undefined') {
        return next(action)
    }
    console.log("第一步：callAPI中间件开始处理action", callAPI)
    // 派发的action必须有着三个属性
    const { endpoint, schema, types } = callAPI
    if (typeof endpoint !== 'string') {
        throw new Error('endpoint必须是字符串类型的URL')
    }
    if (!schema) {
        throw new Error('必须指定领域实体的schema')
    }
    if (!Array.isArray(types) && types.length !== 3) {
        throw new Error('必须指定一个包含了三个action type的数组')
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('action type必须为字符串')
    }

    // 这个函数是为了处理带额外参数的action
    const actionWith = data => {
        const finalAction = {...action, ...data}
        // 删除action标识
        delete finalAction[FETCH_DATA]
        return finalAction
    }
    // 三种类型对应着三种请求
    const [requestType, succesType, failureType] = types
    // 异步请求中
    next(actionWith({ type: requestType }))

    return fetchData(endpoint, schema).then(
        response => {
            console.log('第五步，最终dispatch的数据', actionWith({
                type: succesType,
                response
            }))
            next(actionWith({
                type: succesType,
                response
            }))
        },
        // 请求失败
        error =>
            next(actionWith({
                type: failureType,
                error: error.message || '获取数据失败'
            }))
    )
}
