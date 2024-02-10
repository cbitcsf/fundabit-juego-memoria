const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

fetch("./data/photos.json")
  .then((res) => res.json())
  .then((data) => { 
    arr = getRandomObjects(data);
    cards = [...arr, ...arr];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
} //-----------------------------------------


function getRandomObjects(obj) {
    const TOTALCARDS = obj.length;
    const NCARDS = 9;
    let newArr = [];
    let randNums = selectRandomNumbers(TOTALCARDS);
    for (let i=0; i < NCARDS; i++){
        newArr.push(obj[randNums[i]]);        
    }
    return newArr;
}

//---------------------------

function selectRandomNumbers(num) {
	let a, arr = [];
    const NCARDS = 9;
	  while (arr.length < NCARDS) {
	    a = Math.floor(Math.random() * num);
	    // var x = Math.floor(Math.random()*(max-min+1)+min);
	    // a = Math.round(Math.random() * num);
      if (!arr.includes(a)) arr.push(a);
   }
   return arr; 
}

//---------------------------

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
  
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

 // confetti({ particleCount: 200, spread: 80, origin: { y: 0.7 }, });
 
  confetti({
    spread: 360,
    ticks: 200,
    gravity: 1,
    decay: 0.94,
    startVelocity: 15,
    particleCount: 25,
    scalar: 30,
    shapes: ["image"],
    shapeOptions: {
      image: [{
          src: `./assets/${secondCard.dataset.name}.png`,
          width: 32,
          height: 32,
        },
      ],
    },
  });
  score++;
  if (score == 9) {
	const duration = 5 * 1000,
	  animationEnd = Date.now() + duration,
	  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
	
	function randomInRange(min, max) {
	  return Math.random() * (max - min) + min;
	}
	
	const interval = setInterval(function() {
	  const timeLeft = animationEnd - Date.now();
	
	  if (timeLeft <= 0) {
	    return clearInterval(interval);
	  }
	
	  const particleCount = 50 * (timeLeft / duration);
	
	  // since particles fall down, start a bit higher than random
	  confetti(
	    Object.assign({}, defaults, {
	      particleCount,
	      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
	    })
	  );
	  confetti(
	    Object.assign({}, defaults, {
	      particleCount,
	      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
	    })
	  );
	}, 250);  
  }
  resetBoard();  
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  gridContainer.innerHTML = "";
  generateCards();
}
