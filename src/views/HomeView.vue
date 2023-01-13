<script setup>
import ConfigForm from "../components/ConfigForm.vue"
import ModDLForm from "../components/ModDLForm.vue"
import ModsTable from "../components/ModsTable.vue"
import FileUpload from "../components/FileUpload.vue"

import "../assets/script"
import axios from "axios"

const startServer = () => {
  axios.get('/start')
}
const stopServer = () => {
  axios.get('/stopserver')
}

</script>

<template>
  
  <h1>Arma 3 Server Dashboard</h1>
  <button @click="startServer()">Start Server</button>
  <button @click="stopServer()">Stop Server</button>
  <!-- 
    The class of the server_status DIV will be dynamically
    updated by the server depending on the state of the arma3server.exe
    process.
  -->
  <div id="server_status" class="red"></div> 

  <br />
  <ModDLForm/>
  <br />
  <ConfigForm/>
  <br />
  <ModsTable/>
  <br />
  <FileUpload/>
</template>

<style scoped>

#server_status {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid gray;
}

.green {
  background-color: green;
}
.red {
  background-color: red;
}

</style>