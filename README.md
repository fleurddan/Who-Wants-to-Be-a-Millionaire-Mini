# Who Wants to Be a Millionaire – Web Quiz Game

A front-end quiz game inspired by *Who Wants to Be a Millionaire*, developed using **vanilla JavaScript** with a clear separation of structure, style, and behavior.

## Overview
This project demonstrates the implementation of a state-driven quiz game, focusing on core JavaScript logic, DOM manipulation, and controlled user interactions without relying on external libraries.

## Easy Access
https://fleurddan.github.io/Who-Wants-to-Be-a-Millionaire-Mini/

## Features
- Multiple-choice question system  
- Prize ladder and scoring logic  
- Lifeline mechanics (hint/help logic) => (the original lifelines: 50:50 Phone and Audience)
- Dynamic UI updates based on game state  
- Responsive and clean user interface  

## Tech Stack
- **HTML5** – semantic structure  
- **CSS3** – layout, styling, and responsiveness  
- **JavaScript (ES6+)** – game logic and state management  

## Project Structure
```
User Interaction
│
▼
index.html
│
▼
DOM Event Listeners
│
▼
script.js
│
├── Game State
│ ├── currentQuestionIndex
│ ├── currentPrize
│ └── lifelineStatus
│
├── Question Engine
│ ├── validateAnswer()
│ └── nextQuestion()
│
└── UI Renderer
├── updateQuestion()
├── updateOptions()
└── updatePrizeLadder()
│
▼
style.css
│
▼
Visual Output
```
## Game Logic
- Questions are stored as structured objects  
- The current question index and prize state are tracked internally  
- User answers are validated against the correct option  
- Lifelines modify available choices without mutating the core dataset  
- UI is updated in real time according to state changes  

## How to Run
No build or installation required.

1. Clone or download the repository  
2. Open `index.html` in a modern web browser  

## Project Goals
- Practice clean and readable JavaScript  
- Strengthen DOM manipulation and event-driven programming skills  
- Model a small-scale interactive system  

## Future Improvements
- External question source (JSON or API)  
- Timer-based gameplay  
- Accessibility enhancements (ARIA support)  
- Unit testing for game logic  


