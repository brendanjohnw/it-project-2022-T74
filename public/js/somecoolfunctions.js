function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML = h + ":" + m;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function randomMessage() {
    msg_list = ["Keep on reading! 📚", "Have a lovely day ☀️", "Isn't it a great day for a reading sesh?", "Stressed out? Pick up your favourite book!"]
    document.getElementById("random-msg").innerHTML =  msg_list[Math.floor(Math.random() * msg_list.length)] ;
}