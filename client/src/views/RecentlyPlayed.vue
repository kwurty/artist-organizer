<template>
  <main v-if="recently_played != null">
    <div class="line hc">
      <div class="songname header">Title</div>
      <div class="artists header">Artists</div>
      <div class="album header">Album</div>
      <div class="duration header">Duration</div>
    </div>
    <div
      class="line"
      v-for="(item, index) in recently_played.items"
      :key="item"
      :id="index"
    >
      <div class="songname">{{ item.track.name }}</div>
      <div class="artists">
        <div
          class="artist"
          v-for="(artist, index) in item.track.artists"
          :key="index"
        >
          <a @click.prevent="openArtist(artist.id)">{{ artist.name }} </a>
        </div>
      </div>
      <div class="album">
        {{ item.track.album.name }}
      </div>
      <div class="duration">
        {{ convert_to_minutes(item.track.duration_ms) }}
      </div>
    </div>
  </main>
</template>

<script>
export default {
  computed: {
    recently_played() {
      return this.$store.state.recently_played;
    },
  },
  methods: {
    convert_to_minutes(ms) {
      let minutes = Math.floor(ms / 60000);
      let seconds = ((ms % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    openArtist(artistId) {
      this.$store.dispatch("getArtist", artistId);
      this.$router.push("/artist");
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  .hc {
    margin-bottom: 15px;
    padding-bottom: 15px;
  }
  .line {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;

    @media screen and (max-width: 1024px) {
      height: 50px;
    }

    .header {
      font-size: 1.5em;
    }

    .songname {
      width: 500px;
      @media screen and (max-width: 1024px) {
        width: 250px;
      }
    }
    .artists {
      flex-basis: 30%;
      display: flex;
      flex-direction: row;
      .artist {
        a {
          color: #fff;
          &:hover {
            color: #1db954;
          }
        }
        &:not(:first-child) {
          &::before {
            content: " , ";
          }
        }
      }
    }
    .album {
      flex-basis: 30%;
    }
    .date {
    }
    .time {
      flex-basis: 10%;
    }
  }

  .sticky {
    position: sticky;
  }
}
</style>