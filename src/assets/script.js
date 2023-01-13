// import {io} from 'socket.io-client'
// const socket = io("https://192.168.60.103:3443/")

// socket.on('mod-downloaded', (data) => {
//     console.log(data)
//     alert(data.message)
// })

// socket.on('server-status', (data) => {
//     const statusDiv = document.getElementById("server_status")
//     if (data.message === "Server Not Running") {
//         if (statusDiv.classList.value === 'green') statusDiv.classList.remove('green')
//         statusDiv.classList.add("red")
//     } else if (data.message === "arma3server Running..") {
//         if (statusDiv.classList.value === 'red') statusDiv.classList.remove('red')
//         statusDiv.classList.add("green")
//     } else {
//     }
//     console.log('connection not possible')
// })