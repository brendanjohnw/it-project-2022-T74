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
    msg_list = ["Keep on reading! ๐",
        "Have a lovely day โ๏ธ",
        "Isn't it a great day for a reading sesh?",
        "Stressed out? Pick up your favourite book!",
        "Reading is a novel idea.๐",
        "I started reading a book about mazesโI got lost in it.๐ฉ",
        "Do you comma here often?"]
    document.getElementById("random-msg").innerHTML = msg_list[Math.floor(Math.random() * msg_list.length)];
}