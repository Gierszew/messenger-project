const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const router = require("./routes");

const PORT = process.env.PORT || 3000;

const app = express();
const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})
const io = socketIo(server, {
    cors: {origin: "*"}
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

io.on("connection", (socket) => {
    console.log("Nowe połączenie: ", socket.id);

    socket.on("chat message",(msg) => {
        console.log(`${socket.id} napisał: ${msg}`);
        io.emit("chat message", msg);
    })

    socket.on("disconnect", () => {
        console.log("Użytkownik rozłączony: " + socket.id);
    });
    
    socket.on("disconnectAfterDelay", () => {
        setTimeout(() => {
            console.log(`Rozłączam połączenie: ${socket.id}`);
            socket.disconnect();  // Rozłącza połączenie
        }, 5000);  // Po 5 sekundach
    });

});