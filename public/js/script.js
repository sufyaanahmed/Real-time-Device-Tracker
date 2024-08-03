const socket = io();
console.log("hey");

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    }
    );
}


const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Sufyaan"
}).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
    const {latitude, longitude, id} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});
socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});