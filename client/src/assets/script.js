import {io} from 'socket.io-client'
if (process.env.NODE_ENV !== 'production') {
    const socket = io("http://localhost:8081/")
} else {
    const socket = io("http://192.168.60.103:8081/")
}

export default socket;