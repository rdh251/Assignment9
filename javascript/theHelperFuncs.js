/*
Ross Hall
ross_hall@student.uml.edu
UMass Lowell Computer Science Student
COMP 4610 GUI Programming 1
Assignment No.9: Implementing a Bit of Scrabble Using Drag and Drop
12/18/2018

Description: This file contains the helper functions that assist the
main functions driving the scrabble game.   
*/

// creates the board with random placement of multipliers
function createBoard() {
    let the_board = document.getElementById('theBoard');
    let the_table = document.createElement("table");
    for (let i = 0; i < 15; i++) {
        let row = i + 1;
        let t_row = document.createElement('tr');
        for (let j = 0; j < 15; j++) {
            let col = colLetter[j];
            let t_cell = document.createElement('td');
            let id = col + row
            t_cell.setAttribute('id', id);
            t_cell.classList.add('drop');
            if (id === 'H8') {
                t_cell.classList.add('center');
            } else {
                let rand_class = Math.floor(Math.random() * 100) + 1;
                if (rand_class > 97) {
                    let p = document.createElement('p');
                    p.innerText = 'TRIPPLE WORD SCORE';
                    t_cell.append(p)
                    t_cell.classList.add('tws');
                }
                else if (rand_class > 94) {
                    let p = document.createElement('p');
                    p.innerText = 'DOUBLE WORD SCORE';
                    t_cell.append(p)
                    t_cell.classList.add('dws');
                }
                else if (rand_class > 90) {
                    let p = document.createElement('p');
                    p.innerText = 'TRIPPLE Letter SCORE';
                    t_cell.append(p)
                    t_cell.classList.add('tls');
                }
                else if (rand_class > 85) {
                    let p = document.createElement('p');
                    p.innerText = 'DOUBLE LETTER SCORE';
                    t_cell.append(p)
                    t_cell.classList.add('dls');
                }
            }
            t_row.append(t_cell);
        }
        the_table.append(t_row);
    }
    the_board.append(the_table);
}

/*********************************************************
 *  Creates the display for how many letter are left
*********************************************************/
function showChars() {
    let char = 'A';
    let ul = document.getElementById('charsLeft');
    for (i = 0; i < 26; i++) {
        let li = document.createElement('li');
        li.setAttribute('id', char);
        ul.append(li);
        char = nextChar(char);
    }
    let li = document.createElement('li');
    li.setAttribute('id', '_');
    ul.append(li);
}
function updateChars() {
    let char = 'A';
    for (i = 0; i < 26; i++) {
        $('#' + char).text(char + ': ' + letter_dict[char]['count']);
        char = nextChar(char);
    }
    $('#_').text('_' + ': ' + letter_dict['_']['count']);
}

/****************************************************************
 *  Letter Creation
 ****************************************************************/
// gets total number of letters in the pile
function getLetterTotal() {
    let letter = 'A';
    let letter_total = 0;
    for (let i = 0; i < 26; i++) {
        letter_total += letter_dict[letter]['count'];
        letter = nextChar(letter);
    }
    letter_total += letter_dict['_']['count'];
    return letter_total;
}
function getLetter() {
    let letter_total = getLetterTotal();
    if (letter_total === 0) {
        return null;
    }
    let number_selector = Math.floor(Math.random() * letter_total) + 1;
    let ranger = 0;
    letter = 'A';
    for (let i = 0; i < 26; i++) {
        ranger += letter_dict[letter]['count'];
        if (number_selector <= ranger) {
            letter_dict[letter]['count']--;
            return letter;
        }
        letter = nextChar(letter);
    }
    letter_dict['_']['count']--;
    return '_';
}
// replennish letter rack at end of turn
function refill() {
    unused_letters = document.getElementsByClassName('unused');
    for (let i = 0; i < unused_letters.length; i++){
        let left_pad = (i*45) + 5
        let style = "position:absolute;top:5px;left:" + left_pad + "px;";
        unused_letters[i].parentNode.setAttribute('style', style);
    }
    getLetters(7 - unused_letters.length);
}

// Take from:
https://stackoverflow.com/questions/43095621/how-to-increment-letters-in-javascript-to-next-letter
function nextChar(char) {
    let res = char == 'z' ? 'a' : char == 'Z' ? 'A' : String.fromCharCode(char.charCodeAt(0) + 1);
    return res
}

/********************************************************
 * dropId handling (ids correspond to table cells)
 ********************************************************/
