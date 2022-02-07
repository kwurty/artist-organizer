<template>
  <div class="notification-container">
    <transition name="fade">
      <div
        class="notification is-success"
        :class="{
          'is-visible': successful,
          'is-hidden': !successful || successful == null,
        }"
      >
        <button class="delete" @click="toggleNotification()"></button>
        Artist added successfully!
      </div>
    </transition>
    <transition name="fade">
      <div
        class="notification is-danger"
        :class="{
          'is-visible': !successful,
          'is-hidden': successful || successful == null,
        }"
      >
        <button class="delete" @click="toggleNotification()"></button>
        Error adding artist! Please try again.
      </div>
    </transition>
    <header v-if="artist != null">
      <h1 class="title">{{ artist.name }}</h1>
      <div class="dropdown is-hoverable" :class="{ 'is-active': isActive }">
        <div class="dropdown-trigger is-center">
          <button
            class="button"
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
      <img v-if="artist.images.length > 0" :src="artist.images[0].url" />
      <img v-else src="../assets/no-image.png" class="is-centered" />
    </header>
    <main v-if="artistInfo != null">
      <h1 class="is-size-5">Artist's Albums</h1>
      <div class="cards">
        <div
          class="album"
          v-for="(album, index) in artistInfo.albums.items"
          :key="index"
        >
          <div class="img-container has-text-centered">
            <img :src="album.images[0].url" v-if="album.images[0]" />
          </div>
          <h1 class="is-size-6 has-text-left album-name">
            {{ album.name }}
          </h1>
        </div>
      </div>
      <h1 class="is-size-5">Similar Artists</h1>
      <div class="cards">
        <div
          class="similar-artist"
          v-for="(artist, index) in artistInfo.relatedArtists.artists"
          :key="index"
        >
          <div class="img-container has-text-centered">
            <img v-if="artist.images" :src="artist.images[0].url" />
          </div>
          <h1 class="is-size-6 has-text-left artist-name">
            <a @click.prevent="openArtist(artist.id)">
              {{ artist.name }}
            </a>
          </h1>
        </div>
      </div>
    </main>

    <footer></footer>
  </div>
</template>

<script>
// import Axios from "axios";
export default {
  data() {
    return {
      isActive: false,
      successful: null,
    };
  },
  mounted() {},
  computed: {
    artist() {
      return this.$store.state.artist;
    },
    artistInfo() {
      return this.$store.state.artistInfo;
    },
    playlists() {
      return this.$store.state.artistPlaylists;
    },
  },
  methods: {
    async addToPlaylist(playlist) {
      console.log(this.$store.getters.JWT);

      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      let urlencoded = new URLSearchParams();
      urlencoded.append("artistName", this.artist.name);
      urlencoded.append("artistId", this.artist.id);
      urlencoded.append("playlistId", playlist._id);
      urlencoded.append("artistUrl", this.artist.href);
      urlencoded.append(
        "artistImage",
        this.artist.images[0].url || "../assets/no-image.png"
      );
      urlencoded.append("token", this.$store.getters.JWT);

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      fetch(
        "https://artistplaylists.herokuapp.com/artist/playlist/add",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    },
    openArtist(artistId) {
      this.$store.dispatch("getArtist", artistId);
      this.$router.push("/artist");
    },
    toggleActive() {},
    toggleNotification() {
      this.successful = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.notification-container {
  position: relative;
  .is-visible {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
.title {
  color: #fff;
  padding-top: 26px;
  padding-left: 12px;
}

.dropdown-trigger {
  padding-left: 12px;
  .button {
    background: #1db954;
    border: 0;
    font-weight: 400;
  }
}

header {
  img {
    display: block;
    margin: auto;
  }
}

main {
  h1 {
    color: #fff;
    padding-bottom: 12px;
  }
  .cards {
    padding-bottom: 24px;
    display: grid;
    direction: ltr;
    column-gap: 24px;
    row-gap: 24px;
    --minimumColumnWidth: 180px;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    font-family: "Montserrat", sans-serif;

    .album {
      width: 182px;
      height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      background: #181818;
      color: #fff;
      padding: 16px;
      transition: background-color 0.3s ease;
      .album-name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
        margin-top: auto;
      }
      .img-container {
        top: 0;
        width: 100%;
        img {
          display: block;
          margin: auto;
          width: 150px;
          height: 150px;
          object-fit: cover;
          object-position: center center;
        }
      }
    }

    .similar-artist {
      width: 182px;
      height: 250px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      background: #181818;
      color: #fff;
      // padding: 16px;
      transition: background-color 0.3s ease;
      .artist-name {
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: auto;
        padding-left: 8px;

        a {
          color: #fff;

          &:hover {
            color: #1db954;
          }
        }
      }
      .img-container {
        top: 0;
        width: 100%;
        padding: 16px;
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
    }
  }
}
</style>