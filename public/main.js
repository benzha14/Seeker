let searchbtn = document.getElementById("search");
let deals = [];
let saveURL = document.getElementById("shortenURL");
 
function search(userQuery) {
    let url = "https://www.cheapshark.com/api/1.0/games?title=" + userQuery + "&limit=5&exact=0";
    let xhr = new XMLHttpRequest(); //listing for a request; template for letter 
    xhr.responseType = 'json'; // type of request we're requesting
    xhr.open("GET", url); // getting url  
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        var gamesResponse = xhr.response;

        if(gamesResponse.length != 0) {
            gamesResponse.forEach(game => {
                getDeals(game["gameID"], game["external"]);
            })
            getDeals(gamesResponse[0]["gameID"]);
        } else {
            console.log("No games found for" + userQuery);
        }

    }
    
    xhr.send() 
}

function getDeals(gameID, gameName) {

    let url = "https://www.cheapshark.com/api/1.0/games?id=" + gameID;
    let xhr = new XMLHttpRequest(); //listing for a request; template for letter 
    xhr.responseType = 'json'; // type of request we're requesting
    xhr.open("GET", url); // getting url  
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload = function() {
        var dealsResponse = xhr.response;
        dealsResponse["deals"].forEach(deal => {
            deal["gameName"] = gameName;
            deals.push(deal);
            
        });


    }
    
    xhr.send() 
    
} 

searchbtn.addEventListener("click", function() {
    const userQuery = document.getElementById("userInput").value;
    document.querySelector(".results").innerHTML = "";
    search(userQuery);
    
    sleep(500); //for timing

    deals.forEach (deal => {

        const imageNum = parseInt(deal.storeID) - 1;
        const dealLink = 'https://www.cheapshark.com/redirect?dealID=' + deal.dealID;
        const bannerLink = 'https://www.cheapshark.com/img/stores/logos/' + imageNum + '.png';

        let cardDetails ='<div class="card custom-card" style="width: 18rem;">' +
        '<img src="'+ bannerLink +'" class="card-img-top custom-card-image">' + 
        '<div class="card-body custom-card-body">'+
        '<h5 class="card-title">' + deal.gameName + '</h5>'+
        '<a target="_blank" class="btn btn-primary custom-btn1" href="' + dealLink +'">Deal Link</a>' +
        '<p class="card-text"><p> Retail Price: $' + deal.retailPrice + '</p><p>Discounted Price: $' + deal.price + '</p></p>' +
        '<a href="#" class="btn btn-primary custom-btn2" onclick="save_deal(this.parentElement)">Save to Profile</a>' +
        '<a href="#" class="btn btn-primary custom-btn2" id="shortenURL" onclick="urlShortener(\''+ dealLink + '\')">Copy Link</a>' +
        '<p style="display: none;">'+ deal.dealID + ' ' + bannerLink +'</p>'+
        '</div>' + 
        '</div>';
        document.querySelector(".results").innerHTML += cardDetails;
        
    })

    deals = [];
 
});

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

// saveURL.addEventListener("click", urlShortener(saveURL.value));

function save_deal(cardInfo) {
    const priceDiv = cardInfo.children[4];
    
    const dealInfo = {
        "deal_id": cardInfo.children[8].innerText.split(" ")[0],
        "price": cardInfo.children[4].innerText,
        "retail_price": cardInfo.children[3].innerText,
        "game_name": cardInfo.children[0].innerText,
        "deal_link": cardInfo.children[1].href,
        "banner_link": cardInfo.children[8].innerText.split(" ")[1],
    };

    let xhr = new XMLHttpRequest;
    query=`deal_id=${dealInfo.deal_id}&price=${dealInfo.price}&retail_price=${dealInfo.retail_price}&game_name=${dealInfo.game_name}&deal_link=${dealInfo.deal_link}&banner_link=${dealInfo.banner_link}`
    url = `/save_deal`
    xhr.responseType = "json"
    xhr.open("POST", url)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(query)


} 


    