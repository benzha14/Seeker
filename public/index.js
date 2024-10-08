let loginButton = document.getElementById("login")
let username = document.getElementById("username")
let password = document.getElementById("password")
let message = document.getElementById("message")

function login(event) {
    event.preventDefault()
    let xhr = new XMLHttpRequest
    xhr.addEventListener("load", responseHandler)
    query=`username=${username.value}&password=${password.value}`
    // when submitting a GET request, the query string is appended to URL
    // but in a POST request, do not attach the query string to the url
    // instead pass it as a parameter in xhr.send()
    url = `/attempt_login`
    xhr.responseType = "json";   
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    // notice the query string is passed as a parameter in xhr.send()
    // this is to prevent the data from being easily sniffed
    
    //test login button 
    xhr.onload = function() {
        var loginResponse = xhr.response;
        if(loginResponse.success) {
            window.location.replace("/main.html");
        } 
    }
    
    xhr.send(query)

}

function responseHandler() {
    message.style.display = "block"
    if (this.response.success) message.innerText = this.response.message
    else message.innerText = this.response.message
}

loginButton.addEventListener("click", login)