function nextCol(c) {
    index = colLetter.indexOf(c);
    if (index === 14) {
        return null//colLetter[0];
    }
    return colLetter[index + 1];
}
function prevCol(c) {
    index = colLetter.indexOf(c);
    if (index === 0) {
        return null; //colLetter[14];
    }
    return colLetter[index - 1];
}
function nextRow(i) {
    if (i === 15) {
        return null; //1;
    }
    return i + 1;
}
function prevRow(i) {
    if (i === 1) {
        return null; //15;
    }
    return i - 1;
}
// gets id of table cell to the right
function getRightId(id) {
    let col = id.charAt(0);
    let row = parseInt(id.substring(1, id.length));
    return nextCol(col) + row;
}
// gets id of table cell down
function getDownId(id) {
    let col = id.charAt(0);
    let row = parseInt(id.substring(1, id.length));
    return col + nextRow(row);
}
// gets id of table cell left
function getLeftId(id) {
    let col = id.charAt(0);
    let row = parseInt(id.substring(1, id.length));
    return prevCol(col) + row;
}
// gets id of table cell up
function getUpId(id) {
    let col = id.charAt(0);
    let row = parseInt(id.substring(1, id.length));
    return col + prevRow(row);
}
// find the letter furthest to the left from current letter
function getLeftMost(id) {
    let left_id = getLeftId(id);
    if (filled.indexOf(left_id) === -1) {
        return id
    } else {
        return getLeftMost(left_id);
    }
}
function getTopMost(id) {
    let top_id = getUpId(id);
    if (filled.indexOf(top_id) === -1) {
        return id
    } else {
        return getTopMost(top_id);
    }
}
function getRightMost(id) {
    let right_id = getRightId(id);
    if (filled.indexOf(right_id) === -1) {
        return id
    } else {
        return getRightMost(right_id);
    }
}
function getDownMost(id) {
    let down_id = getDownId(id);
    if (filled.indexOf(down_id) === -1) {
        return id
    } else {
        return getTopMost(down_id);
    }
}
// gets cell id to North South East and West
function getQuad(id) {
    let col = id.charAt(0);
    let row = parseInt(id.substring(1, id.length));
    let theQuad = []
    theQuad[0] = col + prevRow(row);
    theQuad[1] = col + nextRow(row);
    theQuad[2] = nextCol(col) + row;
    theQuad[3] = prevCol(col) + row;
    return theQuad;
}
// scan functions collect words on board linearly from starting letter
function scanRight(id, word) {
    if (filled.indexOf(id) === -1) {
        return word
    } else {
        word += whatLetter(id);
        return scanRight(getRightId(id), word);
    }
}
function scanDown(id, word) {
    if (filled.indexOf(id) === -1) {
        return word
    } else {
        word += whatLetter(id);
        return scanDown(getDownId(id), word);
    }
}

/*********************************************************
 * functions for Game state handling on drops
 *********************************************************/
