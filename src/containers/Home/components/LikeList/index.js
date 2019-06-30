import React, { Component } from 'react'
import LikeItem from '../LikeItem'
import dataSource from './dataSource'
import './style.css'
import Loading from '../../../../components/Loading';

class LikeList extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
        this.state = {
            data: dataSource,
            loadCounts: 1,
        }
        this.removeListener = false
    }

    render() {
        const { data, pageCount } = this.props
        return (
            <div className="likeList" ref={this.myRef}>
                <div className="likeList__header">猜你喜欢</div>
                <div className="likeList__list">
                    {data.map((item, index) => {
                        return <LikeItem key={index} id={item.id} data={item} />
                    })}
                </div>
                {pageCount < 3 ? <Loading /> : <a className="likeList__viewAll" href="/">查看更多</a>}
            </div>
        )
    }

    componentDidMount() {
        const { pageCount } = this.props
        // 页面加载三次后结束
        if (pageCount < 3) {
            document.addEventListener('scroll', this.handleScroll)
        } else {
            this.removeListener = true
        }
        // 页面第一次加载时候才发送请求，其余时刻利用redux数据缓存
        if (this.props.pageCount === 0) {
            this.props.loadLikes()
        }
    }

    handleScroll = () => {
        // LikeList组件首页可视高度 = 当前窗口高度 - LikeList组件offsetTop
        const visibleHeight =
        document.documentElement.clientHeight - this.myRef.current.offsetTop
        // LikeList组件实际高度
        const actualHeight = this.myRef.current.offsetHeight
        // 滚动高度
        const scrollHeight = document.documentElement.scrollTop
        // 可视高度 + 滚动高度 >= LikeList组件实际高度时就加载
        if (scrollHeight + visibleHeight >= actualHeight) {
            this.props.loadLikes()
        }
    }

    componentDidUpdate() {
        const { pageCount } = this.props
        if (!this.removeListener && pageCount >= 3) {
            document.removeEventListener('scroll', this.handleScroll)
            this.removeListener = true
        }
    }

    componentWillUnmount() {
        if (!this.removeListener) {
            document.removeEventListener('scroll', this.handleScroll)
            this.removeListener = true
        }
    }
}

export default LikeList
