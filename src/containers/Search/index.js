import React, { Component } from 'react'
import SearchBox from './components/SearchBox'
import PopularSearch from './components/PopularSearch'
import SearchHistory from './components/SearchHistory'

class Search extends Component {
    render() {
        return (
            <div>
                <SearchBox />
                <PopularSearch />
                <SearchHistory />
            </div>
        )
    }
}

export default Search