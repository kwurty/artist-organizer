<template>
  <aside class="column is-2 aside hero is-fullheight" v-if="auth">
    <div>
      <div class="main">
        <div class="title">Artist Playlists</div>
        <a
          class="item"
          @click.prevent="setPlaylist(playlist._id)"
          v-for="playlist in playlists"
          :key="playlist._id"
        >
          {{ playlist.display_name }}
        </a>
      </div>
      <div class="playlist has-text-centered">
        <a
          class="button spotify-green-background is-block is-bold"
          @click.prevent="createPlaylist()"
        >
          <span class="playlist">New Playlist</span>
        </a>
        <input
          class="input"
          type="text"
          placeholder="Search artist, song, or album"
          v-model="newPlaylist"
        />
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  data: () => {
    return {
      newPlaylist: "",
    };
  },
  computed: {
    auth() {
      return this.$store.getters.isAuthenticated;
    },
    playlists() {
      return this.$store.getters.artistPlaylists;
    },
  },
  methods: {
    setPlaylist(playlist) {
      this.$router.push(`/artistplaylists/${playlist}`);
    },
    createPlaylist() {
      this.$store.dispatch("createArtistPlaylist", this.newPlaylist);
      this.newPlaylist = "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>