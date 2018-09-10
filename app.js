

document.addEventListener("DOMContentLoaded", function(event) {
    var earth = document.querySelector('#earth')
    var search = document.querySelector('#search')
    var body = document.querySelector('body')
    var city = document.querySelector('#city')
    var response = document.querySelector('#response')
    var alert = document.querySelector('#alert')
    var which = document.querySelector('#which')
    var five = document.querySelector('#five')
    var cF = document.querySelector('#cF')

    var title = document.querySelectorAll('.card-title')
    var date = document.querySelectorAll('.date')
    var outlook = document.querySelectorAll('.outlook')
    var temp = document.querySelectorAll('.temp')
    var low = document.querySelectorAll('.low')
    var high = document.querySelectorAll('.high')
    var humidity = document.querySelectorAll('.humidity')
    var speed = document.querySelectorAll('.speed')
    var direction = document.querySelectorAll('.direction')
    var card = document.querySelectorAll('.card')
    var card_img = document.querySelectorAll('.center-block')

    var set = () => city.value = localStorage.getItem('fav') || ''
    set()

    var getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min


    search.addEventListener('click', function(event) {
      event.preventDefault()
      if (city.value === '') {
        alert.className = 'alert alert-danger'
        alert.innerHTML = `Can't Find Your City!`
        setTimeout(function(){alert.innerHTML =''; alert.className =''}, 3000)
        for (let i=0; i < card.length; i++) {
          card[i].className = 'card text-center mx-auto invisible'
      }
    }
      axios.get(`https://cors-anywhere.herokuapp.com/http://www.metaweather.com/api/location/search/?query=${city.value}`).then(result => {
        var city_data = result.data
        if (city_data.length === 0) {
          alert.className = 'alert alert-danger'
          alert.innerHTML = `Can't Find Your City!`
          setTimeout(function(){alert.innerHTML =''; alert.className =''}, 3000)

          for (let i=0; i < card.length; i++) {
            card[i].className = 'card text-center mx-auto invisible'
          }

        } else {
          for (let i = city_data.length -1; i >= 0; i--) {
            if (city_data[i].title === city.value) {
              var id = city_data[i].woeid
              localStorage.setItem('fav', `${city.value}`)
              earth.remove()
              alert.innerHTML = `Found Your City!`
              alert.className = 'alert alert-success'
              setTimeout(function(){alert.innerHTML =''; alert.className =''}, 3000)

              axios.get(`https://pixabay.com/api/?key=9836168-009d64875ade45aed31f53b02&q=${city.value}&image_type=photo`).then(result => {
                var city_pic = result.data
                var maxhit = city_pic.hits.length
                var rand = getRandom(0, maxhit)
                body.style.backgroundImage = `url('${city_pic.hits[rand].largeImageURL}')`
                cF.className = 'btn btn-primary'
              })
              axios.get(`https://cors-anywhere.herokuapp.com/http://www.metaweather.com/api/location/${id}`).then(result => {
                var weatherC = result.data.consolidated_weather
                for (let j=0; j < card.length; j++) {
                  date[j].textContent = weatherC[j].applicable_date
                  title[j].textContent = city.value
                  temp[j].innerHTML = `${Math.round(weatherC[j].the_temp)} ℃`
                  low[j].innerHTML= `${Math.round(weatherC[j].min_temp)} ℃`
                  high[j].innerHTML = ` - ${Math.round(weatherC[j].max_temp)} ℃`
                  humidity[j].innerHTML = `${weatherC[j].humidity} %`
                  speed[j].innerHTML = `${Math.round(weatherC[j].wind_speed)} mph`
                  direction[j].innerHTML = ` ${weatherC[j].wind_direction_compass}`
                  card_img[j].src = `http://www.metaweather.com/static/img/weather/${weatherC[i].weather_state_abbr}.svg`
                  card[0].className = 'card text-center mx-auto'
                }
              })
            } else {
              alert.className = 'alert alert-warning'
              which.className = 'alert alert-danger'
              alert.innerHTML += `| ${city_data[i].title} |`
              if (city_data.length === 1) {
                which.innerHTML = 'Did you mean?'
              } else {
                which.innerHTML = 'Which one?'
              }
              setTimeout(function(){which.innerHTML =''; which.className =''}, 3000)
              setTimeout(function(){alert.innerHTML =''; alert.className =''}, 5000)
              }
        } //for
      } //else
      cF.addEventListener('click', function(event) {
        axios.get(`https://cors-anywhere.herokuapp.com/http://www.metaweather.com/api/location/${id}`).then(result => {
          var weather = result.data.consolidated_weather
          if (cF.classList.contains('active')) {
          for (let i=0; i < card.length; i++) {
            temp[i].innerHTML = `${Math.round((weather[i].the_temp) * 1.8 + 32)} ℉`
            low[i].innerHTML= `${Math.round((weather[i].min_temp) * 1.8 + 32)} ℉`
            high[i].innerHTML = ` - ${Math.round((weather[i].max_temp) * 1.8 + 32)} ℉`
          }
        } else {
          for (let i=0; i < card.length; i++) {
            temp[i].innerHTML = `${Math.round(weather[i].the_temp)} ℃`
            low[i].innerHTML= `${Math.round(weather[i].min_temp)} ℃`
            high[i].innerHTML = ` - ${Math.round(weather[i].max_temp)} ℃`
          }
        }
      })

    })// cF listener
    }) // 1st get
}) // search listener

five.addEventListener('click', function(event) {
  if (five.classList.contains('active')) {
    for (let i=0; i < card.length; i++) {
      card[i].className = 'card text-center mx-auto'
    }
  } else {
    for (let i=1; i < card.length; i++) {
      card[i].className = 'card text-center mx-auto invisible'
    }
  }

}) // five list


}); //dom
