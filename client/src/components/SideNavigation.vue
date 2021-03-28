<template>
  <aside class="column is-2 aside" v-if="auth">
    <div class="container">
      <header>
        <input
          class="input"
          type="text"
          placeholder="New playlist name"
          v-model="newPlaylist"
          @keyup.enter="createPlaylist()"
        />
        <a
          class="button spotify-green-background is-block is-bold"
          @click.prevent="createPlaylist()"
        >
          <span class="playlist">Create Playlist</span>
        </a>
      </header>
      <footer>
        <div class="title">Artist Playlists</div>
        <nav>
          <a
            class="item"
            @click.prevent="setPlaylist(playlist._id)"
            v-for="playlist in playlists"
            :key="playlist._id"
          >
            {{ playlist.display_name }}
          </a>
        </nav>
      </footer>
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
      this.$store.dispatch("getArtistPlaylist", playlist);
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
aside {
  background: #212121;
  border-right: 1px solid #212121;
  height: auto;
  padding-top: 1rem;
  margin-top: 0;
  .container {
    display: flex;
    flex-direction: column;

    header {
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-self: center;
      input[type="text"] {
        border-radius: 25px;
      }
      .button {
        margin-top: 0.5rem;
        background: #1db954;
        border: 0;
        width: 150px;
        align-self: center;
      }
    }

    footer {
      margin-top: auto;
      flex-grow: 1;
      &::after {
        content: "";
        margin-top: auto;
        content: "";
        flex: auto;
      }
      .title {
        margin-left: 1rem;
        color: #efefef;
      }
      nav {
        display: flex;
        flex-direction: column;
        align-content: center;
        padding-left: 1em;
        a {
          color: #efefef;
          &:hover {
            color: #1db954;
          }
        }
      }
    }
  }
}
</style>