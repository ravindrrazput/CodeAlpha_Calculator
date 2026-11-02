// Get display elements
const currentOperand = document.getElementById("currentOperand");
const previousOperand = document.getElementById("previousOperand");

// Get all calculator buttons
const buttons = document.querySelectorAll(".btn");

// Calculator state
let expression = "";
let justCalculated = false;


// Update calculator display
function updateDisplay() {

    currentOperand.textContent = expression || "0";

    previousOperand.textContent = "";

}


// Add a number
function addNumber(number) {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    expression += number;

    updateDisplay();

}


// Add decimal point
function addDecimal() {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    const currentNumber = expression.split(/[+\-*/]/).pop();

    if (currentNumber.includes(".")) {
        return;
    }

    if (expression === "" || /[+\-*/]$/.test(expression)) {
        expression += "0";
    }

    expression += ".";

    updateDisplay();

}


// Add mathematical operator
function addOperator(operator) {

    if (expression === "" && operator !== "-") {
        return;
    }

    justCalculated = false;

    if (/[+\-*/]$/.test(expression)) {

        expression = expression.slice(0, -1);

    }

    if (expression === "" && operator === "-") {
        expression = "-";
    } else {
        expression += operator;
    }

    updateDisplay();

}


// Clear everything
function clearCalculator() {

    expression = "";
    justCalculated = false;

    updateDisplay();

}


// Delete last character
function deleteNumber() {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    } else {
        expression = expression.slice(0, -1);
    }

    updateDisplay();

}


// Calculate result
function calculateResult() {

    if (expression === "" || /[+\-*/.]$/.test(expression)) {
        return;
    }

    try {

        // Allow only calculator characters
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Cannot divide by zero");
        }

        previousOperand.textContent = expression + " =";

        expression = String(
            Number.parseFloat(result.toPrecision(12))
        );

        currentOperand.textContent = expression;

        justCalculated = true;

    } catch (error) {

        currentOperand.textContent = "Error";

        expression = "";
        justCalculated = true;

    }

}


// Button click events
buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;
        const value = button.dataset.value;

        switch (action) {

            case "number":
                addNumber(value);
                break;

            case "operator":
                addOperator(value);
                break;

            case "decimal":
                addDecimal();
                break;

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteNumber();
                break;

            case "calculate":
                calculateResult();
                break;

        }

    });

});


// Keyboard support
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (/^[0-9]$/.test(key)) {

        addNumber(key);

    } else if (["+", "-", "*", "/"].includes(key)) {

        addOperator(key);

    } else if (key === ".") {

        addDecimal();

    } else if (key === "Enter" || key === "=") {

        event.preventDefault();
        calculateResult();

    } else if (key === "Backspace") {

        deleteNumber();

    } else if (key === "Escape") {

        clearCalculator();

    }

});