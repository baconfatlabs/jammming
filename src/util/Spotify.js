const clientID = '71a352963bab43f5bb9e671f25a65a38';
//const myURI = 'http://localhost:3000/';
const myURI = 'http://baconfatlabs.surge.sh/';
const spotifyBaseURL = 'https://api.spotify.com/v1/';

let accessToken;

const Spotify = {
  getAccessToken(){

    if(accessToken){
      return accessToken;
    }

    let token = window.location.href.match(/access_token=([^&]*)/);
    let expiration = window.location.href.match(/expires_in=([^&]*)/);

    if(token && expiration){
      accessToken = token[1];
      window.setTimeout(() => (accessToken = ''), expiration[1] * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;

    }else{
      const url = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${myURI}&response_type=token&scope=playlist-modify-public&state=123`;
      window.location = url;
    }

  },

  savePlaylist(name, trackURIs){
    if(!name || !trackURIs){
      return;
    }

    const accessToken = Spotify.getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    let userID;
    let playlistID;

    //start Promise chain to obtain userID.
    fetch(`${spotifyBaseURL}me`, {headers: headers}).then( response => {
      if(response.ok){
        return response.json();
      }
    }, networkError => console.log('Network Error: ' + networkError.message)
    ).then( jsonResponse => {
      userID = jsonResponse.id;

      //start call to name playlist
      fetch( `${spotifyBaseURL}users/${userID}/playlists`,
         {
           headers: headers,
           method: 'POST',
           body: JSON.stringify({ name: name })
         }
      ).then( response => {
        if(response.ok){
          return response.json();
        }
      }, networkError => console.log('Network Error: ' + networkError.message)
      ).then( jsonResponse => {
        playlistID = jsonResponse.id;

        //Start call to add tracks
        fetch( `${spotifyBaseURL}users/${userID}/playlists/${playlistID}/tracks`,
           {
             headers: headers,
             method: 'POST',
             body: JSON.stringify({ uris: trackURIs })
           }
        );
        //
      });
      //
    });
  },

  search(term){
    const accessToken = Spotify.getAccessToken();

    return fetch(
      `${spotifyBaseURL}search?type=track&q=${term}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    ).then(response => {
        if(response.ok){
          return response.json();
        }
    }, networkError => console.log('Network Error: ' + networkError.message)
    ).then(
      jsonResponse => {
        if(!jsonResponse.tracks){
          return [];
        }
        return jsonResponse.tracks.items.map( track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          artistID: track.artists[0].id,
          album: track.album.name,
          uri: track.uri
        }));
      }
    );
  },

  searchRelated(artist, track){
    const accessToken = Spotify.getAccessToken();

    return fetch(
      `${spotifyBaseURL}recommendations?seed_artists=${artist}&seed_tracks=${track}&popularity=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    ).then(response => {
        if(response.ok){
          return response.json();
        }
    }, networkError => console.log('Network Error: ' + networkError.message)
    ).then(
      jsonResponse => {
        if(!jsonResponse.tracks){
          return [];
        }
        return jsonResponse.tracks.map( track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          artistID: track.artists[0].id,
          album: track.album.name,
          uri: track.uri
        }));
      }
    );
  },

}

export default Spotify;
