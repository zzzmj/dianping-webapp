import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import OrderItem from '../../components/OrderItem'
import './style.css'
import { actions as userActions, getDeletingOrderId} from '../../../../redux/modules/user'
import Confirm from '../../../../components/Confirm'


const tabTitles = ['全部订单', '待付款', '可使用', '退款/售后']

class UserMain extends Component {
        render() {
        const { data, currentTab, deletingId } = this.props
        console.log('daletingId', deletingId)
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
                {/* 点击删除触发 deletingOrderId 更新， 渲染删除确认框页面 */}
                {deletingId ? this.renderConfirmDialog() : null}
            </div>
        )
    }

    renderOrderList = data => {
        return data.map(item => {
            return <OrderItem key={item.id} data={item} onRemove={this.handleRemove.bind(this, item.id)}/>
        })
    }

    renderConfirmDialog = () => {
        const { removeOrder, hideDeleteDialog } = this.props.userActions
        return <Confirm 
            content="确认删除该订单吗?"
            cancelText="取消"
            confirmText="确定"
            onCancel={hideDeleteDialog}
            onConfirm={removeOrder}
        />
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

    handleRemove = (id) => {
        console.log('showDeleteDiglog')
        this.props.userActions.showDeleteDialog(id)
    }

    handleClickTab = index => {
        this.props.onClickTab(index)
    }
}

const mapStateToProps = (state, props) => {
    return {
        deletingId: getDeletingOrderId(state)
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMain)
