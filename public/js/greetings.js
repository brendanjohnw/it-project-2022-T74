var date = new Date();
var time = date.getHours();
if (time >= 18) {
    document.getElementById("welcome_msg").innerHTML = '🌇 Good Evening!';
} else if (time >= 12) {
    document.getElementById("welcome_msg").innerHTML = '☀️ Good Afternoon!';
} else if (time >= 0) {
    document.getElementById("welcome_msg").innerHTML = '🌅 Good Morning!';
} else {
    document.getElementById("welcome_msg").innerHTML = 'Something Went Wrong.';
}