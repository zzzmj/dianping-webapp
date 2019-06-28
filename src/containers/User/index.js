import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserMain from "./container/UserMain"
import UserHeader from "./components/UserHeader"
import { getOrders, getCurrentTab, actions as userActions } from '../../redux/modules/user';
import { actions as loginActions } from '../../redux/modules/login'
import { bindActionCreators } from 'redux';

class User extends Component {
    render() {
        const { orders, currentTab } = this.props
        return (
            <div>
                <UserHeader onBack={this.handleBack} onLogout={this.handleLogout}/>
                <UserMain data={orders} currentTab={currentTab} onClickTab={this.handleClickTab}/>
            </div>
        )
    }

    componentDidMount() {
        this.props.userActions.loadOrders()
    }

    handleBack = () => {
        this.props.history.push('/')
    }

    handleLogout = () => {
        this.props.loginActions.logout()
    }

    handleClickTab = (index) => {
        this.props.userActions.setCurrentTab(index)
    }
}

const mapStateToProps = state => {
    return {
        orders: getOrders(state),
        currentTab: getCurrentTab(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        loginActions: bindActionCreators(loginActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User)