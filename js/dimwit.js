var code, output, matrix, pushMode, separator1D, separator2D, vars, inLoop;
var loopStart, loopX, loopY;

function matrixToString() {
    var string = "";
    for (var x = 0; x < matrix.length; x++) {
        if (x > 0)
            string += separator2D;
        for (var y = 0; y < matrix[x].length; y++) {
            var value = matrix[x][y];
            string += value + separator1D;
        }
    }
    return string;
}

// 48 = '0'
function getVariableName(index) {
    return String.fromCharCode(48 + index)
}
function getNextBracket(code, start) {
    var nextBracketIndex = -1;
    for (var i = start; i < code.length; i++) {
        if (code.charAt(i) == '}') {
            nextBracketIndex = i;
            break;
        }
    }
    if (nextBracketIndex < 0)
        nextBracketIndex = code.length - 1;
    return nextBracketIndex;
}

function evaluate(code) {
    for (var i = 0; i < code.length; i++) {
        var char = code.charAt(i);
        if (pushMode && char != '`')
            matrix[matrix.length - 1].push(char);
        else {
            switch (char) {
                case '}':
                    break;
                // push characters to  last array in output until '`' is called again
                case '`':
                    pushMode = !pushMode;
                    break;
                // add new array
                case 'a':
                    matrix.push([]);
                    break;
                // pop array
                case 'A':
                    matrix.pop();
                    break;
                // if in loop, pops current index
                case 'i':
                    if (inLoop) {
                        matrix[loopY].splice(loopX, 1);
                        loopX--;
                    }
                    break;
                // pop first array
                case 'q':
                    matrix.splice(0, 1);
                    break;
                // loop through first array (usually would be the input)
                case 'l':
                    loopStart = i;
                    inLoop = true;
                    break;
                // end loop
                case 'L':
                    loop();
                    if (inLoop)
                        i = loopStart;
                    break;
                // pushes the currently looped value to the end of the last array
                case 'c':
                    if (inLoop)
                        matrix[matrix.length - 1].push(matrix[loopY][loopX]);
                    break;
                // end program and output false
                case 't':
                    matrix = [["false"]];
                    return;
                // end program and output true
                case 'T':
                    matrix = [["true"]];
                    return;
                // clears the matrix
                case 'x':
                    matrix = [[]];
                    break;
                // counts occurrences of given regex, in first array
                // also ignores case
                case 'r':
                    var nextBracketIndex = getNextBracket(code, i);
                    var regex = new RegExp(code.substring(i + 1, nextBracketIndex), 'gi');
                    i = nextBracketIndex;
                    var occurrences = 0;
                    for (var j = 0; j < matrix[0].length; j++)
                        if (matrix[0][j].match(regex))
                            occurrences++;
                    matrix[matrix.length - 1].push(occurrences);
                    break;
                // if inside loop, then checks if number is even
                // otherwise checks last value in array
                case 'e':
                    var value;
                    if (inLoop)
                        value = matrix[loopY][loopX];
                    else
                        value = matrix[matrix.length - 1][matrix[matrix.length - 1].length - 1];
                    var n = parseFloat(value);

                    var nextBracketIndex = getNextBracket(code, i);
                    if (!(n % 2 == 0))
                        i = nextBracketIndex;
                    break;
                // if inside loop, then checks if number is odd
                // otherwise checks last value in array
                case 'E':
                    var value;
                    if (inLoop)
                        value = matrix[loopY][loopX];
                    else
                        value = matrix[matrix.length - 1][matrix[matrix.length - 1].length - 1];
                    var n = parseFloat(value);

                    var nextBracketIndex = getNextBracket(code, i);
                    if (n % 2 == 0)
                        i = nextBracketIndex;
                    break;
            }

            // last character
            if (i == code.length - 1) {
                if (inLoop) {
                    loop();
                    if (inLoop)
                        i = loopStart;
                }
            }
        }
    }
}

function loop() {
    loopX++;
    if (loopX >= matrix[loopY].length) {
        inLoop = false;
        loopX = 0;
    }
}

function run() {
    matrix = [[]];
    var input = document.getElementById("input").value;
    var inputSplit = input.split("\n");
    for (var i = 0; i < inputSplit.length; i++) {
        if (i >= matrix.length)
            matrix.push([]);
        for (var j = 0; j < inputSplit[i].length; j++)
            matrix[i].push(inputSplit[i].charAt(j));
    }
    loopX = 0;
    loopY = 0;

    // indices of where each loop we're in starts
    loopStart = -1;
    vars = [];
    // 1 = inside 1 loop, >=2 = nested loops, etc.
    pushMode = false;
    code = document.getElementById("code").value;
    separator1D = "";
    separator2D = "\n";
    evaluate(code);
    output = matrixToString();
    document.getElementById("output").value = output;
}