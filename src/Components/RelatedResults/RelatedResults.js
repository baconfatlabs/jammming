import React from 'react';
import './RelatedResults.css';
import TrackList from '../TrackList/TrackList';

class RelatedResults extends React.Component{
  render(){
    return(
      <div className="RelatedResults">
        <h2>You may also like....</h2>
        <TrackList tracks={this.props.relatedResults} source="related" onAdd={this.props.onAdd} />
      </div>
    );
  }
}

export default RelatedResults;
