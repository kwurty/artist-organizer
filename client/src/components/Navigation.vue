<template>
<nav class="navbar is-white">
    <div class="container">
        <div class="navbar-brand">
            <router-link calss="navbar-item brand-text" to="/">ADMIN</router-link>
            <div class="navbar-burger burger" data-target="navMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="navbar-start">
            <router-link to="/artists" class="navbar-item">View Artistlists</router-link>
            <router-link to="/playlists" class="navbar-item">View Playlists</router-link>
            <router-link to="/search" class="navbar-item">Search For Artists</router-link>
        </div>
    </div>
</nav>

</template>

<script>
export default {
    computed: {
        auth () {
            return this.$store.getters.isAuthenticated
        },
        user() {
            return this.$store.state.user
        }
    },
    created() {
        this.$store.dispatch('tryAutoLogin')
    }
}
</script>

<style>

</style>