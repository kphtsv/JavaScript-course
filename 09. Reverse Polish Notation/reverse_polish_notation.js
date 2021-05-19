// Test: (a+b*c)*(a-b)/(d-(a+b*d))
priority = {
    '(' : 0,
    ')' : 0,
    '+' : 1,
    '-' : 1,
    '*' : 2,
    '/' : 2
};

var s = WScript.StdIn.ReadLine();
var rpnExpression = getReversePolishNotation(s);

if (rpnExpression == null) {
    WSH.Echo("Incorrect bracket order.");
} else {
    var input = WScript.StdIn.ReadLine(); // a 100 b 25 ...
    var varsDictionary = getVarsDictionary(input);

    var result = getResult(rpnExpression, varsDictionary);
    WSH.Echo(rpnExpression);
    WSH.Echo(result);
}

function getVarsDictionary(input) {
    var data = input.split(' ');
    var dictionary = [];
    for (var i = 0; i < data.length; i += 2)
        dictionary[data[i]] = data[i + 1];
    return dictionary;
}

function isOperation(c) {
    return priority[c] != undefined;
}

function getReversePolishNotation(s) {
    var res = "";
    var stack = [];
    var bracketControl = 0;

    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (isOperation(c)) {
            if (c == '(') {
                stack.push(c);
                bracketControl++;
            }
            else if (c == ')') {
                bracketControl--;
                if (bracketControl < 0) return null;
                while (stack[stack.length - 1] != '(')
                    res += stack.pop();
                stack.pop(); //  выталкиваем '('
            }
            else if (priority[c] > priority[stack[stack.length - 1]])
                stack.push(c);
            else {
                while (priority[stack[stack.length - 1]] >= priority[c])
                    res += stack.pop();
                stack.push(c);
            }
        } else res += c;
    }

    if (bracketControl > 0) return null;

    while (stack.length > 0)
        res += stack.pop();
    
    return res;
}

function getResult(exp, vars) {
    var stack = [];
    for (var i = 0; i < exp.length; i++) {
        var c = exp.charAt(i);
        if (isOperation(c)) {
            stack.push(calculate(stack.pop(), stack.pop(), c));
        } else {
            stack.push(vars[c]);
        }
    }
    return stack.pop();
}

function calculate(x, y, operation) { // ret: y op x
    var a = Number(x);
    var b = Number(y);

    switch (operation) {
        case '+':
            return b + a;
        case '-':
            return b - a;
        case '*':
            return b * a;
        case '/':
            if (a == 0)
                return undefined;
            return b / a;
    }
}