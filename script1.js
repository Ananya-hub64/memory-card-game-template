const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton =document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard =  false;

// adding back-face images in array format
const items=[
    { name:"apple", image:"apple.png" },
    { name:"avocado", image:"avocado.png" },
    { name:"bananas", image:"bananas.png" },
    { name:"cherries", image:"cherry.png" },
    { name:"dragon", image:"dragon-fruit.png" },
    { name:"mango", image:"mango.png" },
    { name:"orange", image:"orange.png" },
    { name:"strawberry", image:"strawberry.png" },
    { name:"beet", image:"beet.png" },
    { name:"bell-pepper", image:"bellpepper.png" },
    { name:"biryani", image:"biryani.png" },
    { name:"cabbage", image:"cabbage.png" },
];
//defining initial time
let seconds = 0,
 minutes = 0;
//defining initial moves
let movesCount = 0,
    winCount = 0;

//timer
const timeGenerator= () => {
    seconds += 1;
    //logic for minutes
    if(seconds >= 60)
    {
        minutes += 1;
        seconds = 0;
    }
    //format of time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` :seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` :minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};
//logic for counting moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
//for picking up random objects from items array
const generateRandom = (size = 4) => {
    
    //temporary Array
    let tempArray = [...items];
    //initail card values will be null
    let cardValues = [];
    size= (size * size) /2;//size will double (4*4)/2 for pair of values
    
    for(let i = 0; i < size; i++)
        {
            const randomIndex = Math.floor(Math.random() * tempArray.length);
            cardValues.push(tempArray[randomIndex]);
            //shuffle the cards
            tempArray.splice(randomIndex, 1);
        }
        return cardValues;
    
};
const matrixGenerator = (cardValues, size = 4)  => {
    gameContainer.innerHTML = "";
    cardValues=[...cardValues,...cardValues];
    cardValues.sort(() => Math.random() -0.5);
    for(let i=0; i<size * size; i++)
        /*front-side card contains question mark symbol
          back-side card contains actuall image 
          data-card-value contains the name of the image*/
    {
        gameContainer.innerHTML +=`
        <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
        </div>`;

    }
    //for displaying cards in grid in (4*4)
    gameContainer.style.gridTemplateColumns= `repeat(${size},auto)`;
    //cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //If selected card is not matched yet then only run
            if(!card.classList.contains("matched")){
                //flip the cliked card
                card.classList.add("flipped");
                //if it is the firstcard (!firstCard since firstCard is initially false)
                if(!firstCard){
                    // current card becomes first card 
                    firstCard = card;
                    //current card value becomes first-card-value
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //incrementing moves 
                movesCounter();
                //second card and value
                secondCard= card;
                let secondCardValue = card.getAttribute("data-card-value");
                if(firstCardValue == secondCardValue) {
                    //both cards matched next it will be ignored
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    firstCard = false;
                    //wincount increases as cards are matched
                    winCount += 1;
                    if(winCount  == Math.floor(cardValues.length/2)) {
                        result.innerHTML = `<audio autoplay> <source src="wintune.wav" type="audio/wav"></audio><h2>Congratulations YOU WON!</h2> <img src="win.png" alt="image"> 
                        <h4>Moves: ${movesCount}</h4>`;
                        stopGame();
                    }
                } else {
                    //if cards are not matched flip
                  let [tempFirst, tempSecond] = [firstCard,secondCard];
                  firstCard = false;
                  secondCard = false;
                  let delay = setTimeout(() => {
                    tempFirst.classList.remove("flipped");
                    tempSecond.classList.remove("flipped");
                  }, 900);
                }
            }
        }  
    });
  });
};
//logic for start button     
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //visibility of button logic
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});
//logic for second button
stopButton.addEventListener(
    "click",
    (stopGame = () => {
      controls.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
    })
);
//function calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues=generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};

 