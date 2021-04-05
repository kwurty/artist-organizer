<template>
  <div class="spotify-playlist" @click="openPlaylist(playlist.tracks.href)">
    <div class="img-container">
      <img v-if="playlist.images[1]" :src="playlist.images[1].url" />
      <img v-else src="../assets/no-image.png" alt="" />
    </div>
    <h1 class="is-size-6 has-text-left">
      {{ playlist.name }}
    </h1>
    <span class="subtext">By {{ playlist.owner.display_name }}</span>
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
  methods: {
    openPlaylist(url) {
      this.$store.dispatch("getSpotifyPlaylistTracks", { url, allTracks: [] });
      this.$router.push("/playlists/tracks");
    },
  },
};
</script>

<style lang="scss" scoped>
.spotify-playlist {
  width: 100%;
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background: #181818;
  color: #fff;
  padding: 16px;
  transition: background-color 0.3s ease;
  .img-container {
    height: 100%;
    width: 100%;
    img {
      display: block;
      margin: auto;
      width: 150px;
      height: 150px;
      object-fit: cover;
      object-position: center center;
      border-radius: 50%;
    }
  }
  h1 {
    width: 100%;
    font-size: 1.3rem;
    text-align: center;
    font-family: "Montserrat", sans-serif;
  }
  .subtext {
    color: #888888;
    font-size: 0.88rem;
    font-family: "Montserrat", sans-serif;
  }

  &:hover {
    cursor: pointer;
    background: rgba(180, 180, 180, 0.2);
  }
}
</style>