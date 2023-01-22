<script setup>
import axios from "axios"
import { ref } from "vue"

const file = ref(null)

const handleFileUpload = ( e ) => {
    file.value = e.target.files[0];
}

const uploadFile = () => {
    const formData = new FormData();
    formData.append("file", file.value);
    axios.post('/upload/mission', formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        console.info(res.data)
    }).catch((err) => {
        console.error(err.response.data)
    })
    file.value = null
}

</script>

<template>
    <input ref="file" v-on:change="handleFileUpload($event)"  type="file">
    <button @click="uploadFile()">Send</button>
</template>

<style scoped>

</style>