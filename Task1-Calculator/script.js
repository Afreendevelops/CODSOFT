const display = document.getElementById('display');
let memory = 0;
let lastResult = 0;

// Add keyboard support with improved mapping
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (event.ctrlKey && key === 'm') {
    memory = parseFloat(display.value) || 0;
    return;
  }
  if (event.ctrlKey && key === 'r') {
    appendValue(memory.toString());
    return;
  }
  
  switch(key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '+':
    case '-':
    case '*':
    case '/':
    case '%':
    case '.':
      appendValue(key);
      break;
    case 'Enter':
      calculate();
      break;
    case 'Backspace':
      deleteChar();
      break;
    case 'Escape':
      clearDisplay();
      break;
  }
});

function clearDisplay() {
  display.value = '';
  lastResult = 0;
}

function deleteChar() {
  display.value = display.value.slice(0, -1);
}

function appendValue(value) {
  // Handle special cases after calculation
  if (lastResult !== 0 && !isOperator(value)) {
    display.value = '';
    lastResult = 0;
  }

  // Prevent multiple operators in a row
  const lastChar = display.value.slice(-1);
  if (isOperator(lastChar) && isOperator(value)) {
    if (value === '-' && (lastChar === '*' || lastChar === '/')) {
      // Allow negative numbers after * or /
      display.value += value;
    } else {
      display.value = display.value.slice(0, -1) + value;
    }
    return;
  }

  // Prevent multiple decimal points in a number
  if (value === '.' && getCurrentNumber().includes('.')) {
    return;
  }

  // Prevent leading zeros
  if (value === '0' && display.value === '0') {
    return;
  }

  display.value += value;
}

function calculate() {
  try {
    if (!display.value) return;

    // Replace % operator with /100
    let expression = display.value.replace(/(\d+)%/g, '($1/100)');
    
    // Validate expression
    if (!/^[-0-9+/*().%\s]+$/.test(expression)) {
      throw new Error('Invalid characters');
    }

    // Evaluate and round to 8 decimal places
    const result = eval(expression);
    
    if (!isFinite(result)) {
      throw new Error('Division by zero');
    }

    lastResult = result;
    display.value = Number(result.toFixed(8)).toString();

  } catch (error) {
    display.value = 'Error';
    setTimeout(clearDisplay, 1000);
  }
}

function isOperator(char) {
  return ['+', '-', '*', '/', '%'].includes(char);
}

function getCurrentNumber() {
  return display.value.split(/[-+/*]/).pop();
}

// Add memory functions
function memoryAdd() {
  memory += parseFloat(display.value) || 0;
}

function memorySubtract() {
  memory -= parseFloat(display.value) || 0;
}

function memoryRecall() {
  display.value = memory.toString();
}

function memoryClear() {
  memory = 0;
}