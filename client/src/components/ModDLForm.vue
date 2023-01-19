<script setup>
import {ref} from "vue"
import axios from "axios"

const form = ref([])

const addInput = () => {
    form.value.push({value: ''})
}

const submitFormList = () => {
    axios.post("/download/mods", {
        userMods: form.value
    }).catch((error) => {
        console.error(error)
    })
}

</script>

<template>
    <form @submit.prevent="submitFormList()">
        <button @click="addInput()" type="button">Add Mod Input</button>
        <div id="mod_input">
            <div v-for="(item, index) in form">
                <input type="text" name="mods" v-model="item.value" :key="index">
            </div>
        </div>
        <button type="submit">Submit</button>
    </form>
</template>

<style scoped>
#mod_input {
    width: 100px;
    display: flex;
    flex-direction: column;
}
</style>