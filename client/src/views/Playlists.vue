<template>
  <main>
    <div class="playlists">
      <app-spotify-playlist-list
        v-for="playlist in spotify_playlists"
        :key="playlist.id"
        :playlist="playlist"
      />
    </div>
  </main>
</template>

<script>
import SpotifyPlaylistList from "../components/SpotifyPlaylistList.vue";
export default {
  mounted() {
    // if(this.$store.state.spotify_playlists == 0) {
    if (
      this.$store.state.isAuthenticated &&
      this.$store.state.spotify_playlists == null
    ) {
      this.$store.dispatch("getSpotifyPlaylists");
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
    },
  },
  components: {
    appSpotifyPlaylistList: SpotifyPlaylistList,
  },
};
</script>

<style lang="scss" scoped>
main {
  background-color: #292b2d;
  padding: 0 32px;
  header {
    h1 {
      font-size: 2rem;
      color: #fff;
    }
  }
  .playlists {
    display: grid;
    direction: ltr;
    column-gap: 24px;
    row-gap: 24px;
    --minimumColumnWidth: 180px;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    font-family: "Montserrat", sans-serif;
  }
}
</style>
