<script setup>
import FileUpload from "../components/FileUpload.vue"
import axios from "axios";
import { ref } from "vue";

const missions = ref([])

axios.get('/server/missions').then((res) => {
    missions.value = res.data.missions
}).catch((err) => {
    console.log(err.response.data)
})

</script>

<template>
<FileUpload/>
<table>
    <thead>
        <tr>
            <td>Mission Name</td>
        </tr>
    </thead>
    <tbody>
        <tr v-for="mission in missions">
            <td>{{ mission.missionName }}</td>
        </tr>
    </tbody>
</table>
</template>

<style scoped>

</style>