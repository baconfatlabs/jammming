import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import RelatedResults from '../RelatedResults/RelatedResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      relatedResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);


  }

  addTrack(track, src){
    let tracks = this.state.playlistTracks;
    if(!tracks.includes(track)){
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }

    //if track was added from search pane, populate a new recommendations list.
    if(src === "search"){
      Spotify.searchRelated(track.artistID, track.id).then(
        response => {
          this.setState({relatedResults: response});
        }
      )
    }

  }

  removeTrack(track){
    let trackFilter = this.state.playlistTracks.filter( function (stateTrack) {
      return stateTrack.id !== track.id;
    });

    this.setState({playlistTracks: trackFilter});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map( track => track.uri );

    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({
      playlistName: 'New Playlist',
      searchResults: [],
      relatedResults: [],
      playlistTracks: []
    });

  }

  search(term){
    Spotify.search(term).then(
      response => {
        this.setState({searchResults: response});
      }
    )
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
            <RelatedResults relatedResults={this.state.relatedResults} onAdd={this.addTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
