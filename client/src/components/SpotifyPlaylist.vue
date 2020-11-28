<template>
     <div class="playlist">
         {{ spotify_playlist_tracks }}
     </div>
</template>

<script>
export default {
    props: {
        playlist: {
            type: Object,
            required: true
        }
    },
    computed: {
        spotify_playlist_tracks() {
            return this.$store.state.spotify_playlist_tracks;
        }
    }
}
</script>

<style lang="scss" scoped>


</style>