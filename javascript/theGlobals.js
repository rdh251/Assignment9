/*
Ross Hall
ross_hall@student.uml.edu
UMass Lowell Computer Science Student
COMP 4610 GUI Programming 1
Assignment No.9: Implementing a Bit of Scrabble Using Drag and Drop
12/18/2018

Description: This file contains all the globals used for keeping 
track of the state of the scrabble game. The system I used is
hectic but it works. In the future I would like to switch to a
more elegant system using a bit map to keep track of the state 
of the board rather than an assortmant of arrays.   
*/

/*************************************************
 * Store counts for letters in pile
 ************************************************/
let letter_dict = {
    'A': {
        'count' : 9,
        'score' : 1
    },
    'B': {
        'count' : 2,
        'score' : 3
    },
    'C': {
        'count' : 2,
        'score' : 3
    },
    'D': {
        'count' : 4,
        'score' : 2
    },
    'E': {
        'count' : 12,
        'score' : 1
    },
    'F': {
        'count' : 2,
        'score' : 4
    },
    'G': {
        'count' : 3,
        'score' : 2
    },
    'H': {
        'count' : 2,
        'score' : 4
    },
    'I': {
        'count' : 9,
        'score' : 1
    },
    'J': {
        'count' : 1,
        'score' : 8
    },
    'K': {
        'count' : 1,
        'score' : 5
    },
    'L': {
        'count' : 4,
        'score' : 1
    },
    'M': {
        'count' : 2,
        'score' : 3
    },
    'N': {
        'count' : 6,
        'score' : 1
    },
    'O': {
        'count' : 8,
        'score' : 1
    },
    'P': {
        'count' : 2,
        'score' : 3
    },
    'Q': {
        'count' : 1,
        'score' : 10
    },
    'R': {
        'count' : 6,
        'score' : 1
    },
    'S': {
        'count' : 4,
        'score' : 1
    },
    'T': {
        'count' : 6,
        'score' : 1
    },
    'U': {
        'count' : 4,
        'score' : 1
    },
    'V': {
        'count' : 2,
        'score' : 4
    },
    'W': {
        'count' : 2,
        'score' : 4
    },
    'X': {
        'count' : 1,
        'score' : 8
    },
    'Y': {
        'count' : 2,
        'score' : 4
    },
    'Z': {
        'count' : 1,
        'score' : 10
    },
    '_': {
        'count' : 2,
        'score' : 0
    }
}

let total_score = 0;

/******************************************
 *  Board State Data Structures
 ******************************************/
let filled = [];  // All drop locations that contain a tile
let currentTurn = [];  // All drop location from the current turn
let dropSetGame = ['H8'];  // All legal drop location for game in total 
let dropSetTurn = [];  // All legal drop location in the current turn

let turnDirection = 'all';  // x or y direction, turn specific
/*--------------------------------------------------------
  Flags indicate situations that need to be handled differently */
let firstLetterOfTurn = true;
let firstTurn = true;
let secondTurn = false;

/*------------------------------------------------------------
 prev used to stored data as turn progresses in case of reset */
let prev_filled = [];
let prev_dropSetGame = ['H8'];
let prev_dropSetTurn = [];
let prev_firstTurn = true;
let prev_secondTurn = false;

// easier to increment letters using index of array
let colLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

