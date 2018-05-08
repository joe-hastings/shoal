document.addEventListener("DOMContentLoaded", () => {
  // POPULATION SETUP
  var POPULATION = 100;
  var MIN_MASS = .7;
  var MAX_MASS = 3.5;
  var FOOD_RATIO = .2;
  var SCREEN = 1;

  var SEA_COLOR = '#2c3e50'

  // canvas elements
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');

  // THE SEA
  sea = {
    width: 0,
    height: 0,
    population: [],
    food: [],
    canvas: ctx
  }

  // internal use
  var time = null;
  var interval = 20;
  var steps = 0;

  // Fish.showBehavior = true;

  window.addEventListener('resize', function() {
    // resize sea
    sea.width = window.innerWidth * SCREEN;
    sea.height = window.innerHeight * SCREEN;

    // resize canvas element
    var e = document.getElementById("canvas");
    e.setAttribute("width", sea.width);
    e.setAttribute("height", sea.height);
  })
  
  // Fire a resize to set up the initil size
  window.dispatchEvent(new Event('resize'));

  // populate the sea
  for (var i = 0; i < POPULATION; i++) {
    // random setup
    var randomX = Math.random() * sea.width;
    var randomY = Math.random() * sea.height
    var randomMass = MIN_MASS + (Math.random() * Math.random() * Math.random() * Math.random()) * MAX_MASS;

    // create fish
    var fish = new Fish(randomMass, randomX, randomY);

    // add fish to the sea population
    sea.population.push(fish);
  }

  // add food to the sea
  var initialFood = POPULATION * FOOD_RATIO;
  for (var i = 0; i < initialFood; i++) {
    // initial values
    var randomX = Math.random() * sea.width;
    var randomY = Math.random() * sea.height;
    var foodAmmount = Math.random() * 100 + 20;

    // create food
    var food = new Food(randomX, randomY, foodAmmount);
    sea.food.push(food);
  }

  // one time-step of the timeline loop
  var step = function() {
    // clear the screen (with a fade)
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = SEA_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // update the food
    for (var i in sea.food) {
      var food = sea.food[i];

      if (food && !food.dead) {
        food.draw(ctx);
        food.update(sea);
      } else {
        sea.food[i] = null;
        if (Math.random() < .001)
          sea.food[i] = new Food(Math.random() * sea.width, Math.random() * sea.height, Math.random() * 100 + 20);
      }
    }

    // list of fish that died during this time-step
    var deadList = [];

    // update all the fishes
    for (var i in sea.population) {
      // current fish
      var fish = sea.population[i];

      // if the fish is dead or null, skip it
      if (fish == null) {
        deadList.push(i);
        continue;
      }

      // makes the fish compute an action (which direction to swim) according to the information it can get from the environment
      fish.swim(sea);

      // update the fish (position and state)
      fish.update(sea);

      // draw the fish
      fish.draw(ctx);

      // if dead, add the fish to the dead list
      if (fish.dead) {
        sea.population[i] = null;
        deadList.push(i);
      }
    }

    // clean all the dead fishes from the sea population
    for (var j in deadList)
      sea.population.splice(deadList[j], 1);
  }

  // kick it off!
  setInterval(step, interval);
});