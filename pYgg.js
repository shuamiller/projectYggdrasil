const beginBtn = document.querySelector("#begin-button");
const beginDiv = document.querySelector("#begin-div");
const textDiv = document.querySelector("#text-div");
const playerInterface = document.querySelector("#player-interface");
const inputDiv = document.querySelector("#input-div");
const playerInput = document.querySelector("#player-input");
const gameInfo = document.querySelector('#game-info');
const form = document.querySelector('form')
let currentRoom;
let currentWorld;

let playerCharacter = {
    name: "",
    inventory: [],
}

let doorway = {
    description: "A smooth surface, the same color and texture as the rest of the room but recessed into the north wall.",
    openText: "It doesn't appear to open in any way.",
    pushText: "You push against the flat surface, but it doesn't give.",
    pullText: "There isn't any way to pull it.",
    dialogue: ["It says nothing.", "It still says nothing..."],
    removedDialogue: [],
    directionalAccess: false
};

let darkGlass = {
    description: '<p class="game-text">A circular portal of dark glass set into the wall. It is about the size of your head. As you look at it, the glass-like surface begins to ripple suddenly. You hear a voice come from the portal. As the voice speaks, the ripple grows. \'Welcome, Pilgrim. I am the Herald of Yggdrasil. We haven\'t had a new arrival in some time. What is your name?\'</p>'
};

let heraldOfYggdrasil = {

};

let entryPoint = {
    name: "Entry Point",
    description: '<p class="game-text">You find yourself in a room of smooth stone the color of sand. You don\'t remember how you came to be here. You don\'t remember who you are.</p><p class="game-text">This room seems to be illuminated without a source. Ahead of you, there is a recessed wall that could be a <span class="object-text">doorway</span>, but there is no opening. To the left of the recess, a circular portal of <span class="object-text">dark glass</span> is set in the wall.</p>',
    objects: [
        doorway,
        darkGlass
    ],
    characters: [
        heraldOfYggdrasil
    ]
};

let worlds0 = {
    name: "Worlds[0]",
    rooms: [
        entryPoint
    ] 
}


function replaceButton() {
    playerInterface.removeChild(beginDiv);
    const labelDiv = document.createElement('div');
    labelDiv.setAttribute('id', 'label-div');
    const question = document.createElement('label');
    question.setAttribute('id', 'question');
    question.setAttribute('for', 'player-input');
    question.textContent = "What Will You Do?"
    labelDiv.appendChild(question);
    playerInterface.insertBefore(labelDiv, inputDiv);
}

function removeChildren(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function appendGameText() {
    textDiv.innerHTML = entryPoint.description;
}

function setRoomLocation(room) {
    currentRoom = room.name;
}

function setWorldLocation(world) {
    currentWorld = world.name;
}

function createLocationHeader() {
    const locationDiv = document.createElement('div');
    locationDiv.setAttribute('id', 'location-div');
    const worldLocation = document.createElement('div');
    worldLocation.setAttribute('id', 'world-location');
    const worldText = document.createElement('p');
    worldText.setAttribute('id', 'world-text');
    worldText.setAttribute('class', 'location-header');
    worldLocation.appendChild(worldText);
    locationDiv.appendChild(worldLocation);
    const roomLocation = document.createElement('div');
    roomLocation.setAttribute('id', 'room-location');
    const roomText = document.createElement('p');
    roomText.setAttribute('id', 'room-text');
    roomText.setAttribute('class', 'location-header');
    roomLocation.appendChild(roomText);
    locationDiv.appendChild(roomLocation);
    gameInfo.insertBefore(locationDiv, textDiv);
    worldText.textContent = currentWorld;
    roomText.textContent = currentRoom;
};

beginBtn.addEventListener('click', () => {
    replaceButton();
    removeChildren(textDiv);
    appendGameText();
    setRoomLocation(entryPoint);
    setWorldLocation(worlds0);
    createLocationHeader();
});

function camelCase(str) { 
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) 
    { 
        return index == 0 ? word.toLowerCase() : word.toUpperCase(); 
    }).replace(/\s+/g, ''); 
}

function getInput() {
    let input = document.getElementById("player-input").value;
    input = input.toLowerCase();
    return input;
}

function makeArray() {
    input = getInput();
    let inputArray = input.split(' ');
    return inputArray;
}

function getGeneralAspect(array) {
    let str = ""
    for (let i = 1; i < array.length; i++) {
        str = str + array[i] + " ";
    }
    let trimmedStr = str.trim();
    let camelStr = camelCase(trimmedStr);
    return camelStr;
}

function getSpeakerAspect(array) {
    let str = ""
    for (let i = 2; i < array.length; i++) {
        str = str + array[i] + " ";
    }
    let trimmedStr = str.trim();
    let camelStr = camelCase(trimmedStr);
    return camelStr;
}

function getGivenAspect(array) {
    let toIndex = array.indexOf('to')
    let str = ""
    for (let i = 1; i < toIndex; i++) {
        str = str + array[i] + " ";
    }
    let trimmedStr = str.trim();
    let camelStr = camelCase(trimmedStr);
    return camelStr;
}

