import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import LoginHeader from './components/LoginHeader'
import LoginForm from './components/LoginForm'
import { actions as loginActions, getLoginUsername, getLoginPasswrod, getLoginStatus } from '../../redux/modules/login';

class Login extends Component {
    render() {
        const { username, password, login, location: {state} } = this.props

        if (login) {
            if (state && state.from) {
                return <Redirect to={state.from.pathname} />
            }
            return <Redirect to='/user' />
        }
        return (
            <div>
                <LoginHeader />
                <LoginForm 
                    username={username}
                    password={password}
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
            </div>
        )
    }

    handleChange = (e) => {
        const ele = e.target
        if (ele.name === 'username') {
            this.props.loginActions.setUsername(ele.value)
        } else if (ele.name === 'password') {
            this.props.loginActions.setPassword(ele.value)            
        }
    }

    handleSubmit = () => {
        this.props.loginActions.login()
    }
}

const mapStateToProps = state => {
    return {
        username: getLoginUsername(state),
        password: getLoginPasswrod(state),
        login: getLoginStatus(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginActions: bindActionCreators(loginActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
