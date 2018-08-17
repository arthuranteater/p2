//rainbow brackets

document.addEventListener("DOMContentLoaded", function(event) {
    //console.log("DOM fully loaded and parsed");
    var earth = document.querySelector('#earth')
    var search = document.querySelector('#search')
    var body = document.querySelector('body')
    var city = document.querySelector('#city')
    var response = document.querySelector('#response')
    var alert = document.querySelector('#alert')
    var which = document.querySelector('#which')
    var five = document.querySelector('.btn')

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

    var last = localStorage.getItem('fav') || {}
    city.value = last



    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }




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
        if (result.data.length === 0) {
          alert.className = 'alert alert-danger'
          alert.innerHTML = `Can't Find Your City!`

          setTimeout(function(){alert.innerHTML =''; alert.className =''}, 3000)
          for (let i=0; i < card.length; i++) {
            card[i].className = 'card text-center mx-auto invisible'
          }
        } else {
          for (let i = result.data.length -1; i >= 0; i--) {
            if (result.data[i].title === city.value) {
              localStorage.setItem('fav', `${city.value}`)
              alert.innerHTML = `Found Your City!`
              alert.className = 'alert alert-success'
              earth.remove()
              setTimeout(function(){alert.innerHTML =''; alert.className =''}, 3000)
              var id = result.data[i].woeid
              axios.get(`https://pixabay.com/api/?key=9836168-009d64875ade45aed31f53b02&q=${city.value}&image_type=photo`).then(result => {
                var maxhit = result.data.hits.length
                console.log(result.data.hits)
                var rand = getRandom(0, maxhit)
                console.log(result.data.hits[rand].largeImageURL)
                body.style.backgroundImage = `url('${result.data.hits[rand].largeImageURL}')`
              })
              axios.get(`https://cors-anywhere.herokuapp.com/http://www.metaweather.com/api/location/${id}`).then(result => {
                for (let j=0; j < result.data.consolidated_weather.length; j++) {
                  //console.log(result.data.consolidated_weather[j])
                  date[j].textContent = result.data.consolidated_weather[j].applicable_date
                  title[j].textContent = city.value
                  temp[j].innerHTML = `${Math.round(result.data.consolidated_weather[j].the_temp)} ℃`
                  low[j].innerHTML= `${Math.round(result.data.consolidated_weather[j].min_temp)} ℃`
                  high[j].innerHTML = ` - ${Math.round(result.data.consolidated_weather[j].max_temp)} ℃`
                  humidity[j].innerHTML = `${result.data.consolidated_weather[j].humidity} %`
                  speed[j].innerHTML = `${Math.round(result.data.consolidated_weather[j].wind_speed)} mph`
                  direction[j].innerHTML = ` ${result.data.consolidated_weather[j].wind_direction_compass}`
                  card[0].className = 'card text-center mx-auto'
                  card_img[j].src = `http://www.metaweather.com/static/img/weather/${result.data.consolidated_weather[i].weather_state_abbr}.svg`
                }
              })
            } else {
              alert.className = 'alert alert-warning'
              which.className = 'alert alert-danger'
              alert.innerHTML += `| ${result.data[i].title} |`
              if (result.data.length === 1) {
                which.innerHTML = 'Did you mean?'
              } else {
                which.innerHTML = 'Which one?'
              }
              setTimeout(function(){which.innerHTML =''; which.className =''}, 3000)
              setTimeout(function(){alert.innerHTML =''; alert.className =''}, 5000)
              }
        } //for
      } //else
    }) //1st get
}) //click eventlistener
five.addEventListener('click', function(event) {
    for (let i=1; i < card.length; i++) {
      card[i].className = 'card text-center mx-auto'
    }

}) //eventlistener

}); //dom
