/*
Ross Hall
ross_hall@student.uml.edu
UMass Lowell Computer Science Student
COMP 4610 GUI Programming 1
Assignment No.9: Implementing a Bit of Scrabble Using Drag and Drop
12/18/2018

Description: This file contains the main functions that drive
the functionality of the scrabble game.  
*/

$(document).ready(function () {
    // executes when HTML-Document is loaded and DOM is ready
    showChars();
    createBoard();
    getLetters(7);
});

/* This function defines the characterstics of draggable and droppable
objects. Most of the logic controlling where a user can place a tile 
on the board comes from the revert function */ 
function draggadrop() {
    $('.drag').draggable(
        {
            snap: '.drop',
            revert: function (dropped) { // this logic could be cleaned up to be more readable
                letter = $(this).attr('class').split(' ')[0];
                if (dropped) {
                    let dropId = dropped[0].id;
                    if (firstLetterOfTurn) {
                        if (isValidDrop(dropSetGame, dropId)) {
                            $(this).removeClass('unused');
                            $(this).addClass('thisTurn');
                            $(this).draggable('disable');
                            updateDropSetGame(dropId);
                            if (!secondTurn) {
                                if (!firstTurn) {
                                    if (turnDirection === 'all') {
                                        turnDirection = getTurnDirection(dropId);
                                    }
                                    fixDropSetTurn(dropId, turnDirection);
                                    //turnDirection = getTurnDirection(dropId);
                                    secondTurn = false;
                                    firstLetterOfTurn = false;
                                } else {
                                    firstTurn = false;
                                    secondTurn = true;
                                }
                            } else {
                                
                                if (turnDirection === 'all') {
                                    turnDirection = getTurnDirection(dropId);
                                }
                                //turnDirection = getTurnDirection(dropId);
                                if (turnDirection === 'x') {
                                    dropSetTurn = dropSetTurn.filter(function (value, index, arr) { return value !== 'H7' });
                                    dropSetTurn = dropSetTurn.filter(function (value, index, arr) { return value !== 'H9' });
                                }
                                if (turnDirection === 'y') {
                                    dropSetTurn = dropSetTurn.filter(function (value, index, arr) { return value !== 'I8' });
                                    dropSetTurn = dropSetTurn.filter(function (value, index, arr) { return value !== 'G8' });
                                }
                                secondTurn = false;
                                firstLetterOfTurn = false;
                            }
                            updateDropSetTurn(dropId, turnDirection);
                            filled.push(dropId);
                            currentTurn.push(dropId);
                            $('#' + dropId).addClass(letter)
                            return false;
                        } else {
                            if (firstTurn) {
                                $('#err').text('The first tile played must be placed in the yellow center square.');
                            } else {
                                $('#err').text('Illegal tile placement.');
                            } 
                        }
                    } else {
                        if (isValidDrop(dropSetTurn, dropId)) {
                            $(this).removeClass('unused');
                            $(this).addClass('thisTurn');
                            $(this).draggable('disable');       
                            if (turnDirection === 'all') {
                                turnDirection = getTurnDirection(dropId);
                                fixDropSetTurn(dropId, turnDirection);
                            }
                            updateDropSetGame(dropId);
                            updateDropSetTurn(dropId, turnDirection);
                            filled.push(dropId);
                            currentTurn.push(dropId);
                            $('#' + dropId).addClass(letter)
                            return false;
                        } else {$('#err').text('Illegal tile placement.');}
                    }
                }
                return true;
            }
        }
    );
    // taken from:
    //https://stackoverflow.com/questions/26589508/centering-draggable-elements-inside-droppable-using-jquery-ui
    $(".drop").droppable({
        drop: function (event, ui) {
            var $this = $(this);
            ui.draggable.position({
                my: "center",
                at: "center",
                of: $this,
                using: function (pos) {
                    $(this).animate(pos, "fast", "linear");
                }
            });
        }
    });
}

// Takes n letter from the pile and places them on the rack
function getLetters(n) {
    let theRack = document.getElementById('theRack');
    let offset = 5 + ((7-n) *45)
    for (let i = 0; i < n; i++) {
        let letter = getLetter();
        if (letter === null) {
            alert('There are no more Letters.');
            draggadrop();
            updateChars();
            return;
        }
        let imgDiv = document.createElement('div');
        img = document.createElement('img');
        img.setAttribute('class', letter);
        imgDiv.setAttribute('class', 'imgDiv');
        //imgDiv.classList.add('float');
        let left_pad = (i*45) + offset
        let style = "position:absolute;top:5px;left:" + left_pad + "px;";
        imgDiv.setAttribute('style', style);
        let imgSrcStr = 'imgs/Scrabble_Tile_' + letter + '.jpg';
        img.src = imgSrcStr
        img.classList.add('drag');
        img.classList.add('unused');
        imgDiv.append(img);
        theRack.append(imgDiv);
    }
    draggadrop();
    updateChars();
}

