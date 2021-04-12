var input = WScript.StdIn.ReadLine();
var minLength = 0;
var encodedStr = Encode(input);
WSH.Echo("Encoded str:", encodedStr);

WSH.Echo("Enter corrected line:");
var corrected = WScript.StdIn.ReadLine();

var incorrectPosition = Decode(corrected);
WSH.Echo(incorrectPosition);

function Prepare(str) {
    // возвращает строку с звёздочками на позициях степени двойки
    var exponent = 0;
    var result = "";
    var symbolsProccessed = 0;
    for (var i = 0; symbolsProccessed < str.length; i++) {
        if (i + 1 == 1 << exponent) {
            result = '*' + result;
            exponent++;
        } else {
            result = str.charAt(str.length - 1 - i + exponent) + result;
            symbolsProccessed++;
        }
    }
    minLength = exponent;
    return result;
}

function GetXorPositionsSum(str, startPos) {
    var sum = 0;
    for (var i = startPos; i < str.length; i++)
        if (str.charAt(str.length - 1 - i) == '1')
            sum = sum ^ (i + 1 - startPos);
    return sum;
}

function Encode(str) {
    str = Prepare(str);
    WSH.Echo("Prepared:", str, "; MinLen =", minLength);
    var controlBits = IntToBinaryString(GetXorPositionsSum(str, 0));
    while (controlBits.length < minLength)
        controlBits = '0' + controlBits;
    WSH.Echo("Control bits:", controlBits);
    
    var result = "";
    var exponent = 0; // содержит степень двойки
    var overallParity = 0;

    for (var i = 0; i < str.length; i++) {
        if (i + 1 == 1 << exponent) { 
            result = controlBits.charAt(minLength - 1 - exponent) + result;
            exponent++;
        } else result = str.charAt(str.length - 1 - i) + result;
        overallParity = Number(result.charAt(0)) ^ overallParity;
    }

    return result + String(overallParity);
}

function Decode(str) {
    var xorPositionsSum = GetXorPositionsSum(str, 1);

    var overallXorSum = 0;
    for (var i = str.length - 1; i >= 0; i--)
        overallXorSum = overallXorSum ^ Number(str.charAt(i));
    
    if (xorPositionsSum == 0 && overallXorSum == 0) return "No errors found.";
    if (xorPositionsSum != 0 && overallXorSum == 0) return "At least two errors!";
    return xorPositionsSum + 1;
}

function IntToBinaryString(x) {
    if (x == 0) return "0";

    var integer = x;
    var resultInt = "";
    while (integer > 0) {
        resultInt = String(integer % 2) + resultInt;
        integer = parseInt(integer / 2);
    }
    return resultInt;
}