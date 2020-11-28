<template>
  <div class="playlist">
    <ul>
      <li v-for="track in spotify_playlist_tracks" :key="track.added_at">
        {{ track.track.name }}
        <!-- <li>{{ track.track.Artists }}</li> -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    playlist: {
      type: Object,
      required: true,
    },
  },
  computed: {
    spotify_playlist_tracks() {
      return this.$store.state.spotify_playlist_tracks;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>