function getReceiver(array) {
    let toIndex = array.indexOf('to')
    let str = ""
    for (let i = toIndex + 1; i < array.length; i++) {
        str = str + array[i] + " ";
    }
    let trimmedStr = str.trim();
    let camelStr = camelCase(trimmedStr);
    return camelStr;
}

function getAspect1(array) {
    let withIndex = array.indexOf('with')
    let str = ""
    for (let i = 1; i < withIndex; i++) {
        str = str + array[i] + " ";
    }
    let trimmedStr = str.trim();
    let camelStr = camelCase(trimmedStr);
    return camelStr;
}

function getAspect2(array) {
    let withIndex = array.indexOf('with')
    let str = ""
    for (let i = withIndex + 1; i < array.length; i++) {
        str = str + array[i] + " ";
    }
    let trimmedStr = str.trim();
    let camelStr = camelCase(trimmedStr);
    return camelStr;
}



playerInterface.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        determineAction();
    }
});

function getName() {
    
}

function showRoomDescription(room) {
    gameText.textContent = room.description;
}

function enterRoom(aspect) {
    currentRoom = aspect;
    setRoomLocation(currentRoom);
    showRoomDescription(currentRoom);
}

function walkDirection(aspect) {
    if (aspect === 'none' || directionalAccess === 'false') {
        gameInfo.textContent = "There's nothing in that direction.";
    } else {
        enterRoom(aspect);
    }
    if (aspect.walkFunction) {
        aspect.walkFunction();
    }
}

function examineAspect(aspect) {
    console.log(aspect);
    textDiv.innerHTML = aspect.description;
    if (aspect.examinationFunction) {
        aspect.examinationFunction();
    }
}

function takeAspect(aspect) {
    textDiv.innerHTML = aspect.takeText;
    playerCharacter.inventory[aspect] = aspect;
    delete currentRoom.objects.aspect;
    if (aspect.takeFunction) {
        aspect.takeFunction();
    }
}

function openAspect(aspect) {
    textDiv.innerHTML = aspect.openText;
    if (aspect.openFunction) {
        aspect.openFunction();
    }
}

function pushAspect(aspect) {
    textDiv.innerHTML = aspect.pushText;
    if (aspect.pushFunction) {
        aspect.pushFuntion();
    }
}

function pullAspect(aspect) {
    textDiv.innerHTML = aspect.pullText;
    if (aspect.pullFunction) {
        aspect.pullFunction();
    }
}

function talkToAspect(aspect) {
    if (aspect.dialogue.length > 1) {
        textDiv.innerHTML = aspect.dialogue[0];
        aspect.removedDialogue.push(aspect.dialogue[0]);
        aspect.dialogue.shift();
    } else {
        textDiv.innerHTML = aspect.dialogue[0]; 
    }
    if (aspect.talkFunction) {
        aspect.talkFunction();
    }
}

function giveFunction(aspect, receiver) {
    if (!playerCharacter.inventory.includes(aspect)) {
        textDiv.innerHTML = "You don't have that object with you."
    } else {
        if (!receiver.receivable.includes(aspect)) {
            textDiv.innerHTML = receiver.wontTakeText;
        } else if (receiver.receivable.includes(aspect)) {
            receiver.inventory.push(aspect);
            let aspectIndex = playerCharacter.inventory.indexOf(aspect);
            playerCharacter.inventory.splice(aspectIndex, 1);
        }
    }
}

function determineAction() {
    inputArray = makeArray();
    console.log(inputArray);
    let aspect = ""
    if (inputArray[0] === "walk") {
        aspect = inputArray[1];
        console.log(aspect);
        walkDirection(aspect);
    } else if (inputArray[0] === "examine") {
        aspect = getGeneralAspect(inputArray);
        console.log(aspect)
        examineAspect(aspect);
    } else if (inputArray[0] === "take") {
        aspect = getGeneralAspect(inputArray);
        takeAspect(aspect);
    } else if (inputArray[0] === "open") {
        aspect = getGeneralAspect(inputArray);
        openAspect(aspect);
    } else if (inputArray[0] === "push") {
        aspect = getGeneralAspect(inputArray);
        pushAspect(aspect);
    } else if (inputArray[0] === "pull") {
        aspect = getGeneralAspect(inputAray);
        pullAspect(aspect);
    } else if (inputArray[0] === "talk" && inputArray[1] === "to") {
        aspect = getSpeakerAspect(inputArray);
        talkToAspect(aspect);
    } else if (inputArray[0] === "give") {
        let aspect = getGivenAspect(inputArray);
        let receiver = getReceiver(inputArray);
        giveAspect(aspect, receiver);
    } else if (inputArray[0] === "use") {
        let aspect1 = getAspect1(inputArray);
        let aspect2 = getAspect2(inputArray);
        useAspect(aspect1, aspect2);
    } else if (inputArray[0] === "?") {
        if (inputArray.length > 1) {
            aspect = getGeneralAspect(inputArray);
            getHelpWith(aspect);
        } else {
            getHelp();
        }
    }
}