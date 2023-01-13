<script setup>
import { ref } from 'vue';
import axios from "axios";
import {useRouter} from 'vue-router'
const router = useRouter()

const form = ref({
    STEAM_USERNAME: null,
    STEAM_PASS: null,
    STEAM_CMD_LOC: null,
    SERVER_CONFIG: null,
    SOCKET_ORIGIN: null,
    KEY_FILE: null,
    CERT_FILE: null,
    SERVER: null,
    ARMA_LOC: null,
    MOD_LOC: null,
    MP_MISSIONS: null,
})

const submitForm = () => {
    axios.post("/server/settings", {
        STEAM_USERNAME: form.value.STEAM_USERNAME,
        STEAM_PASS: form.value.STEAM_PASS,
        STEAM_CMD_LOC: form.value.STEAM_CMD_LOC,
        SERVER_CONFIG: form.value.SERVER_CONFIG,
        SOCKET_ORIGIN: form.value.SOCKET_ORIGIN,
        KEY_FILE: form.value.KEY_FILE,
        CERT_FILE: form.value.CERT_FILE,
        SERVER: form.value.SERVER,
        ARMA_LOC: form.value.ARMA_LOC,
        MOD_LOC: form.value.MOD_LOC,
        MP_MISSIONS: form.value.MP_MISSIONS
    }).then((res) => {
        if (res.data.status === 200) {
            router.push('/')
        }
    }).catch((err) => {
        console.log(err)
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
        <label for="SERVER_CONFIG">Server Config Full Path</label>
        <input type="text" name="SERVER_CONFIG" id="SERVER_CONFIG" v-model="form.SERVER_CONFIG">
    </div>
    <div class="input-wrapper">
        <label for="SOCKET_ORIGIN">URL of the web server - the /path</label>
        <input type="text" name="SOCKET_ORIGIN" id="SOCKET_ORIGIN" v-model="form.SOCKET_ORIGIN">
    </div>
    <div class="input-wrapper">
        <label for="KEY_FILE">Key File Location</label>
        <input type="text" name="KEY_FILE" id="KEY_FILE" v-model="form.KEY_FILE">
    </div>
    <div class="input-wrapper">
        <label for="CERT_FILE">Cert File Location</label>
        <input type="text" name="CERT_FILE" id="CERT_FILE" v-model="form.CERT_FILE">
    </div>
    <div class="input-wrapper">
        <label for="SERVER">IP Address of the server</label>
        <input type="text" name="SERVER" id="SERVER" v-model="form.SERVER">
    </div>
    <div class="input-wrapper">
        <label for="ARMA_LOC">Arma Install Location</label>
        <input type="text" name="ARMA_LOC" id="ARMA_LOC" v-model="form.ARMA_LOC">
    </div>
    <div class="input-wrapper">
        <label for="MOD_LOC">Mod Install Location</label>
        <input type="text" name="MOD_LOC" id="MOD_LOC" v-model="form.MOD_LOC">
    </div>
    <div class="input-wrapper">
        <label for="MP_MISSIONS">MP Missions folder path</label>
        <input type="text" name="MP_MISSIONS" id="MP_MISSIONS" v-model="form.MP_MISSIONS">
    </div>
    <button type="submit">Save</button>
</form>
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