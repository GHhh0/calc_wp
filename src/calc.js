import "./style.css"

let buffer = [];
const out = document.querySelector(".display p")

bufferUpdate("0", true)

function bufferUpdate(newValue, override) {
    const isDefaultValue = buffer.length === 1 && buffer[0] === "0";
    const isFloatSymbol = newValue !== ".";
    if (override || isDefaultValue && isFloatSymbol) {
        buffer = [newValue];
    } else {
        buffer.push(newValue);
    }
    out.textContent = buffer.join('');
}

document.querySelectorAll("[data-buffer-value]").forEach((element) => {
    element.onclick = () => {
        bufferUpdate(element.dataset.bufferValue);
    }
})

document.querySelector("[data-result]").onclick = () => {
    let result = calculate(buffer.join(""));
    if (Number.isInteger(result)) {
        result = result.toString().split();
    } else {
        result = result.toFixed(9).split();
    }
    bufferUpdate("0", true);
    result.forEach((element) => bufferUpdate(element));
}

document.querySelector("[data-all-clear]").onclick = () => {
    bufferUpdate("0", true);
}

document.querySelector("[data-delete]").onclick = () => {
    removeLastValue();
}

function removeLastValue() {
    buffer = buffer.slice(0, -1);
    out.textContent = buffer.join('');
}

function calculate(expression) {
    let tokens = expression.match(/\d+(\.\d+)?|[-+*/()]|\s+/g).filter(token => token.trim());

    let values = [];
    let ops = [];

    function applyOp(op) {
        let b = values.pop();
        let a = values.pop();
        switch (op) {
            case '+': values.push(a + b); break;
            case '-': values.push(a - b); break;
            case '*': values.push(a * b); break;
            case '/': values.push(a / b); break;
        }
    }

    function precedence(op) {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    }

    for (let token of tokens) {
        if (!isNaN(token)) {
            values.push(parseFloat(token));
        } else if (token === '(') {
            ops.push(token);
        } else if (token === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') {
                applyOp(ops.pop());
            }
            ops.pop();
        } else if (token === '+' || token === '-' || token === '*' || token === '/') {
            while (ops.length && precedence(ops[ops.length - 1]) >= precedence(token)) {
                applyOp(ops.pop());
            }
            ops.push(token);
        }
    }

    while (ops.length) {
        applyOp(ops.pop());
    }

    return values.pop();
}