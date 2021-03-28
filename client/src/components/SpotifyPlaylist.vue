<template>
  <main>
    <div class="playlist">
      <div
        class="track"
        v-for="track in spotify_playlist_tracks"
        :key="track.added_at"
      >
        <div class="img-container">
          <img
            v-if="track.track.album.images.length > 2"
            :src="track.track.album.images[2].url"
          />
        </div>
        <h1 class="is-size-6 is-bold has-text-left">
          {{ track.track.name }}
        </h1>

        <a
          v-for="artist in track.track.artists"
          :key="artist.id"
          @click.prevent="openArtist(artist.id)"
        >
          {{ artist.name }}
        </a>
      </div>
    </div>
  </main>
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
      this.$store.dispatch("getArtist", artistId);
      this.$router.push("/artist");
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  display: grid;
  direction: ltr;
  column-gap: 24px;
  row-gap: 24px;
  --minimumColumnWidth: 280px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  font-family: "Montserrat", sans-serif;
  .track {
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

    a {
      color: #888888;

      &:hover {
        color: #1db954;
      }
    }
  }
}
</style>