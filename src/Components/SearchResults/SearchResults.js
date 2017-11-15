import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

class SearchResults extends React.Component{
  render(){
    return(
      <div className="SearchResults">
        <h2>Search Results</h2>
        <TrackList tracks={this.props.searchResults} source="search" onAdd={this.props.onAdd} />
      </div>
    );
  }
}

export default SearchResults;
