<template>
  <div v-if="artist != null">
    {{ artist }} <br />
    <h1 class="title">{{ artist.name }}</h1>
    <img v-if="artist.images.length > 0" :src="artist.images[0].url" />
    <img v-else src="https://placeholder.com/640" />
    <div>
      <div class="dropdown" :class="[isActive ? 'is-active' : '']">
        <div class="dropdown-trigger">
          <button
            class="button is-primary"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            @click="toggleActive()"
          >
            <span>Add to Playlist</span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a
              v-for="playlist in playlists"
              :key="playlist.id"
              href="#"
              class="dropdown-item"
              @click.prevent="addToPlaylist(playlist)"
            >
              {{ playlist.display_name }}</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      isActive: false,
    };
  },
  mounted() {},
  computed: {
    artist() {
      return this.$store.state.artist;
    },
    playlists() {
      return this.$store.state.artistPlaylists;
    },
  },
  methods: {
    toggleActive() {
      this.isActive = !this.isActive;
    },
    async addToPlaylist(playlist) {
      let results = await Axios.post(
        `${process.env.VUE_APP_BACKEND_URI}/artist/playlist/add`,
        {
          playlistId: playlist._id,
          artistId: this.artist.id,
          artistUrl: this.artist.href,
          artistImage:
            this.artist.images[0].url || "https://placeholder.com/640",
        },
        { withCredentials: true }
      );
      console.log(results);
    },
  },
};
</script>

<style>
</style>