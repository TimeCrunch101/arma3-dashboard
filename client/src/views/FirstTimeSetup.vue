<script setup>
import { ref } from 'vue';
import axios from "axios";
import {useRouter} from 'vue-router'
const router = useRouter()

const form = ref({
    STEAM_USERNAME: null,
    STEAM_PASS: null,
    STEAM_CMD_LOC: null,
    ARMA_SERVER_LOC: null,
})

const submitForm = () => {
    axios.post("/server/settings", {
        STEAM_USERNAME: form.value.STEAM_USERNAME,
        STEAM_PASS: form.value.STEAM_PASS,
        STEAM_CMD_LOC: form.value.STEAM_CMD_LOC,
        ARMA_SERVER_LOC: form.value.ARMA_SERVER_LOC,
    }).then((res) => {
        if (res.data.message === 'Settings Saved') {
            router.push('/')
        }
    }).catch((err) => {
        console.error(err.response.data)
    })
}

</script>

<template>
<form @submit.prevent="submitForm()" class="form-wrapper">
    <div class="input-wrapper">
        <label for="STEAM_USERNAME">Steam Username</label>
        <input type="text" name="STEAM_USERNAME" id="STEAM_USERNAME" v-model="form.STEAM_USERNAME">
    </div>
    <div class="input-wrapper">
        <label for="STEAM_PASS">Steam Password</label>
        <input type="password" name="STEAM_PASS" id="STEAM_PASS" v-model="form.STEAM_PASS">
    </div>
    <div class="input-wrapper">
        <label for="STEAM_CMD_LOC">Steam CMD install Location</label>
        <input type="text" name="STEAM_CMD_LOC" id="STEAM_CMD_LOC" v-model="form.STEAM_CMD_LOC">
    </div>
    <div class="input-wrapper">
        <label for="SERVER_CONFIG">Arma3 Server Install Location</label>
        <input type="text" name="SERVER_CONFIG" id="SERVER_CONFIG" v-model="form.ARMA_SERVER_LOC">
    </div>
    <button type="submit">Save</button>
</form>
<p>Dev Note: Just enter dummy data to get past this point</p>
</template>

<style scoped>
.form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: 40%;
}
.input-wrapper {
    display: flex;
    flex-direction: column;

}
</style>