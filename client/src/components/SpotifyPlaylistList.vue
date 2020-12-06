<template>
  <li class="spotify-playlist">
    <a @click="openPlaylist(playlist.tracks.href)">
      <img v-if="playlist.images[1]" :src="playlist.images[1].url" />
      <img v-else src="https://via.placeholder.com/300" alt="" />
    </a>
    <div class="spotify-playlist-description">
      <a class="title" @click="openPlaylist(playlist.tracks.href)"> 
     {{ playlist.name }}
     </a>
      <section class="spotify-playlist-details">
        By {{ playlist.owner.display_name }}
      </section>
    </div>
  </li>
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
      this.$store.commit("setSpotifyPlaylistTracks", null);
      this.$store.dispatch("getSpotifyPlaylistTracks", url);
      this.$router.push("/playlists/tracks");
    },
  },
};
</script>

<style lang="scss" scoped>
.spotify-playlist {
  box-sizing: border-box;
  min-width: 100px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  list-style: none;
  box-sizing: border-box;
  border: 1px solid #eee;
  box-shadow: 0 10px 20px -7px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
  }

  .spotify-playlist-description {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    word-wrap: break-word;
    .title {
      justify-content: center;
      max-width: 300px;
    }
  }
}

.spotify-playlist-details {
  display: flex;
  vertical-align: baseline;
}
.spotify-playlist-year,
.spotify-playlist-rating {
  display: flex;
  flex-direction: column;
}
.title {
  color: #1d1d1d;
  margin-bottom: 5px;
  font-size: 1.3rem;
  font-weight: normal;
  display: flex;
  flex-wrap: wrap;
}
.spotify-playlist-rating {
  align-items: flex-end;
}

@media (max-width: 536px) {
  .spotify-playlist {
    max-width: 300px;
  }
}
</style>