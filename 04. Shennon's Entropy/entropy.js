var s = WScript.StdIn.ReadLine();
var h = 0;
var alph = "";
var p = [];

// создание алфавита
for (i = 0; i < s.length; i++) {
    if (alph.indexOf(s.charAt(i)) == -1) {
        alph += s.charAt(i); 
        p[s.charAt(i)] = 1;
    } else {
        p[s.charAt(i)]++;
    }
}

// подсчет энтропии
for (i = 0; i < alph.length; i++) {
    p[alph.charAt(i)] = p[alph.charAt(i)] / s.length;
    h += p[s.charAt(i)] * LogBase(p[s.charAt(i)], alph.length);
}

h = -h;
WSH.Echo("Entropy is: " + (alph.length == 1 ? 0 : h));

WSH.Echo("Alphabet and frequency of each symbol: ");
for (var i = 0; i < alph.length; i++)
    WSH.Echo("\'" + alph.charAt(i) + "\': " + p[alph.charAt(i)]);
WSH.Echo();

function LogBase(x, b) {
    return Math.log(x) / Math.log(b);
}