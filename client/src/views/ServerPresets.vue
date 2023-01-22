<script setup>
import ConfigForm from "../components/ConfigForm.vue"
import axios from "axios"
import { ref } from "vue";

const presets = ref([])

const showForm = ref(false)

axios.get('/config/presets').then((res) => {
    presets.value = res.data.presets
}).catch((err) => {
    console.error(err)
})

const enableForm = () => {
    if (showForm.value === true) {
        showForm.value = false
    } else {
        showForm.value = true
    }
}

</script>

<template>
    <button @click="enableForm()">Toggle Form</button>
    <div class="container">
        <div v-if="showForm" class="container-item">
            <ConfigForm/>
        </div>
        <div class="container-item">
            <table v-if="presets.length !== 0">
                <thead>
                    <tr>
                        <td>Config ID</td>
                        <td>Config Name</td>
                        <td>Server Name</td>
                        <td>Mission Name</td>
                    </tr>            
                </thead>
                <tbody>
                    <tr v-for="preset in presets">
                        <td>{{ preset.configID }}</td>
                        <td>{{ preset.configName }}</td>
                        <td>{{ preset.hostname }}</td>
                        <td>{{ preset.PBOname }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.container-item {
    min-width: fit-content;
}
.container {
    display: flex;
    flex-direction: row;
}

</style>