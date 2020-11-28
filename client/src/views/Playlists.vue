<template>
  <div class="is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-flex-start is-align-content-flex-start">
    <div class="playlists">
        <app-spotify-playlist-list 
          v-for="playlist in spotify_playlists" :key="playlist.id"
          :playlist="playlist"
        />
      </div>
  </div>
</template>

<script>
import SpotifyPlaylistList from '../components/SpotifyPlaylistList.vue'
export default {
  mounted() {
    // if(this.$store.state.spotify_playlists == 0) {
      if(this.$store.state.isAuthenticated && this.$store.state.spotify_playlists == null) {
        this.$store.dispatch("getSpotifyPlaylists")
      }
    // }
  },
  computed: {
    spotify_playlists() {
      return this.$store.state.spotify_playlists;
    },
    playlist_image(playlist) {
      let image = playlist.images[1];
      return image.url;
    }
  },
  components: {
    appSpotifyPlaylistList: SpotifyPlaylistList
  }
}
</script>

<style lang="scss" scoped>
  .playlists {
    flex-basis: 80%;
    padding: 20px 0;
    margin: auto;

    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
  }
</style>
