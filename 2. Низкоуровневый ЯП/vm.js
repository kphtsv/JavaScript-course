var FSO = new ActiveXObject("Scripting.FileSystemObject");

var accum = 0;
var logaccum = false;
var ip = 0;

var codeFile = FSO.OpenTextFile("factorial_code.txt", 1);
var inputFile = FSO.OpenTextFile("factorial_input.txt", 1);
var outputFile = FSO.CreateTextFile("factorial_output.txt", 1);
var inputContents = inputFile.ReadAll().split(' ');

var mem = SplitCode(codeFile);
for (var i = mem.length; i < 110; i++)
    mem[i] = 0;

SolveTask();

codeFile = FSO.OpenTextFile("nod_code.txt", 1);
inputFile = FSO.OpenTextFile("nod_input.txt", 1);
outputFile = FSO.CreateTextFile("nod_output.txt", 1);
inputContents = inputFile.ReadAll().split(' ');
mem = SplitCode(codeFile);

for (var i = mem.length; i < 110; i++)
    mem[i] = 0;

SolveTask();

codeFile.Close();
inputFile.Close();
outputFile.Close();

function SplitCode(codeFile) {
    var line = "";
    var memory = []

    while (line != "end") {
        line = codeFile.readline()
        lineParts = line.replace('\t\t', ' ').replace('\t', ' ').split(' ');
        for (part in lineParts)
            if ('.' + lineParts[part] + '.' != '..')
                memory.push(lineParts[part])
    }

    return memory;
}

function SolveTask() {    
    accum = 0;
    logaccum = false;
    ip = 0;

    while (mem[ip] != "end")
        DoCommand();
}

function DoCommand() {
    if (mem[ip] == "input") {
        if (mem[ip + 1] < 103) { // ввод для факториала
            d = inputContents[0];
            if (!isNaN(d))
            {
                if (d < 0 || !IsInteger(d)) {
                    outputFile.WriteLine("Incorrect type of input data.");
                    mem[ip] = "end";
                }
                else if (d > 170) {
                    outputFile.WriteLine("Number in the input is too large.");
                    mem[ip] = "end";
                }
                else {
                    if (d == 0 || d == 1) {
                        outputFile.WriteLine("1");
                        mem[ip] = "end";
                    }
                    else mem[mem[ip + 1]] = d;
                }
            }
            else {
                outputFile.WriteLine("Incorrect type of input data.");
                mem[ip] = "end";
            }
        }
        else { // ввод для НОД
            d = inputContents[mem[ip + 1] % 2];
            if (isNaN(d) || !IsInteger(Math.abs(d))) {
                outputFile.WriteLine("Incorrect type of input data.");
                mem[ip] = "end";
            }
            else if (d == 0) {
                outputFile.WriteLine("LCM for 0 is undefined.");
                mem[ip] = "end";
            }
            else if (d < 0) {
                mem[mem[ip + 1]] = -d;
            }
            else 
                mem[mem[ip + 1]] = d;
        }
    } 
    else if (mem[ip] == "init")
        mem[mem[ip + 1]] = mem[ip + 2];
    else if (mem[ip] == "inc")
        mem[mem[ip + 1]]++;
    else if (mem[ip] == "mult")
        accum *= mem[mem[ip + 1]];
    else if (mem[ip] == "init_accum")
        accum = mem[ip + 1];
    else if (mem[ip] == "cmpeq")
        logaccum = mem[mem[ip + 1]] == mem[mem[ip + 2]];
    else if (mem[ip] == "iftrue") {
        ip++;
        if (logaccum) {
            do {
                DoCommand();
            } while (mem[ip] != "else" && mem[ip] != "end"); 
            while (mem[ip] != "endiftrue" && mem[ip] != "end") {
                ip++;
            }
        }
        else {
            do {
                ip++;
            } while (mem[ip] != "else");
            do {
                DoCommand();
            } while (mem[ip] != "endiftrue" && mem[ip] != "end");
        }
    }
    else if (mem[ip] == "jmpf") {
        var jumpExit = mem[ip + 1];
        ip += 2;
        while (mem[ip] != jumpExit) {
            ip++;
        }
    }
    else if (mem[ip] == "cmplarger")
        logaccum = mem[mem[ip + 1]] > mem[mem[ip + 2]];
    else if (mem[ip] == "cmpsmaller")
        logaccum = mem[mem[ip + 1]] < mem[mem[ip + 2]];
    else if (mem[ip] == "add")
        accum += mem[mem[ip + 1]];
    else if (mem[ip] == "subtr")
        accum -= mem[mem[ip + 1]];
    else if (mem[ip] == "ainit")
        mem[mem[ip + 1]] = accum;
    else if (mem[ip] == "reset_acc")
        accum = 0;
    else if (mem[ip] == "cmpneq")
        logaccum = mem[mem[ip + 1]] != mem[mem[ip + 2]];
    else if (mem[ip] == "jmpb") {
        var jumpExit = mem[ip + 1];
        while (mem[ip] != jumpExit){
            ip--;
        }
    }
    else if (mem[ip] == "output")
        outputFile.WriteLine(mem[mem[ip + 1]]);
    
    if (mem[ip] != "end")
        ip++;
}

function IsNumber(str) {
    for (i = 0; i < str.length; i++)
        if (str.charCodeAt(i) < "0".charCodeAt(0) || str.charCodeAt(i) > "9".charCodeAt(0))
            return false;
    return true;
}

function IsInteger(num) {
    return (num ^ 0) == num;
}