<template>
  <div>
    {{ playlist }}
  </div>
</template>

<script>
export default {
  data() {},
  mounted() {
    this.$store.dispatch("getArtistPlaylist", this.$route.params.id);
  },
  computed: {
    playlist() {
      return this.$store.getters.artistPlaylist;
    },
  },
  methods: {},
};
</script>

<style>
</style>