<script setup>


</script>

<template>
    <div>
        <router-link to="/">Home</router-link>
        <router-link to="/first-time-setup">First Time Setup</router-link>
        <router-link to="/server-presets">Server Presets</router-link>
        <router-link to="/server-missions">Server Missions</router-link>
    </div>
</template>

<style scoped>
/* router-link is converted to standard HTML 'a' tags after render */
a {
    margin-left: 1em;
}
</style>