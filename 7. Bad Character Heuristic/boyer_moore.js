var s = WSH.StdIn.ReadLine();
var t = WSH.StdIn.ReadLine();

N = [];
for (var i = 0; i < t.length; i++)
    N[t.charAt(i)] = i + 1;

WSH.Echo("Entry positions:");

var index = 0;
while (index <= s.length - t.length) {
    var pos = t.length - 1; // pos -- первая позиция расхождения символов
    while (s.charAt(index + pos) == t.charAt(pos) && pos >= 0) {
        if (pos == 0)
            WSH.Echo(index + 1);
        pos--;
    }

    if (pos == -1)
        index += 1;
    else if (!N[s.charAt(pos + index)])
        index += pos + 1;
    else index += Math.max(1, t.length - N[s.charAt(pos + index)]);
}