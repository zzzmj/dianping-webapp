import React, { Component } from 'react'
import OrderItem from '../OrderItem'
import './style.css'


const tabTitles = ['全部订单', '待付款', '可使用', '退款/售后']

class UserMain extends Component {
    render() {
        const { data, currentTab } = this.props
        return (
            <div className="userMain">
                <div className="userMain__menu">
                    {tabTitles.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="userMain__tab"
                                onClick={this.handleClickTab.bind(this, index)}
                            >
                                <span
                                    className={
                                        currentTab === index
                                            ? 'userMain__title userMain__title--active'
                                            : 'userMain__title'
                                    }
                                >
                                    {item}
                                </span>
                            </div>
                        )
                    })}
                </div>
                <div className="userMain__content">
                    {data && data.length > 0
                        ? this.renderOrderList(data)
                        : this.renderEmpty()}
                </div>
            </div>
        )
    }

    renderOrderList = data => {
        return data.map(item => {
            return <OrderItem key={item.id} data={item} />
        })
    }

    renderEmpty = () => {
        return (
            <div className="userMain__empty">
                <div className="userMain__emptyIcon" />
                <div className="userMain__emptyText1">您还没有相关订单</div>
                <div className="userMain__emptyText2">去逛逛看有哪些想买的</div>
            </div>
        )
    }

    handleClickTab = index => {
        this.props.onClickTab(index)
    }
}

export default UserMain
