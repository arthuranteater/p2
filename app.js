document.addEventListener("DOMContentLoaded", function (event) {
  var earth = document.querySelector("#earth");
  var search = document.querySelector("#search");
  var body = document.querySelector("body");
  var city = document.querySelector("#city");
  var alert = document.querySelector("#alert");
  var which = document.querySelector("#which");
  var five = document.querySelector("#five");
  var f = document.querySelector("#f");
  var k = document.querySelector("#k");

  var title = document.querySelectorAll(".card-title");
  var date = document.querySelectorAll(".date");
  var temp = document.querySelectorAll(".temp");
  var low = document.querySelectorAll(".low");
  var high = document.querySelectorAll(".high");
  var humidity = document.querySelectorAll(".humidity");
  var speed = document.querySelectorAll(".speed");
  var direction = document.querySelectorAll(".direction");
  var card = document.querySelectorAll(".card");
  var card_img = document.querySelectorAll(".center-block");
  var symbol = document.querySelectorAll(".symbol");
  var symbol2 = document.querySelectorAll(".symbol2");
  var link = document.querySelectorAll(".city-link")

  var set = () => (city.value = localStorage.getItem("fav") || "");
  set();

  var getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  search.addEventListener("click", function (event) {
    event.preventDefault();
    alert.className = "alert alert-success";
    alert.innerHTML = "Searching...";
    if (city.value === "") {
      alert.className = "alert alert-danger";
      alert.innerHTML = "Can't Find Your City!";
      setTimeout(function () {
        alert.innerHTML = "";
        alert.className = "";
      }, 3000);
    }
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/http://www.metaweather.com/api/location/search/?query=${
        city.value
        }`
      )
      .then(result => {
        var city_data = result.data;
        if (city_data.length === 0) {
          alert.className = "alert alert-danger";
          alert.innerHTML = `Can't Find Your City!`;
          setTimeout(function () {
            alert.innerHTML = "";
            alert.className = "";
          }, 4000);
        } else {
          for (let i = city_data.length - 1; i >= 0; i--) {
            if (city_data[i].title === city.value) {
              var id = city_data[i].woeid;
              localStorage.setItem("fav", `${city.value}`);
              earth.remove();
              alert.innerHTML = `Found Your City!`;
              alert.className = "alert alert-success";
              setTimeout(function () {
                alert.innerHTML = "";
                alert.className = "";
              }, 3000);

              axios
                .get(
                  `https://pixabay.com/api/?key=9836168-009d64875ade45aed31f53b02&q=${
                  city.value
                  }&image_type=photo`
                )
                .then(result => {
                  var city_pic = result.data;
                  var maxhit = city_pic.hits.length;
                  var rand = getRandom(0, maxhit);
                  body.style.backgroundImage = `url('${
                    city_pic.hits[rand].largeImageURL
                    }')`;
                });
              axios
                .get(
                  `https://cors-anywhere.herokuapp.com/http://www.metaweather.com/api/location/${id}`
                )
                .then(result => {
                  var weather = result.data.consolidated_weather;
                  for (let j = 0; j < card.length; j++) {
                    date[j].textContent = weather[j].applicable_date;
                    title[j].textContent = city.value;
                    humidity[j].innerHTML = `${weather[j].humidity} %`;
                    speed[j].innerHTML = `${Math.round(
                      weather[j].wind_speed
                    )} mph`;
                    direction[j].innerHTML = ` ${
                      weather[j].wind_direction_compass
                      }`;
                    card_img[
                      j
                    ].src = `http://www.metaweather.com/static/img/weather/${
                      weather[i].weather_state_abbr
                      }.svg`;

                    if (f.classList.contains("active")) {
                      temp[j].innerHTML = Math.round(
                        weather[j].the_temp * 1.8 + 32
                      );
                      symbol[j].innerHTML = " ℉";
                      low[j].innerHTML = Math.round(
                        weather[j].min_temp * 1.8 + 32
                      );
                      high[j].innerHTML = Math.round(
                        weather[j].max_temp * 1.8 + 32
                      );
                      symbol2[j].innerHTML = " ℉";
                    } else if (k.classList.contains("active")) {
                      temp[j].innerHTML = Math.round(weather[j].the_temp + 273);
                      symbol[j].innerHTML = " K";
                      low[j].innerHTML = Math.round(weather[j].min_temp + 273);
                      high[j].innerHTML = Math.round(weather[j].max_temp + 273);
                      symbol2[j].innerHTML = " K";
                    } else {
                      temp[j].innerHTML = Math.round(weather[j].the_temp);
                      symbol[j].innerHTML = " ℃";
                      low[j].innerHTML = Math.round(weather[j].min_temp);
                      high[j].innerHTML = Math.round(weather[j].max_temp);
                      symbol2[j].innerHTML = " ℃";
                    }
                  }
                  card[0].className = "card text-center mx-auto";
                });
            } else {
              alert.className = "alert alert-danger";
              which.className = "alert alert-warning";
              link[i].innerHTML = city_data[i].title;
              if (city_data.length === 1) {
                alert.innerHTML = "Did you mean?";
              } else {
                alert.innerHTML = "Which one?";
              }
              setTimeout(function () {
                alert.innerHTML = "";
                alert.className = "";
              }, 3000);
              setTimeout(function () {
                link[i].innerHTML = "";
                which.className = "";
              }, 5000);
            }
          } //for
        } //else
      });
  }); // search listener

  five.addEventListener("click", function (event) {
    console.log(event.target);
    if (five.classList.contains("active")) {
      for (let i = 1; i < card.length; i++) {
        card[i].className = "card text-center mx-auto invisible";
      }
    } else {
      for (let i = 0; i < card.length; i++) {
        card[i].className = "card text-center mx-auto";
      }
    }
  }); // five listener


  which.addEventListener("click", event => {
    city.value = event.target.innerHTML
  })

}); // DOM
