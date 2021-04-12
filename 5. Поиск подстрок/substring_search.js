var FSO = new ActiveXObject("Scripting.FileSystemObject");
maxPow = 0;
Main();

function Main() {
    var substrings = ["Prince Andrew", "Prince Andrew Bolkónski"];
    Test("war_and_peace14", substrings);

    var a100 = "";
    for (var i = 0; i < 100; i++)
        a100 += 'a';

    substrings = [a100 + 'b', 'b' + a100];
    // Test("a1e6", substrings);
}

function Test(testName, substrings) {
    var inputFile = FSO.OpenTextFile(testName + "_input.txt", 1);
    var input = inputFile.ReadAll();
    outputFile = FSO.CreateTextFile(testName + "_output.txt", 1, true);
    outputFile.WriteLine();

    for (var substrCount = 0; substrCount < substrings.length; substrCount++) {
        var substring = substrings[substrCount];
        maxPow = (1 << substring.length - 1);

        outputFile.WriteLine("= . = . =");
        outputFile.WriteLine();
        outputFile.WriteLine("Searching for substring \"" + substring + "\" in " + testName + "_input.txt");

        BruteForce(input, substring, outputFile);       
        for (var hashType = 1; hashType <= 3; hashType++)
            Hash(input, substring, outputFile, hashType);
    }

    inputFile.Close();
    outputFile.Close();
}

function ContainsSubstringBF(line, position, substring) {
    if (substring.length + position > line.length)
        return false;
    for (var i = 0; i < substring.length; i++)
        if (substring.charAt(i) != line.charAt(position + i))
            return false;
    return true;
}

function BruteForce(line, substring, outputFile) {
    outputFile.WriteLine();
    outputFile.WriteLine("- Brute force -");
    var allEntries = 0;
    var start = new Date().getTime();
    outputFile.Write("First 10 entries at: ");

    for (var i = 0; i <= line.length - substring.length; i++) {
        if (ContainsSubstringBF(line, i, substring)) {
            if (allEntries < 10)
                outputFile.Write(i + " ");
            allEntries++;
        }
    }

    var end = new Date().getTime();
    outputFile.WriteLine("\nAll entries: " + allEntries);
    outputFile.WriteLine("Time taken: " + (end - start) + "ms");
}

function GetHashByType(typeOfHash, line) {
    var hash = 0;
    var multiplier = 1;
    switch (typeOfHash) {
        case 1: // Сумма кодов символов
            for (var i = 0; i < line.length; i++)
                hash += line.charCodeAt(i);
            break;
        case 2: // Сумма квадратов кодов символов
            for (var i = 0; i < line.length; i++)
                hash += line.charCodeAt(i) * line.charCodeAt(i);
            break;
        default: // Рабин-Карп
            for (var i = line.length - 1; i >= 0; i--) {
                hash += multiplier * line.charCodeAt(i);
                multiplier = (multiplier << 1);
            }
            break;
    }
    return hash;
}

function GetShiftedHashByType(line, length, i, typeOfHash, hash) {
    var curHash = hash;
    var predecessingCharcode = line.charCodeAt(i - 1);
    var successingCharcode = line.charCodeAt(i + length - 1);

    switch (typeOfHash) {
        case 1:
            curHash -= predecessingCharcode;
            curHash += successingCharcode;
            break;
        case 2:
            curHash -= predecessingCharcode * predecessingCharcode;
            curHash += successingCharcode * successingCharcode;
            break;
        default:
            curHash -= predecessingCharcode * maxPow;
            curHash *= 2;
            curHash += successingCharcode;
            break;  
    }
    return curHash;
}

function Hash(line, substring, outputFile, typeOfHash) {
    var allEntries = 0; 
    var collisions = 0;
    var substringHash = GetHashByType(typeOfHash, substring);
    var length = substring.length;
    var curHash = GetHashByType(typeOfHash, line.substr(0, length));

    outputFile.WriteLine("\n- Hash type " + typeOfHash + " -");
    outputFile.Write("First ten entries: ");

    var start = new Date().getTime();
    for (var i = 1; i <= line.length - length; i++) {
        curHash = GetShiftedHashByType(line, length, i, typeOfHash, curHash);
        
        if (curHash == substringHash) {
            if (ContainsSubstringBF(line, i, substring)) {
                if (allEntries < 10)
                    outputFile.Write(i + " ");
                allEntries++;
            } else
                collisions++;
        }
    }
    var end = new Date().getTime();
    
    outputFile.WriteLine("\nAll entries: " + allEntries + "; Collisions: " + collisions);
    outputFile.WriteLine("Time taken: " + (end - start) + "ms");
}