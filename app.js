document.addEventListener("DOMContentLoaded", function (event) {

  const earth = document.querySelector("#earth")
  const search = document.querySelector("#search")
  const body = document.querySelector("body")
  const city = document.querySelector("#city")
  const alert = document.querySelector("#alert")
  const which = document.querySelector("#which")
  const five = document.querySelector("#five")
  const f = document.querySelector("#f")
  const k = document.querySelector("#k")

  const title = document.querySelectorAll(".card-title")
  const date = document.querySelectorAll(".date")
  const temp = document.querySelectorAll(".temp")
  const low = document.querySelectorAll(".low")
  const high = document.querySelectorAll(".high")
  const humidity = document.querySelectorAll(".humidity")
  const speed = document.querySelectorAll(".speed")
  const direction = document.querySelectorAll(".direction")
  const card = document.querySelectorAll(".card")
  const card_img = document.querySelectorAll(".center-block")
  const symbol = document.querySelectorAll(".symbol")
  const symbol2 = document.querySelectorAll(".symbol2")
  const link = document.querySelectorAll(".city-link")


  let cityId = ""

  let cityData = ""

  let cityWeather = ""

  const set = () => (city.value = localStorage.getItem("fav") || "")
  set()

  const getRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min

  const runResponse = () => {
    alert.className = "alert alert-success"
    alert.innerHTML = "Searching..."
    if (city.value === "") {
      alert.className = "alert alert-danger"
      alert.innerHTML = "Can't Find Your City!"
      setTimeout(function () {
        alert.innerHTML = ""
        alert.className = ""
      }, 3000)
    }
  }

  const getCityData = () => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${
        city.value
        }`
      ).then(result => {
        cityData = result.data
        ifNotFound()
      }).catch(error => {
        if (error.response) {
          console.log("CityData", error.response.data);
          console.log("CityData", error.response.status);
          console.log("CityData", error.response.headers);
        }
      })
  }

  const ifNotFound = () => {
    if (cityData.length === 0 || cityData.length > link.length) {
      alert.className = "alert alert-danger"
      alert.innerHTML = `Can't Find Your City!`
      setTimeout(function () {
        alert.innerHTML = ""
        alert.className = ""
      }, 4000)
    } else {
      for (let i = cityData.length - 1; i >= 0; i--) {
        if (cityData[i].title === city.value) {
          localStorage.setItem("fav", `${city.value}`)
          cityId = cityData[i].woeid
          earth.remove()
          getPic()
          getWeather()
          alert.innerHTML = `Found Your City!`
          alert.className = "alert alert-success"
          setTimeout(function () {
            alert.innerHTML = ""
            alert.className = ""
          }, 1000)
        } else {
          alert.className = "alert alert-danger"
          which.className = "alert alert-warning"
          link[i].innerHTML = cityData[i].title
          if (cityData.length === 1) {
            alert.innerHTML = "Did you mean?"
          } else {
            alert.innerHTML = "Which one?"
          }
          setTimeout(function () {
            alert.innerHTML = ""
            alert.className = ""
          }, 3000)
          setTimeout(function () {
            link[i].innerHTML = ""
            which.className = ""
          }, 5000)
        }
      }
    }
  }


  const getPic = () => {
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
      }).catch(error => {
        if (error.response) {
          console.log("Pic", error.response.data);
          console.log("Pic", error.response.status);
          console.log("Pic", error.response.headers);
        }
      })
  }

  const getWeather = () => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${cityId}`
      ).then(result => {
        cityWeather = result.data.consolidated_weather
        addWeather()
      }).catch(error => {
        if (error.response) {
          console.log("Weather", error.response.data);
          console.log("Weather", error.response.status);
          console.log("Weather", error.response.headers);
        }
      })
  }

  const addWeather = () => {
    for (let i = 0; i < card.length; i++) {
      date[i].textContent = cityWeather[i].applicable_date;
      title[i].textContent = city.value;
      humidity[i].innerHTML = `${cityWeather[i].humidity} %`;
      speed[i].innerHTML = `${Math.round(
        cityWeather[i].wind_speed
      )} mph`;
      direction[i].innerHTML = ` ${
        cityWeather[i].wind_direction_compass
        }`;
      card_img[
        i
      ].src = `http://www.metaweather.com/static/img/weather/${
        cityWeather[i].weather_state_abbr
        }.svg`

      if (f.classList.contains("active")) {
        temp[i].innerHTML = Math.round(
          cityWeather[i].the_temp * 1.8 + 32
        )
        symbol[i].innerHTML = " ℉"
        low[i].innerHTML = Math.round(
          cityWeather[i].min_temp * 1.8 + 32
        )
        high[i].innerHTML = Math.round(
          cityWeather[i].max_temp * 1.8 + 32
        )
        symbol2[i].innerHTML = " ℉"
      } else if (k.classList.contains("active")) {
        temp[i].innerHTML = Math.round(cityWeather[i].the_temp + 273)
        symbol[i].innerHTML = " K"
        low[i].innerHTML = Math.round(cityWeather[i].min_temp + 273)
        high[i].innerHTML = Math.round(cityWeather[i].max_temp + 273)
        symbol2[i].innerHTML = " K"
      } else {
        temp[i].innerHTML = Math.round(cityWeather[i].the_temp)
        symbol[i].innerHTML = " ℃"
        low[i].innerHTML = Math.round(cityWeather[i].min_temp)
        high[i].innerHTML = Math.round(cityWeather[i].max_temp)
        symbol2[i].innerHTML = " ℃"
      }
    }
    card[0].className = "card text-center mx-auto"
  }

  search.addEventListener("click", event => {
    event.preventDefault()
    runResponse()
    getCityData()
  })

  five.addEventListener("click", function (event) {
    event.preventDefault()
    if (five.classList.contains("active")) {
      for (let i = 1; i < card.length; i++) {
        card[i].className = "card text-center mx-auto invisible"
      }
    } else {
      for (let i = 0; i < card.length; i++) {
        card[i].className = "card text-center mx-auto"
      }
    }
  })


  which.addEventListener("click", event => {
    event.preventDefault()
    city.value = event.target.innerHTML
    runResponse()
    getCityData()
  })

})
