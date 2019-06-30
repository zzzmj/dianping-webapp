import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchHeader from './components/SearchHeader'
import KeywordBox from './components/KeywordBox'
import ShopList from './components/ShopList'
import { getSearchShops } from '../../redux/modules/searchResult'

class SearchResult extends Component {
    render() {
        const { searchShops } = this.props
        return (
            <div>
                <SearchHeader
                    onBack={this.handleBack}
                    onSearch={this.handleSearch}
                />
                <KeywordBox />
                <ShopList data={searchShops}/>
            </div>
        )
    }

    handleBack = () => {
        this.props.history.push('/')
    }

    handleSearch = () => {
        this.props.history.push('/search')
    }
}
const mapStateToProps = state => {
    return {
        searchShops: getSearchShops(state)
    }
}

export default connect(
    mapStateToProps,
    null
)(SearchResult)
