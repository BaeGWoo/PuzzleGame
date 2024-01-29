const request = indexedDB.open("PuzzleDB", 1);

let db;

request.onsuccess = (event) => {
    db = event.target.result;
};

request.onerror = (event) => {
    console.error("IndexedDB error:", event.target.error);
};

// dragAndDrop.js
var rows = 3;
var columns = 3;
var isMouseDown = false;
var offsetX, offsetY;

var currTile;
var otherTile; //balnkTile

var turns = 0;
var count=0;

var imgOrder1 = ["1", "2", "3", "5", "9", "6", "7", "8", "4"];
var imgOrder2 = ["2", "3", "1", "5", "8", "6", "7", "9", "4"];
var imgOrder3 = ["4", "2", "7", "5", "9", "3", "6", "8", "1"];
var ans=[["1","2","3"],["4","5","6"],["7","8","9"]];

const level1Button = document.getElementById('1');
const level2Button = document.getElementById('2');
const level3Button = document.getElementById('3');
const titleContainer = document.getElementById('title');







function handleButtonClick(level,e) {
    /* particle */
    if (document.body.animate) {
      for (let i = 0; i < 30; i++) {
        createParticle(e.clientX, e.clientY, e.target.dataset.type);
      }
    }
  
    function createParticle(x, y, type) {
      const particle = document.createElement("particle");
      document.body.appendChild(particle);
  
      const size = Math.floor(Math.random() * 20 + 5);
  
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
  
      const destinationX = x + (Math.random() - 0.5) * 2 * 75;
      const destinationY = y + (Math.random() - 0.5) * 2 * 75;
  
      switch (type) {
        case "square":
          particle.style.background = `hsl(${Math.random() * 90 + 270}, 70%, 60%)`;
          particle.style.border = "1px solid white";
          break;
        case "circle":
          particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
          particle.style.borderRadius = "50%";
          break;
        default:
          particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
      }
  
      const animation = particle.animate(
        [
          {
            // Set the origin position of the particle
            // We offset the particle with half its size to center it around the mouse
            transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
            opacity: 1,
          },
          {
            // We define the final coordinates as the second keyframe
            transform: `translate(${destinationX}px, ${destinationY}px)`,
            opacity: 0,
          },
        ],
        {
          duration: 500 + Math.random() * 1000,
          easing: "cubic-bezier(0, .9, .57, 1)",
          delay: Math.random() * 200,
        }
      );
  
      animation.onfinish = () => {
        particle.remove();
      };
    }
  
    function removeParticle(e) {
      e.srcElement.effect.target.remove();
    }
  

    setTimeout(() => {
        SetPuzzle(level);
  
    const button = document.querySelector(".button-first");
    if (button) {
      button.style.display = 'none';
    }
      }, 500);
   
  }
  
  


function  HideButton(){
    level1Button.style.display='diable';
    level2Button.style.display = 'none';
    level3Button.style.display = 'none';
}



