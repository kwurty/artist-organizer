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

<style lang="scss">
html,
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  height: 100%;
  background-color: #fff;
}

.name {
  text-transform: uppercase;
}

.spotify-green-background {
  background: #20a950;
}

.button {
  border: 0;
  transition: background-color 0.5s ease;

  &:hover {
    background-color: #1db954;
    color: #fff;
    transition: background-color 0.5s ease;
  }
}

.spotify-black-background {
  background-color: #191414;
}

.aside {
  display: block;
  background-color: #f9f9f9;
  border-right: 1px solid #dedede;
}
.messages {
  display: block;
  background-color: #fff;
  border-right: 1px solid #dedede;
  padding: 40px 20px;
}
.message {
  display: block;
  background-color: #fff;
  padding: 40px 20px;
}
.aside .playlist {
  height: 95px;
  margin: 0 -10px;
  padding: 20px 30px;
}
.aside .playlist .button {
  color: #f6f7f7;
}
.aside .playlist .button .playlist {
  font-size: 14px;
  font-weight: 700;
}

.aside .title {
  color: #6f7b7e;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}
.aside .main .item {
  display: block;
  padding: 5px 0;
  color: #6f7b7e;
}
.aside .main .item.active {
  background-color: #f1f1f1;
  margin: 0 -20px;
  padding-left: 50px;
}
.aside .main .item:active,
.aside .main .item:hover {
  color: #191414;
}
</style>