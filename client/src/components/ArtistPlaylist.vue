<template>
  <div>
      {{playlist}}
      hello
  </div>
</template>

<script>
export default {
    data() {

    },
    computed: {
        playlist() {
            return this.$store.artistPlaylist;
        }
    },
    methods: {

    },
}
</script>

<style>

</style>