// dumps letters from rack on to pile and gets 7 new letters
function dumpLetters() {
    if (!firstLetterOfTurn || secondTurn) {
        $('#err').text('You cannot dump your letters in the middle of your turn.');
        return;
    }
    unused_letters = document.getElementsByClassName('unused');
    while (unused_letters.length) {
        letter = unused_letters[0].classList[0];
        letter_dict[letter]['count']++;
        unused_letters[0].parentNode.remove();
    }
    getLetters(7);
}

// Looks for new words and saves current state to begin new turn. 
function endTurn() {
    if (secondTurn || firstTurn || !currentTurn.length){
        $('#err').text('A word must be at least two characters long.');
        resetTurn();  
        return; 
    }
    let left_id;
    let top_id;
    let new_word;
    let score;
    if (turnDirection === 'x') {
        left_id = getLeftMost(currentTurn[0]);
        new_word = scanRight(left_id, "");
        if (new_word.length > 1) {
            score = getWordScore(new_word, left_id, 'right');
            li = document.createElement('li');
            li.innerText = new_word +': ' + score + 'pts';
            $('#wordList').append(li);
            total_score += score;
        }
        for (let i = 0; i < currentTurn.length; i++) {
            top_id = getTopMost(currentTurn[i]);
            new_word = scanDown(top_id, "");
            if (new_word.length > 1) {
                score = getWordScore(new_word, top_id, 'down');
                li = document.createElement('li');
                li.innerText = new_word +': ' + score + 'pts';
                $('#wordList').append(li);
                total_score += score;
            }
        }
    }
    if (turnDirection === 'y') {
        top_id = getTopMost(currentTurn[0]);
        new_word = scanDown(top_id, "");
        if (new_word.length > 1) {
            score = getWordScore(new_word, top_id, 'down');
            li = document.createElement('li');
            li.innerText = new_word +': ' + score + 'pts';
            $('#wordList').append(li);
            total_score += score;
        }
        for (let i = 0; i < currentTurn.length; i++) {
            left_id = getLeftMost(currentTurn[i]);
            new_word = scanRight(left_id, "");
            if (new_word.length > 1) {
                score = getWordScore(new_word, left_id, 'right');
                li = document.createElement('li');
                li.innerText = new_word +': ' + score + 'pts';
                $('#wordList').append(li);
                total_score += score;
            }
        }
    }
    if (turnDirection === 'all') { 
        for (let i = 0; i < currentTurn.length; i++) {
            top_id = getTopMost(currentTurn[i]);
            new_word = scanDown(top_id, "");
            if (new_word.length > 1) {
                score = getWordScore(new_word, top_id, 'down');
                li = document.createElement('li');
                li.innerText = new_word +': ' + score + 'pts';
                $('#wordList').append(li);
                total_score += score;
            }
        }
        for (let i = 0; i < currentTurn.length; i++) {
            left_id = getLeftMost(currentTurn[i]);
            new_word = scanRight(left_id, "");
            if (new_word.length > 1) {
                score = getWordScore(new_word, left_id, 'right');
                li = document.createElement('li');
                li.innerText = new_word +': ' + score + 'pts';
                $('#wordList').append(li);
                total_score += score;
            }          
        }
    }
    $('.thisTurn').removeClass('thisTurn');
    storeGameState();
    $('#score').text(total_score + 'pts');
    currentTurn = [];
    dropSetTurn = [];
    firstLetterOfTurn = true;
    turnDirection = 'all';
    refill();
}

// Recalls letter placed this turn back to the rack an reverts the dropsets
function resetTurn() {
    currentTurn = []
    dropSetGame = prev_dropSetGame.slice();
    dropSetTurn = prev_dropSetTurn.slice();
    filled = prev_filled.slice();
    firstTurn = prev_firstTurn;
    secondTurn = prev_secondTurn;
    firstLetterOfTurn = true;
    turnDirection = 'all';
// taken from:
// https://stackoverflow.com/questions/19971612/reset-jquery-draggable-object-to-original-position-by-clicking-a-button
    $('.thisTurn').css({"top":"", "left":""});
    
    $('.thisTurn').draggable('enable');
    $('.thisTurn').addClass('unused');
    $('.thisTurn').removeClass('thisTurn');

}

// starts a new game with a new board
function clearBoard() {
    let the_drags = document.getElementsByClassName('drag');
    while (the_drags.length) {
        letter = the_drags[0].classList[0];
        letter_dict[letter]['count']++;
        the_drags[0].parentNode.remove();
    }
    $('#theBoard').empty();
    createBoard();
    filled = [];
    currentTurn = [];
    dropSetGame = ['H8'];
    dropSetTurn = [];
    firstLetterOfTurn = true;
    firstTurn = true;
    secondTurn = false;
    turnDirection = 'all';
    let prev_filled = [];
    let prev_dropSetGame = ['H8'];
    let prev_dropSetTurn = [];
    let prev_firstTurn = true;
    let prev_secondTurn = false;
    total_score = 0;
    $('#score').text(total_score + 'pts');
    $('#wordList').empty();
    getLetters(7);
}
