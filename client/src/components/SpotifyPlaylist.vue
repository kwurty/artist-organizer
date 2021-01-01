<template>
  <div class="playlist" v-if="spotify_playlist_tracks != undefined">
    <ul>
      <li v-for="track in spotify_playlist_tracks" :key="track.added_at">
        <img v-if="track.track.album.images.length > 2" :src="track.track.album.images[2].url" >
        {{ track.track.name }}
        <div v-for="artist in track.track.artists" :key="artist.id"> <a @click.prevent="openArtist(artist.id)"> {{artist.name}} </a>
        </div>
        
      </li>
    </ul>
  </div>
</template>

<script>
export default {

  computed: {
    spotify_playlist_tracks() {
      return this.$store.state.spotify_playlist_tracks;
    },
  },
  methods: {
    openArtist(artistId) {
      this.$store.dispatch('getArtist', artistId);
      this.$router.push("/artist");
    }
  },
};
</script>

<style lang="scss" scoped>
</style>