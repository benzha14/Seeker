let resetButton = document.getElementById("reset-pw")
let username = document.getElementById("username")
let password = document.getElementById("password")
let confirmPassword = document.getElementById("confirm_password")
let securityQuestion1 = document.getElementById('security-question1')
let securityQuestion2 = document.getElementById('security-question2')
let message = document.getElementById('message')

function resetPassword(event) {
    message.style.display = 'block'
    event.preventDefault()
    if (username.value.trim() == '') {
        message.style.display = 'block'
        message.innerText = 'Username' + (password.value.trim() == '' ? ' and password ' : ' ') + 'cannot be empty.'
    } else if (password.value.trim() == '') {
        message.style.display = 'block'
        message.innerText = 'Password cannot be empty.'
    } else if (securityQuestion1.value.trim() == '' || securityQuestion2.value.trim() == '') {
        message.style.display = 'block'
        message.innerText = 'You must answer both security questions.'
    } else if (password.value === confirmPassword.value) {
        let xhr = new XMLHttpRequest
        xhr.addEventListener("load", responseHandler)
        query=`username=${username.value}&password=${password.value}&securityQuestion1=${securityQuestion1.value}&securityQuestion2=${securityQuestion2.value}`  
        url = `/attempt_recover_pw`
        xhr.responseType = 'json'
        xhr.open('POST', url)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(query)  
    } else message.innerHTML = 'Passwords don\'t match'
}

function responseHandler() {
    message.style.display = "block"
    if (this.response.success) message.innerText = this.response.message
    else message.innerText = this.response.message
}

resetButton.addEventListener("click", resetPassword)
