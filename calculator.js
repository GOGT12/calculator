
const display = document.getElementById("display");

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mousedown", event => {
        event.preventDefault(); // Evita que los botones tomen el foco
        display.focus(); // Vuelve a darle el foco al input
    });
});

// Funciones

function appendToDisplay(character){
    const cursorPos = display.selectionStart;
    const beforeCursor = display.value.substring(0,cursorPos);
    const afterCursor = display.value.substring(cursorPos);
    display.value = beforeCursor + character + afterCursor;
    display.setSelectionRange(cursorPos + character.length, cursorPos + character.length);

}
function clearDisplay(){
    display.value = "";
}

function delDisplay(){
    display.value = display.value.slice(0,-1);
}

function equal(){
    let tokens = strToArray(display.value);
    console.log(tokens)
    let rpn = infixToRPN(tokens)
    console.log(rpn)
    let result = evaluarRPN(rpn)
    display.value = result
}

function leftArrow() {
    const cursorPos = display.selectionStart; // Obtén la posición actual del cursor
    if (cursorPos > 0) {
        display.setSelectionRange(cursorPos - 1, cursorPos - 1); // Mueve el cursor a la izquierda
    }
}


function rightArrow() {
    const cursorPos = display.selectionStart; // Obtén la posición actual del cursor
    if (cursorPos < display.value.length) {
        display.setSelectionRange(cursorPos + 1, cursorPos + 1); // Mueve el cursor a la derecha
    }
}



// str to tokens

function strToArray(expresion){
    const regex = /sqrt\[\d+\]\{\d+\}|\d+(\.\d+)?|[+\-*/()^]/g;

    return expresion.match(regex);
}


// tokens to Rpn
function infixToRPN(tokens) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    let output = [];
    let operators = [];

    for (let token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        } else if (token === "(") {
            operators.push(token);
        } else if (token === ")") {
            while (operators.length && operators[operators.length - 1] !== "(") {
                output.push(operators.pop());
            }
            operators.pop(); // Remove "("
        } else if (token.startsWith("sqrt[")) {
            operators.push(token.slice(0,7));
            let n = token.slice(8,-1)
            output.push(n)
        } else if (token in precedence) {
            while (operators.length && operators[operators.length - 1] !== "(" &&
                   precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    }

    while (operators.length) {
        output.push(operators.pop());
    }

    return output;
}

// Evaluar RPN
function evaluarRPN(tokens) {
    let pila = [];

    for (let token of tokens) {
        if (!isNaN(token)) {
            pila.push(parseFloat(token));
        } else if (token.startsWith("sqrt[")) {
            let n = parseFloat(token.slice(5, -1));
            let a = pila.pop();
            pila.push(Math.pow(a, 1 / n));
        } else {
            let b = pila.pop();
            let a = pila.pop();
            if (token === "+") pila.push(a + b);
            else if (token === "-") pila.push(a - b);
            else if (token === "*") pila.push(a * b);
            else if (token === "/") pila.push(a / b);
            else if (token === "^") pila.push(Math.pow(a, b));
        }
    }

    return pila[0];
}
