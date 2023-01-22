<script setup>
import ModDLForm from "../components/ModDLForm.vue"
import ModsTable from "../components/ModsTable.vue"
import "../assets/script"
import axios from "axios"
import socket from "../assets/script"

socket.on('server-status', (data) => {
    const statusDiv = document.getElementById("server_status")
    if (statusDiv) {
      if (data.message === "Server Not Running") {
          if (statusDiv.classList.value === 'green') statusDiv.classList.remove('green')
          statusDiv.classList.add("red")
      } else if (data.message === "arma3server Running..") {
          if (statusDiv.classList.value === 'red') statusDiv.classList.remove('red')
          statusDiv.classList.add("green")
      }
    }
})

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
    This div gets it's class updated dynamically by the server.
   -->
  <div id="server_status"></div> 

  <br />
  <ModDLForm/>
  <br />
  <ModsTable/>
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