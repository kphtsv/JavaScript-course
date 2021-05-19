var FSO = new ActiveXObject("Scripting.FileSystemObject");
var input = FSO.OpenTextFile("input.txt").ReadAll();
outputFile = FSO.CreateTextFile("output.txt");

alphabet = "";
globalFrequencyTable = [];
InitializeGlobalFrequencyTable();

WSH.Echo("Enter shift:");
var encodeShift = Number(WScript.StdIn.ReadLine()) % alphabet.length;

Encode(input, encodeShift);
var strToDecode = FSO.OpenTextFile("output.txt", 1).ReadAll();
Decode(strToDecode);

outputFile.Close();

function InitializeGlobalFrequencyTable() {
    var tableFile = FSO.OpenTextFile("global_frequency_table.txt");
    var str = tableFile.ReadLine();
    while (str != ".") {
        var symbFrequencyPair = str.split(' ');
        alphabet += symbFrequencyPair[0];
        globalFrequencyTable[symbFrequencyPair[0]] = symbFrequencyPair[1];
        str = tableFile.ReadLine();
    }
    WSH.Echo(alphabet);
}

function Encode(strToEncode, shift) {
    if (shift < 0) {
        shift %= alphabet.length;
        shift = alphabet.length + shift;
    } else shift %= alphabet.length;

    // WSH.Echo(alphabet.length);
    WSH.Echo("shift:", shift);

    for (var i = 0; i < input.length; i++) {
        var c = strToEncode.charAt(i);
        if (alphabet.indexOf(c) != -1)
            outputFile.Write(alphabet.charAt(
                (alphabet.indexOf(c) + shift) % alphabet.length)); // !!!
        else
            outputFile.Write(c);
    }
}

function Decode(strToDecode) {
    var localFrequencyTable = [];

    for (var i = 0; i < alphabet.length; i++) {
        localFrequencyTable[alphabet.charAt(i)] = 0;
    }

    for (var i = 0; i < strToDecode.length; i++) {
        var c = strToDecode.charAt(i);
        if (localFrequencyTable[c] != undefined) {
            localFrequencyTable[c]++;
        }
    }

    for (var i = 0; i < alphabet.length; i++) {
        var c = alphabet.charAt(i);
        localFrequencyTable[c] /= strToDecode.length;
    }
    
    var min = Number.MAX_VALUE;
    var bestShift = 0;

    for (var shift = 0; shift < alphabet.length; shift++) {
        var sum = 0;
        for (var i = 1; i < alphabet.length; i++) {
            var tmp = globalFrequencyTable[alphabet.charAt((i + shift) % alphabet.length)] 
                - localFrequencyTable[alphabet.charAt(i)];
            sum += tmp * tmp;
        }
        if (sum <= min) {
            min = sum;
            bestShift = shift;
        }
    }
    
    WSH.Echo("Before proccessing:", bestShift);
    bestShift -= alphabet.length;

    outputFile.WriteLine("\n\n\n--------------------------------------------------------------------\n\n");

    WSH.Echo("Shift from decoding:", bestShift);
    Encode(strToDecode, bestShift);
}