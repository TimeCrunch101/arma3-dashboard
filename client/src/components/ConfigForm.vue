<script setup>
import axios from 'axios';
import {ref} from 'vue'
const form = ref({
    configPreset: null,
    hostname: null,
    adminPassword: null,
    maxPlayers: null,
    persistance: null,
    VON: null,
    PBOname: null,
    difficulty: null,
    battleye: null,
    verifySigs: null,
    shouldDefinePassword: null,
    userPassword: null
})

const updateConfig = () => {
    axios.post("/update/config", {
        configPreset: form.value.configPreset,
        hostname: form.value.hostname,
        adminPassword: form.value.adminPassword,
        maxPlayers: form.value.maxPlayers,
        persistance: form.value.persistance,
        VON: form.value.VON,
        PBOname: form.value.PBOname,
        difficulty: form.value.difficulty,
        battleye: form.value.battleye,
        verifySigs: form.value.verifySigs,
        shouldDefinePassword: form.value.shouldDefinePassword,
        userPassword: form.value.userPassword
    }).catch((error) => {
        console.error(error.response.data)
    })
}

const enableUserPass = () => {
    const blocked = document.getElementById("userPassword")
    if(document.getElementById("shouldDefinePassword").value === '1') {
        blocked.removeAttribute("disabled")
        blocked.classList.remove("not-allowed")
    }
    if(document.getElementById("shouldDefinePassword").value === '0') {
        blocked.disabled = true
        blocked.classList.add("not-allowed")
    }  
}

</script>

<template>
    <div>
        <form @submit.prevent="updateConfig()">
            <label for="configPreset">Config Preset Name</label>
            <input type="text" name="configPreset" id="configPreset" required v-model="form.configPreset">
    
            <label for="hostname">Server Name</label>
            <input type="text" name="hostname" id="hostname" required v-model="form.hostname">
    
            <label for="adminPassword">Admin Password</label>
            <input type="password" name="adminPassword" id="adminPassword" required v-model="form.adminPassword">
    
            <label for="maxPlayers">Max Players</label>
            <input type="number" name="maxPlayers" id="maxPlayers" min="1" max="40" required v-model="form.maxPlayers">
    
            <label for="persistance">persistance</label>
            <select name="persistance" id="persistance" required v-model="form.persistance">
                <option value="1">Enabled</option>
                <option value="0">Disable</option>
            </select>
    
            <label for="VON">Voice On Net</label>
            <select name="VON" id="VON" required v-model="form.VON">
                <option value="0">Enable</option>
                <option value="1">Disable</option>
            </select>
    
            <label for="PBOname">Mission File Name</label>
            <input type="text" name="PBOname" id="PBOname" required v-model="form.PBOname">
    
            <label for="difficulty">Difficulty</label>
            <select name="difficulty" id="difficulty" required v-model="form.difficulty">
                <option value="Recruit">Recruit</option>
                <option value="Regular">Regular</option>
                <option value="Veteran">Veteran</option>
                <option value="Custom">Custom</option>
            </select>
    
            <label for="battleye">Require BattlEye</label>
            <select name="battleye" id="battleye" required v-model="form.battleye">
                <option value="1">Enabled</option>
                <option value="0">Disable</option>
            </select>
    
            <label for="verifySigs">Verify Mod Signatures</label>
            <select name="verifySigs" id="verifySigs" required v-model="form.verifySigs">
                <option value="2">Enabled</option>
                <option value="0">Disable</option>
            </select>
    
            <label for="shouldDefinePassword">Enable Server Password?</label>
            <select @change="enableUserPass()" name="shouldDefinePassword" id="shouldDefinePassword" required v-model="form.shouldDefinePassword">
                <option value="0">No</option>
                <option value="1">Yes</option>
            </select>
    
            <label for="userPassword">Server Password</label>
            <input class="not-allowed" type="password" name="userPassword" id="userPassword" disabled v-model="form.userPassword">
    
            <button type="submit">Add Config Preset</button>
        </form>
    </div>
</template>

<style scoped>
form {
    border: 1px solid black;
    padding: 5px;
    display: flex;
    flex-direction: column;
}
.not-allowed:hover {
    cursor: not-allowed;
}
</style>