function SetPuzzle(level) {
   

    // body에 새로운 h1 요소 추가
   
    const container = document.querySelector(".container");


    const titleDiv = document.createElement('div');
    titleDiv.className= 'left-section';
    container.appendChild(titleDiv);
    
    const imgtest = ["./head.png", "./game_" + level + "/ans.png","./완성.png"]; // 이미지 순서 배열
    imgtest.forEach(src => {
        const img = document.createElement('img'); 
        img.src = src;
        img.className="puzzle-image";
        if(src==="./완성.png")
        {
       img.style.maxWidth = '15%';
    }
    if(src==="./head.png")
    {
        img.style.marginTop='10%';
        img.style.marginBottom='30px';
    }
        titleDiv.appendChild(img); 
    });
    

    const mainDiv = document.createElement('div');
    mainDiv.className = 'center-section';
   container.appendChild(mainDiv);
   

   const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';
mainDiv.appendChild(buttonContainer);


const centerimg = ["./Turn01.png", "./Turn02.png", "./Level" + level + ".png"];
centerimg.forEach((src, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    buttonContainer.appendChild(imgContainer);

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'img-wrapper';
    imgContainer.appendChild(imgWrapper);

    const img = document.createElement('img'); 
    img.src = src;
    img.className = "button-image";
    img.style.maxWidth = '50%';
    imgWrapper.appendChild(img);

   
    if (index === 1) { // Turn02.png 이미지 위에 turns 텍스트 추가
        const turnsText = document.createElement('span'); // span 태그로 변경
        turnsText.textContent = turns;
        turnsText.id = 'turns-text'; // span 태그에 ID 추가
        turnsText.className = 'turns-text';
        imgWrapper.appendChild(turnsText);
    }
});
    const boardDiv = document.createElement('div');
    boardDiv.id = 'board';
   
    const boardContainerDiv = document.createElement('div');
    boardContainerDiv.className = 'board-container';
    boardDiv.appendChild(boardContainerDiv);
    mainDiv.appendChild(boardDiv);
mainDiv.style.marginTop='5%';
   // getTopScores(5);
    const boardContainer = document.querySelector(".board-container");
    //const ansImg=document.createElement('img');
    
    //const h2Text = document.createElement('h2');



   
    const imgOrders=[imgOrder1,imgOrder2,imgOrder3];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            
            tile.src ="./game_"+level+"/"+imgOrders[level-1].shift() + ".jpg";
            //console.log(tile.src);
            tile.className = "board-container image";
            boardContainer.appendChild(tile);

            tile.addEventListener("mousedown", handleMouseDown);
            tile.addEventListener("touchstart", handleTouchStart);
            tile.addEventListener("mousemove", handleMouseMove);
            tile.addEventListener("touchmove", handleTouchMove);
            tile.addEventListener("mouseup", handleMouseUp);
            tile.addEventListener("touchend", handleTouchEnd);
        }
    }

};
function checkSuccess() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.src.endsWith(ans[r][c] + ".jpg") === false) {
                return false;
            }
           
        }
    }
    return true;
}
function handleMouseDown(e) {
    e.preventDefault();
    isMouseDown = true;
    currTile = this;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
}

function handleTouchStart(e) {
    e.preventDefault();
    isMouseDown = true;
    currTile = this;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
   
}

function handleMouseMove(e) {
    e.preventDefault();
    if (isMouseDown && currTile) {
        currTile.style.left = e.clientX - offsetX + "px";
        currTile.style.top = e.clientY - offsetY + "px";
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (isMouseDown && currTile) {
        currTile.style.left = e.clientX - offsetX + "px";
        currTile.style.top = e.clientY - offsetY + "px";
    }
}

function handleMouseUp() {
    otherTile = this;
    dragEnd();
    isMouseDown = false;
    isMove=false;
    if (checkSuccess()) {
       //saveScore(turns);
       
        // 이미지가 완성되었을 때 1초 뒤에 성공 팝업 띄우기
        setTimeout(function() {
            window.alert("축하합니다!\n나의 기록: " + turns);
            window.close(); // 현재 창 닫기
        }, 50);}
}

function handleTouchEnd(e) {
    let endedTouch = e.changedTouches[0];
    let endedTile = document.elementFromPoint(endedTouch.clientX, endedTouch.clientY);
    otherTile=endedTile;

   dragEnd();
   if (checkSuccess()) {
    // 이미지가 완성되었을 때 1초 뒤에 성공 팝업 띄우기
    setTimeout(function() {
        window.alert("축하합니다!\n나의 기록: " + turns);
        window.close();
    }, 50);}
    isMouseDown = false;
}

/*
request.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("scores")) {
        const objectStore = db.createObjectStore("scores", { keyPath: "turns" });
        objectStore.createIndex("by_turns", "turns");
    }
};*/
    


function saveScore(turns) {
    const transaction = db.transaction(["scores"], "readwrite");
    const objectStore = transaction.objectStore("scores");
    const countRequest = objectStore.count();

   countRequest.onsuccess = (event) => {
        const count = event.target.result;

        if (count >= 5) {
            // 저장된 개수가 10을 넘으면 가장 큰 값 찾아서 삭제
            const index = objectStore.index("by_turns");
            const maxTurnsRequest = index.openCursor(null, "prev");

            maxTurnsRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    console.log("Deleted score with max turns:", cursor.value.turns);
                }
            };

            maxTurnsRequest.onerror = (event) => {
                console.error("Error deleting score:", event.target.error);
            };
        }
    };
    const addRequest = objectStore.add({ turns });

    addRequest.onsuccess = () => {
        console.log("Score saved successfully");
    };

    
    request.onerror = (event) => {

        if (event.target.error.name === "ConstraintError") {
            console.warn("Score already exists, not saving duplicate.");
            return; // 이미 같은 값이 존재하면 중복 저장하지 않음
        }
        console.error("Error saving score:", event.target.error);
    };
}

