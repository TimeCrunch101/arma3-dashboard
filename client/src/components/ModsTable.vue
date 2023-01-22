<script setup>
import axios from 'axios'
import {ref} from 'vue'

const mods = ref([])

const form = ref([])

const getData = () => {
    mods.value = []
    axios.get('/get/mods').then((res) => {
        mods.value = res.data.mods
    }).catch((err) => {
        console.error(err)
    })
}

const selectMods = () => {
    const inputs = document.querySelectorAll(".mod_checkbox")
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        form.value.push({modID: input.id, enabled: input.checked, serverOnly: 0})
    }
    const serverOnlySelect = document.querySelectorAll(".mod_serveronly")
    for (let i = 0; i < serverOnlySelect.length; i++) {
        const select = serverOnlySelect[i];
        const modID = (select.getAttribute('modid'))        
        for (let index = 0; index < form.value.length; index++) {
            const formE = form.value[index];
            if (formE.modID === modID) {
                formE.serverOnly = select.value
            }
        }
    }
    axios.post("/select/mods", {
        mods: form.value
    }).catch((err) => {
        console.error(err)
    })
    form.value = []
    setTimeout(() => {
        getData()
    }, 1000);
}
getData()
</script>

<template>
<form v-if="mods.length !== 0" @submit.prevent="selectMods()">
    <table>
        <thead>
            <tr>
                <td>Mod ID</td>
                <td>Mod Name</td>
                <td>Include</td>
                <td>Sever Only</td>
            </tr>
        </thead>
        <tbody>
            <tr v-if="mods.length !== 0" v-for="mod in mods">
                <td :class="{enabled: mod.enabled}">{{ mod.modID }}</td>
                <td :class="{enabled: mod.enabled}">{{ mod.modName }}</td>
                <td>
                    <input :checked="mod.enabled" class="mod_checkbox" type="checkbox" :id="mod.modID" name="mods">
                </td>
                <td>
                    <label for="so">Server Only</label>
                    <select name="serverOnly" class="mod_serveronly" :modID='mod.modID'>
                        <option value="1" :selected="mod.server_only === 1">Yes</option>
                        <option value="0" :selected="mod.server_only === 0 || mod.server_only === null">No</option>
                    </select>
                </td>
            </tr>
        </tbody>
    </table>
    <button type="submit">Save</button>
</form>
</template>

<style scoped>
td {
    border: 1px solid black;
}
.enabled {
    background-color: lightgreen;
}
</style>