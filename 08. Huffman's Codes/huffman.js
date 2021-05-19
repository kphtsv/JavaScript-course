function node(name, frequency, used, code, parent)
{
    this.name = name;
    this.frequency = frequency;
    this.used = used;
    this.code = code;
    this.parent = parent;
}

var string = WScript.StdIn.ReadLine();
WSH.echo('String: ' + string);

var frequencies = [];
for (var i = 0; i < string.length; i++)
    frequencies[string.charAt(i)] = 0;
for (var i = 0; i < string.length; i++)
    frequencies[string.charAt(i)]++;

var tree = [];

WSH.Echo('Alphabet:')
for (var char in frequencies) 
{
    WSH.Echo(char + ' ' + frequencies[char]);
    n = new node(char, frequencies[char], false, '', null);
    tree.push(n);
}

var alphCount = tree.length;

for (var k = 0; k < alphCount - 1; k++) //выбираем символы с найменьшей частотностью для построения дерева
{
    var frequency1 = string.length;
    var num1 = 0;
    for (var i = 0; i < tree.length; i++)
        if (tree[i].frequency < frequency1 && !tree[i].used)
        {
            frequency1 = tree[i].frequency;
            num1 = i;
        }

    tree[num1].used = true;
    tree[num1].code = 0;
    tree[num1].parent = tree.length;

    var frequency2 = string.length;
    var num2 = 0;
    for (var i = 0; i < tree.length; i++)
        if (tree[i].frequency < frequency2 && !tree[i].used)
        {
            frequency2 = tree[i].frequency;
            num2 = i;
        }

    tree[num2].used = true;
    tree[num2].code = 1;
    tree[num2].parent = tree.length;

    n = new node(tree[num1].name + tree[num2].name, 
        tree[num1].frequency + tree[num2].frequency, false, '', null);
    tree.push(n);
}

var codeTable = [];
for (var i = 0; i < alphCount; i++){ // строим таблицу кодов 
    var j = i;
    codeTable[tree[i].name] = '';
    while (tree[j].parent) // пока не дошли до корня..
    {
        codeTable[tree[i].name] = tree[j].code + codeTable[tree[i].name]; // прибавляем код некоторого уровня по ветке в начало
        j = tree[j].parent;
    }
}

var code = '';
WSH.Echo('Code char: ')
for (var i in codeTable)
    WSH.Echo(i + ' ' + codeTable[i]);

for (var i = 0; i < string.length; i++)
    code += codeTable[string.substr(i, 1)];
WSH.echo('Code: ' + code);

var codeSymbol = '';
var decode = '';

for (var i = 0; i < code.length; i++)
{
    codeSymbol += code.charAt(i);
    for (var j in codeTable)
    {
        // линейный поиск нужного символа по коду
        if (codeTable[j] == codeSymbol)
        {
            decode += j;
            codeSymbol = '';
            break;
        }
    }
}

WSH.echo('Decode: ' + decode);