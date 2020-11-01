<template>
  <nav>
      
  </nav>
</template>

<script>
export default {
    computed: {
        auth () {
            return this.$store.getters.isAuthenticated
        }
    },
    created() {
        this.$store.dispatch('tryAutoLogin')
    }
}
</script>

<style>

</style>