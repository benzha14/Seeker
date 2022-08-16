let saved_deals = [];
let saveURL = document.getElementById("shortenURL");

function urlShortener(userURL) {
    let result;
    let query = "url=" + userURL;
    let url = "/shortenURL";
    let xhr = new XMLHttpRequest(); //listing for a request; template for letter 
    xhr.responseType = 'json'; // type of request we're requesting
    xhr.open("POST", url); // getting url  
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        var shortenerResponse = xhr.response;
        copyToClipboard(shortenerResponse["shortURL"]);
    }
    
    xhr.send(query)
    
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    dummy.style.display = 'none'
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    navigator.clipboard.writeText(dummy.value);
    document.body.removeChild(dummy);
}

function sleep (millisec) { 
    return new Promise(resolve=> {
        setTimeout(resolve, millisec);
    }) 
}

function get_saved_deals() {

    let xhr = new XMLHttpRequest;
    url = `/get_saved_deals`
    xhr.responseType = "json"
    xhr.open("GET", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    
    xhr.onload = function() {
        var dealsResponse = xhr.response;
        dealsResponse.saved_deals.forEach(deal_info => {
            saved_deals.push(deal_info);
        });

        saved_deals.forEach(deal => {
            render_saved_deals(deal);
        })
    }

    xhr.send()

} 

function render_saved_deals(deal_info) {
    sleep(500);
    let cardDetails ='<div class="card custom-card" style="width: 18rem;">' +
    '<img src="'+ deal_info.banner_link +'" class="card-img-top custom-card-image">' + 
    '<div class="card-body custom-card-body">'+
    '<h5 class="card-title">' + deal_info.game_name + '</h5>'+
    '<a target="_blank" class="btn btn-primary custom-btn1" href="' + deal_info.deal_link +'">Deal Link</a>' +
    '<p class="card-text"><p>' + deal_info.retail_price + '</p><p>' + deal_info.price + '</p></p>' +
    '<a href="#" class="btn btn-primary custom-btn2" id="shortenURL" onclick="urlShortener(\''+ deal_info.deal_link + '\')">Copy Link</a>' +
    '<a href="#" class="btn btn-primary custom-btn2" onclick="delete_saved_deal(this.parentElement)">Delete Deal</a>'+
    '<p style="display: none;">'+ deal_info.id +'</p>'+
    '</div>' +
    '</div>';
    document.querySelector(".results").innerHTML += cardDetails;
}

function sleep (millisec) { 
    return new Promise(resolve=> {
        setTimeout(resolve, millisec);
    }) 
}

function delete_saved_deal(deal_info) {

    let xhr = new XMLHttpRequest;
    url = `/delete_saved_deal`
    const query = `id=${deal_info.children[8].innerText}`
    xhr.responseType = "json"
    xhr.open("DELETE", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    
    xhr.onload = function() {
        var deleteResponse = xhr.response;
        if (deleteResponse.success) {
            deal_info.parentElement.remove();
        }
    }

    xhr.send(query)

} 



window.onload = get_saved_deals();

    