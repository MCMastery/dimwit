var index = window.location.href.indexOf("?");
console.log(index);
if (index >= 0) {
    code = window.location.href.substring(index + 1);
    document.getElementById("code").value = code;
}