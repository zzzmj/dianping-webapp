import React, { Component } from 'react'
import Category from './components/Category';
import Discount from './components/Discount';
import LikeList from './components/LikeList';
import Banner from './components/Banner';
import HomeHeader from './components/HomeHeader';
import Footer from '../../components/Footer';
import { connect } from 'react-redux';
import { actions as homeActions, getLikes, getDiscounts, getPageCountOfLikes } from '../../redux/modules/home'


class Home extends Component {
    render() {
        const { likes, discounts, pageCount, loadLikes } = this.props
        return (
            <div>
                <HomeHeader />
                <Banner />
                <Category />
                <Discount data={discounts}/>
                <LikeList data={likes} pageCount={pageCount} loadLikes={loadLikes}/>
                <Footer />
            </div>
        )
    }

    componentDidMount() {
        // 组件挂载完成后，发送action，向服务器请求数据
        this.props.loadDiscount()
    }
}

const mapStateToProps = state => {
    return {
        likes: getLikes(state),
        discounts: getDiscounts(state),
        pageCount: getPageCountOfLikes(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadLikes: () => {
            dispatch(homeActions.loadLikes())
        },
        loadDiscount: () => {
            dispatch(homeActions.loadDiscounts())
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
