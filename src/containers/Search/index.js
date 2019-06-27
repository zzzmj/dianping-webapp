import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SearchBox from './components/SearchBox'
import PopularSearch from './components/PopularSearch'
import SearchHistory from './components/SearchHistory'
import {
    actions as searchActions,
    getInputText,
    getPopularKeywords,
    getRelatedKeywords,
    getHistoryKeywords
} from '../../redux/modules/search'
import { actions as searchResultActions } from '../../redux/modules/searchResult'

class Search extends Component {
    render() {
        const {
            inputText,
            popularKeywords,
            relatedKeywords,
            historyKeywords
        } = this.props
        return (
            <div>
                <SearchBox
                    inputText={inputText}
                    relatedKeywords={relatedKeywords}
                    onChange={this.handleChangeInput}
                    onClear={this.handleClearInput}
                    onCancel={this.handleCancelInput}
                    onClickKeyword={this.handleClickKeyword}
                />
                <PopularSearch
                    data={popularKeywords}
                    onClickKeyword={this.handleClickKeyword}
                />
                <SearchHistory
                    data={historyKeywords}
                    onClaerHistory={this.handleClearHistory}
                />
            </div>
        )
    }

    componentDidMount() {
        // 组件挂载后加载流行词
        console.log('开始发送加载流行词请求')
        const { loadPopularKeywords } = this.props.searchActions
        loadPopularKeywords()
    }

    // 搜索框文本变化
    handleChangeInput = text => {
        // 1. 更新搜索框文本状态 2. 发送请求关键词
        const { setInputText, loadRelatedKeywords } = this.props.searchActions
        setInputText(text)
        loadRelatedKeywords(text)
    }

    // 清除搜索框文本信息
    handleClearInput = () => {
        const { clearInputText } = this.props.searchActions
        clearInputText()
    }

    // 取消输入，
    handleCancelInput = () => {
        // 1. 清除输入框内容。 2. 返回到主页
        const { clearInputText } = this.props.searchActions
        clearInputText()
        this.props.history.goBack()
    }

    // 处理点击关键词
    handleClickKeyword = keyword => {
        console.log('keyword', keyword)
        // 1. 添加到历史记录 2. 加载搜索结果页的商品列表 3. 跳转到新页面
        const { addHistoryKeyword } = this.props.searchActions
        addHistoryKeyword(keyword)
        const { loadSearchResult } = this.props.searchResultActions
        loadSearchResult(keyword)
        this.props.history.push('/search_result')
    }

    // 清除历史记录
    handleClearHistory = () => {
        const { clearHistoryKeywords } = this.props.searchActions
        clearHistoryKeywords()
    }
}

const mapStateToProps = state => {
    return {
        inputText: getInputText(state),
        popularKeywords: getPopularKeywords(state),
        relatedKeywords: getRelatedKeywords(state),
        historyKeywords: getHistoryKeywords(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        searchActions: bindActionCreators(searchActions, dispatch),
        searchResultActions: bindActionCreators(searchResultActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)
