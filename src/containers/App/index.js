import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ErrorToast from '../../components/ErrorToast'
import { actions as appActions, getError } from '../../redux/modules/app'
import PrivateRoute from '../PrivateRoute'
import AsyncComponent from '../../utils/AsyncComponent'
const Home = AsyncComponent(() => import('../Home'))
const ProductDetail = AsyncComponent(() => import('../ProductDetail'))
const Search = AsyncComponent(() => import('../Search'))
const SearchResult = AsyncComponent(() => import('../SearchResult'))
const Login = AsyncComponent(() => import('../Login'))
const User = AsyncComponent(() => import('../User'))
const Purchase = AsyncComponent(() => import('../Purchase'))

class App extends Component {
    render() {
        const {
            error,
            appActions: { clearError }
        } = this.props
        return (
            <div className="App">
                <Router basename="/dianping">
                    <Switch>
                        <Route path="/login" component={Login} />
                        <PrivateRoute path="/user" component={User} />
                        <Route path="/detail/:id" component={ProductDetail} />
                        <Route path="/search" component={Search} />
                        <PrivateRoute path="/purchase/:id" component={Purchase} />
                        <Route path="/search_result" component={SearchResult} />
                        <Route path="/" component={Home} />
                    </Switch>
                </Router>
                {error ? (
                    <ErrorToast msg={error} clearError={clearError} />
                ) : null}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        error: getError(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        appActions: bindActionCreators(appActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
