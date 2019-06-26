import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchBox from './components/SearchBox'
import PopularSearch from './components/PopularSearch'
import SearchHistory from './components/SearchHistory'
import { actions, getPopularKeywords, getInputText, getHistoryKeywords, getRelatedKeywords } from '../../redux/modules/search'

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
                    onClickKeyword={this.handleClickKeyword}/>
                <PopularSearch 
                    data={popularKeywords}
                    onClickKeyword={ this.handleClickKeyword } />
                <SearchHistory 
                    data={historyKeywords}
                    onClaerHistory={this.handleClearHistory} />
            </div>
        )
    }

    componentDidMount() {
        // 组件挂载后加载流行词
        console.log('开始发送加载流行词请求')
        this.props.loadPopularKeywords()
    }

    // 搜索框文本变化
    handleChangeInput = (text) => {
        // 1. 更新搜索框文本状态 2. 发送请求关键词
        this.props.setInputText(text)
        this.props.loadReletedKeywords(text)
    }

    // 清除搜索框文本信息
    handleClearInput = () => {
        this.props.clearInputText()
    }

    // 取消输入，
    handleCancelInput = () => {
        // 1. 清除输入框内容。 2. 返回到主页
        this.props.clearInputText();
        this.props.history.goBack();
    }

    // 处理点击关键词
    handleClickKeyword = (keyword) => {
        // 1. 添加到历史记录 2. 跳转到新页面
        this.props.addHistoryKeyword(keyword)
        // TODO
        this.props.history.push('/search_result')
    }

    // 清除历史记录
    handleClearHistory = () => {
        this.props.clearHistoryKeywords()
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
        loadPopularKeywords: () => {
            dispatch(actions.loadPopularKeywords())
        },
        loadReletedKeywords: (text) => {
            dispatch(actions.loadRelatedKeywords(text))
        },
        setInputText: (text) => {
            dispatch(actions.setInputText(text))
        },
        clearInputText: () => {
            dispatch(actions.clearInputText())
        },
        addHistoryKeyword: (keyword) => {
            dispatch(actions.addHistoryKeyword(keyword))
        },
        clearHistoryKeywords: () => {
            dispatch(actions.clearHistoryKeywords())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)