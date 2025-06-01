// Use the WebSocket API via socket.io-client
const socket = io("ws://localhost:3001"); // Connect to the WebSocket server

const form = document.getElementById("form"); // Get the form element
const input = document.getElementById("input"); // Get the input element
const ul = document.querySelector("ul"); // Get the <ul> element to display messages
const p = document.querySelector("p"); // Get the <p> element to display activity messages

// Function to send message to the server
function sendMessage(e) {
    e.preventDefault(); // Prevent page reload on form submit
    const message = input.value.trim(); // Get and trim the input value
    if (message) {
        socket.emit("message", message); // Send message to the server via WebSocket
        input.value = ""; // Clear the input after sending
    } else {
        alert("Please enter a message"); // Alert if input is empty
    }
}

input.addEventListener("keypress", () => {
    // activity event
    socket.emit("activity", socket.id.substr(0, 5) + " is typing..."); // Emit activity event to the server
}); // Listen for keypress in the input field

// Listen for form submission
form.addEventListener("submit", sendMessage);

// Listen for incoming messages from the server
socket.on("message", (event) => {
    console.log("Message from server received:", event); // Log message
    const li = document.createElement("li"); // Create a new list item
    li.textContent = event; // Set message as text content
    ul.appendChild(li); // Append message to the list
    p.textContent = ""; // Clear activity message
});

let typingTimeout; // Variable to store timeout ID

// Listen for activity messages from the server
socket.on("activity", (event) => {
    console.log("Activity from server received:", event); // Log activity
    p.textContent = `${event} is typing...`; // Set activity message as text content

    // Clear after 3 seconds
    clearTimeout(typingTimeout); // Clear previous timeout to avoid overlaps
    typingTimeout = setTimeout(() => {
        p.textContent = ""; // Clear activity message after 3 seconds
    }, 3000); // Set timeout for 3 seconds
});
