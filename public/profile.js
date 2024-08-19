let saved_deals = [];
let saveURL = document.getElementById("shortenURL");

function urlShortener(userURL) {
  let result;
  let query = "url=" + userURL;
  let url = "/shortenURL";
  let xhr = new XMLHttpRequest(); //listing for a request; template for letter
  xhr.responseType = "json"; // type of request we're requesting
  xhr.open("POST", url); // getting url
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    var shortenerResponse = xhr.response;
    copyToClipboard(shortenerResponse["shortURL"]);
  };

  xhr.send(query);
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  dummy.style.display = "none";
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  navigator.clipboard.writeText(dummy.value);
  document.body.removeChild(dummy);
}

function sleep(millisec) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisec);
  });
}

function get_saved_deals() {
  let xhr = new XMLHttpRequest();
  url = `/get_saved_deals`;
  xhr.responseType = "json";
  xhr.open("GET", url);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    var dealsResponse = xhr.response;
    dealsResponse.saved_deals.forEach((deal_info) => {
      saved_deals.push(deal_info);
    });

    saved_deals.forEach((deal) => {
      render_saved_deals(deal);
    });
  };

  xhr.send();
}

// function render_saved_deals(deal_info) {
//     sleep(500);
//     let cardDetails ='<div class="card custom-card" style="width: 18rem;">' +
//     '<img src="'+ deal_info.banner_link +'" class="card-img-top custom-card-image">' +
//     '<div class="card-body custom-card-body">'+
//     '<h5 class="card-title">' + deal_info.game_name + '</h5>'+
//     '<a target="_blank" class="btn btn-primary custom-btn1" href="' + deal_info.deal_link +'">Deal Link</a>' +
//     '<p class="card-text"><p>' + deal_info.retail_price + '</p><p>' + deal_info.price + '</p></p>' +
//     '<a href="#" class="btn btn-primary custom-btn2" id="shortenURL" onclick="urlShortener(\''+ deal_info.deal_link + '\')">Copy Link</a>' +
//     '<a href="#" class="btn btn-primary custom-btn2" onclick="delete_saved_deal(this.parentElement)">Delete Deal</a>'+
//     '<p style="display: none;">'+ deal_info.id +'</p>'+
//     '</div>' +
//     '</div>';
//     document.querySelector(".results").innerHTML += cardDetails;
// }

function render_saved_deals(deal_info) {
  sleep(500);
  let cardDetails =
    '<div class="card custom-card" style="width: 18rem;">' +
    '<img src="' +
    deal_info.banner_link +
    '" class="card-img-top custom-card-image">' +
    '<div class="card-body custom-card-body">' +
    '<h5 class="card-title">' +
    deal_info.game_name +
    "</h5>" +
    '<a target="_blank" class="btn btn-primary custom-btn1" href="' +
    deal_info.deal_link +
    '">Deal Link</a>' +
    '<p class="card-text"><p>' +
    deal_info.retail_price +
    "</p><p>" +
    deal_info.price +
    "</p></p>" +
    '<a href="#" class="btn btn-primary custom-btn2" id="shortenURL" onclick="urlShortener(\'' +
    deal_info.deal_link +
    "')\">Copy Link</a>" +
    '<a href="#" class="btn btn-primary custom-btn2" onclick="delete_saved_deal(this)">Delete Deal</a>' +
    // Hidden input element for the deal ID
    '<input type="hidden" class="deal-id" value="' +
    deal_info.deal_id +
    '">' +
    "</div>" +
    "</div>";
  document.querySelector(".results").innerHTML += cardDetails;
}

function sleep(millisec) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisec);
  });
}

// function delete_saved_deal(element) {
//   // Access the parent card element to retrieve the hidden deal_id input
//   const cardElement = element.closest(".card");
//   const dealId = cardElement.querySelector(".deal-id").value;

//   console.log(dealId);

// //   if (dealId) {
// //     // console.error("Deal ID is undefined or empty");
// //     console.log("id found");
// //   }

//   let xhr = new XMLHttpRequest();
//   const url = `/delete_saved_deal`;
//   const query = `deal_id=${encodeURIComponent(dealId)}`;

//   xhr.responseType = "json";
//   xhr.open("DELETE", url);
//   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

//   xhr.onload = function () {
//     var deleteResponse = xhr.response;
//     if (deleteResponse.success) {
//       cardElement.remove(); // Remove the card from the DOM
//     } else {
//       console.error("Failed to delete deal:", deleteResponse.message);
//     }
//   };

//   xhr.send(query);
// }

// function delete_saved_deal(element) {
//   // Access the parent card element to retrieve the deal_id
//   const cardElement = element.closest(".card");
//   const dealId = cardElement.querySelector(".deal-id").value;

//   if (!dealId) {
//     console.error("Deal ID is undefined or empty");
//     return;
//   }

//   let xhr = new XMLHttpRequest();
//   const url = `/delete_saved_deal`;
//   const query = `deal_id=${encodeURIComponent(dealId)}`;

//   xhr.responseType = "json";
//   xhr.open("DELETE", url);
//   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

//   xhr.onload = function () {
//     var deleteResponse = xhr.response;
//     if (deleteResponse.success) {
//       cardElement.remove();
//       console.log("Deal deleted successfully, reloading page...");
//       location.reload();
//     } else {
//       console.error("Failed to delete deal:", deleteResponse.message);
//     }
//   };

//   xhr.onerror = function () {
//     console.error("Request failed.");
//   };

//   xhr.send(query);
// }

function delete_saved_deal(element) {
  // Access the parent card element to retrieve the deal_id
  const cardElement = element.closest(".card");
  console.log("cardelement:", cardElement);
  const dealId = cardElement.querySelector(".deal-id").value;

  if (!dealId) {
    console.error("Deal ID is undefined or empty");
    return;
  }

  let xhr = new XMLHttpRequest();
  const url = `/delete_saved_deal`;
  const query = `deal_id=${encodeURIComponent(dealId)}`;

  xhr.responseType = "json";
  xhr.open("DELETE", url);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  console.log("apple")

  xhr.onload = function () {
    console.log("here");
    var deleteResponse = xhr.response;

    console.log(deleteResponse);

    if (deleteResponse.success) {
      console.log("Deal deleted successfully, refetching deals...");
      // Refetch the user's saved deals
      cardElement.remove();
    } else {
      console.error("Failed to delete deal:", deleteResponse.message);
    }
  };

  xhr.onerror = function () {
    console.error("Request failed.");
  };

  xhr.send(query);
}

window.onload = get_saved_deals();
