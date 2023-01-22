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

const updateCurrentConfig = (configID) => {
    axios.post("/set/active/config", {
        configID: configID,
    }).then((res) => {
        console.log(res.data)
    }).catch((err) => {
        console.error(err.response.data)
    })
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
                        <td>Active</td>
                        <td>Config Name</td>
                        <td>Server Name</td>
                        <td>Mission Name</td>
                    </tr>            
                </thead>
                <tbody>
                    <tr v-for="preset in presets">
                        <td>
                            <input :checked="preset.active" @change="updateCurrentConfig(preset.configID)" type="radio" name="config" selected>
                        </td>
                        <td>{{ preset.configName }}</td>
                        <td>{{ preset.hostname }}</td>
                        <td>{{ preset.PBOname }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <!-- <label for="test">ttest</label>
    <input type="radio" name="test" id="test" checked> -->
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