/* checks if tile placement is valid on board
*       first turn must be center
*       all letters must connect to main structure
*       one direction per turn
*       no tiles on top of eachother
*/
 function isValidDrop(dropSet, id) {
    if (filled.indexOf(id) === -1) {
        for (let i = 0; i < dropSet.length; i++) {
            if (id == dropSet[i]) {
                return true;
            }
        }
    }
    return false;
}
// attemps to get turn direction based on where 
//      current tile was dropped
function getTurnDirection(id) {
    let theQuad = getQuad(id)
    let x = false;
    let y = false;
    for (let i = 0; i < 2; i++) {
        if (currentTurn.indexOf(theQuad[i]) !== -1) {
            return 'y';
        }
        if (filled.indexOf(theQuad[i]) !== -1) {
            y = true;
        }
    }
    for (let i = 2; i < 4; i++) {
        if (currentTurn.indexOf(theQuad[i]) !== -1) {
            return 'x';
        }
        if (filled.indexOf(theQuad[i]) !== -1) {
            x = true;
        }
    }
    if (x && y) {
        return 'all';
    } else if (x) {
        return 'x';
    } else {
        return 'y';
    }
}
// valid places to drop tiles on first move of turn
function updateDropSetGame(id) {
    let theQuad = getQuad(id);
    for (let i = 0; i < 4; i++) {
        if (dropSetGame.indexOf(theQuad[i]) === -1 &&
        filled.indexOf(theQuad[i] === -1)) {
            dropSetGame.push(theQuad[i]);
        }
    }
} 
// valid places to drop tiles within a given turn
function updateDropSetTurn(id, dirStr) {
    if (dirStr === 'all') {
        let top_id = getTopMost(id);
        top_id = getUpId(top_id);
        if (dropSetTurn.indexOf(top_id) === -1) {
            dropSetTurn.push(top_id);
        }
        let bot_id = getDownMost(id);
        bot_id = getDownId(bot_id);
        if (dropSetTurn.indexOf(bot_id) === -1) {
            dropSetTurn.push(bot_id);
        } 
        let left_id = getLeftMost(id);
        left_id = getLeftId(left_id);
        if (dropSetTurn.indexOf(left_id) === -1) {
            dropSetTurn.push(left_id);
        }
        let right_id = getRightMost(id);
        right_id = getRightId(right_id);
        if (dropSetTurn.indexOf(right_id) === -1) {
            dropSetTurn.push(right_id);
        } 
    }
    else if (dirStr === 'y') {
        let top_id = getTopMost(id);
        top_id = getUpId(top_id);
        if (dropSetTurn.indexOf(top_id) === -1) {
            dropSetTurn.push(top_id);
        }
        
        let bot_id = getDownMost(id);
        bot_id = getDownId(bot_id);
        if (dropSetTurn.indexOf(bot_id) === -1) {
            dropSetTurn.push(bot_id);
        } 
    }
    else if (dirStr === 'x') {
        let left_id = getLeftMost(id);
        left_id = getLeftId(left_id);
        if (dropSetTurn.indexOf(left_id) === -1) {
            dropSetTurn.push(left_id);
        }
        
        let right_id = getRightMost(id);
        right_id = getRightId(right_id);
        if (dropSetTurn.indexOf(right_id) === -1) {
            dropSetTurn.push(right_id);
        } 
    }
}
// adjust dropset once direction is determined
function fixDropSetTurn(id, direction){
    if (direction === 'x') {
        dropSetTurn = dropSetTurn.filter(function(value, index, arr) {
            let row = id.substring(1, id.length);
            if (value.substring(1, id.length) == row) {
                return true;
            }
        });
    } else {
        dropSetTurn = dropSetTurn.filter(function(value, index, arr) {
            let col = id.charAt(0);
            if (value.charAt(0) == col) {
                return true;
            }
        });
    }
}
// called for each turn
function storeGameState() {
    prev_dropSetGame = dropSetGame.slice();
    prev_dropSetTurn = dropSetTurn.slice();
    prev_filled = filled.slice();
    prev_firstTurn = firstTurn;
    prev_secondTurn = secondTurn;
}

// gets the letter placed on a cell with given id
function whatLetter(id) {
    let classes = $('#' + id).attr('class').split(' ');
    return classes[classes.length - 1];
}

//gets score with multipliers from board
function getWordScore(word, id, direction) {
    let score = 0;
    let dws = 0;
    let tws = 0;
    if (direction === 'right') {
        for (let i = 0; i < word.length; i++) {
            let val = letter_dict[word[i]]['score'];
            let cell_class = getCellClass(id);
            if (cell_class === 'tws') {
                tws++;
            }
            else if (cell_class === 'dws') {
                dws++;
            }
            if (cell_class === 'tls') {
                val *= 3;
            }
            if (cell_class === 'dls') {
                val *= 2;
            }
            score += val;
            id = getRightId(id);
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            let val = letter_dict[word[i]]['score'];
            let cell_class = getCellClass(id);
            if (cell_class === 'tws') {
                tws++;
            }
            else if (cell_class === 'dws') {
                dws++;
            }
            if (cell_class === 'tls') {
                val *= 3;
            }
            if (cell_class === 'dls') {
                val *= 2;
            }
            score += val;
            id = getDownId(id);
        }
    }
    while (dws) {
        score *= 2;
        dws--;
    }
    while (tws) {
        score *= 3;
        tws--;
    }
    return score;
}
// used to determine which multiplier to apply
function getCellClass(id) {
    cell_classes =  $('#' + id).attr('class').split(' ');
    if (cell_classes.indexOf('tws') !== -1){
        return 'tws';
    }
    if (cell_classes.indexOf('dws') !== -1){
        return 'dws';
    }
    if (cell_classes.indexOf('tls') !== -1){
        return 'tls';
    }
    if (cell_classes.indexOf('dls') !== -1){
        return 'dls';
    }
}