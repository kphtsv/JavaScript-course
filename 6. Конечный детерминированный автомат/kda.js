var s = WSH.StdIn.ReadLine();
var t = WSH.StdIn.ReadLine();
var m = t.length
var alphabet = [];

// определяем алфавит строки t
for (var i = 0; i < m; i++)
    alphabet[t.charAt(i)] = 0;

// в statesTable храним таблицу переходов
var statesTable = new Array(m + 1);
for (var j = 0; j <= m; j++)
    statesTable[j] = new Array();

// инициализация таблицы переходов
for(var symb in alphabet)
    statesTable[0][symb] = 0;

// формирует таблицу переходов
for (var j = 0; j < m; j++) {
    prevState = statesTable[j][t.charAt(j)];
    statesTable[j][t.charAt(j)] = j + 1; // по дефолту устанавливаем состояние перехода j-го символа в (j + 1)-ый символ
    for (var symb in alphabet)
        statesTable[j + 1][symb] = statesTable[prevState][symb];
}

// выводим таблицу переходов
for (var j = 0; j <= m; j++) {
    var out = '';
    for (var i in alphabet)
        out += statesTable[j][i] + ' ';
    WSH.echo(out);
}

var positions = [];
var state = 0;

for (var i = 0; i < s.length; i++) {
    if (!statesTable[state][s.charAt(i)]) {
        statesTable[state][s.charAt(i)] = 0;
    }
    state = statesTable[state][s.charAt(i)];
    if (state == t.length) // найдено совпадение
        positions.push(i - t.length + 1);
}

if (positions.length == 0)
    WSH.echo('Substring not found');
else WSH.echo(positions);