function getTopScores(count) {
    const transaction = db.transaction(["scores"], "readonly");
    const objectStore = transaction.objectStore("scores");
    const index = objectStore.index("by_turns");

    const request = index.openCursor(null, "next"); // 오름차순으로 정렬
    
    let scores = [];
    
    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && scores.length < count) {
            scores.push(cursor.value.turns);
            cursor.continue();
        } else {
            
                const popupContent = scores.map((score, index) => `${index + 1}등: ${score}`).join('\n');
                const popup = window.open('', 'Popup', 'width=300,height=400');
                popup.document.write('<pre>' + popupContent + '</pre>');
            
        }
    };

    request.onerror = (event) => {
        console.error("Error getting top scores:", event.target.error);
    };
}

// 사용 예시: 처음부터 5개의 스코어 출력




function getSortedScores() {
    const transaction = db.transaction(["scores"], "readonly");
    const objectStore = transaction.objectStore("scores");
    const index = objectStore.index("by_turns");

    const request = objectStore.openCursor();

    request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const firstScore = cursor.value.turns;
            console.log("First Score:", firstScore);

            // 첫 번째 값 찾았으므로 더 이상 반복하지 않고 중단
            cursor.continue();
        }
    };

    request.onerror = (event) => {
        console.error("Error getting sorted scores:", event.target.error);
    };
}
function GetImageName(src) {
    if (!src) {
        return "";
    }
    // 파일 경로에서 파일 이름을 추출하기 위해 '/' 기준으로 문자열을 나누고 마지막 요소를 가져옴
    let parts = src.split('/');
    let imageName = parts[parts.length - 1];
    return imageName;
}

function dragEnd() {
    let curTileName = GetImageName(currTile.src);
    let otherTileName = GetImageName(otherTile.src);
   
    if ((curTileName == otherTileName) || otherTileName !== '3.jpg')
        return;

    
    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);
   
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);
    //console.log("이전타일 ("+r+","+c+")"+"현재타일 : ("+r2+","+c2+")");


    let moveLeft = r === r2 && c2 === c - 1;
    let moveRight = r === r2 && c2 === c + 1;
    let moveUp = c === c2 && r2 === r - 1;
    let moveDown = c === c2 && r2 === r + 1;

    let isMove = moveLeft || moveRight || moveUp || moveDown;

    if (isMove) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        
// turns 변수를 변경할 때 updateTurnsText 함수를 호출하여 텍스트 업데이트
updateTurnsText();
    }
    // 변수 turns를 변경하고 해당 span 태그의 텍스트도 업데이트
function updateTurnsText() {
    const turnsText = document.getElementById('turns-text');
    turnsText.textContent =  turns;
}



    document.addEventListener("touchmove", (e) => {
        if (isMouseDown) {
            e.preventDefault();
            if (!otherTile || otherTile.src.includes("3.jpg")) {
                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                let elements = document.elementsFromPoint(x, y);
                elements.forEach((element) => {
                    if (element.tagName === "IMG" && element.id !== currTile.id) {
                        otherTile = element;
                    }
                });
            }
        }
    });
   
    
    isMouseDown = false;
}

