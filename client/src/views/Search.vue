// Should probably be split into components

<template>
  <div v-if="searchResults != undefined || searchResults != null">
    <h1 class="title">Artists</h1>
    <ul>
      <li v-for="artist in searchResults.artists" :key="artist.id">
        {{ artist.name }}
      </li>
    </ul>
    <h1 class="title">Albums</h1>
    <ul>
      <li v-for="album in searchResults.albums" :key="album.id">
        {{ album.name }}
      </li>
    </ul>
    <h1 class="title">Tracks</h1>
    <ul>
      <li v-for="track in searchResults.tracks" :key="track.id">
        {{ track.name }}
      </li>
    </ul>
  </div>
  <div v-else>No search results found!</div>
</template>

<script>
export default {
  computed: {
    searchResults() {
      return this.$store.getters.getSearchResultItems;
    },
  },
};
</script>

<style>
</style>