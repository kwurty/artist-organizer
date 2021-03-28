<template>
  <main v-if="playlist !== null">
    <header>
      <h1 class="is-size-5">{{ playlist.display_name }}</h1>
    </header>
    <div class="artists">
      <div
        v-for="(pl, index) in playlist.artists"
        :key="index"
        class="artist"
        @click.prevent="openArtist(pl.artistid)"
      >
        <div class="img-container has-text-centered">
          <img :src="pl.artistimage" />
        </div>
        <h1 class="is-size-6 has-text-left">
          {{ pl.artistname }}
          <br />
          <span class="subtext">Artist</span>
        </h1>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {},
  mounted() {},
  computed: {
    playlist() {
      return this.$store.getters.artistPlaylist;
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
main {
  background-color: #292b2d;
  padding: 0 32px;
  header {
    h1 {
      font-size: 2rem;
      color: #fff;
    }
  }

  .artists {
    display: grid;
    direction: ltr;
    column-gap: 24px;
    row-gap: 24px;
    --minimumColumnWidth: 180px;
    grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
    font-family: "Montserrat", sans-serif;

    .artist {
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
  }
}
</style>