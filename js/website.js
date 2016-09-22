var index = window.location.href.indexOf("?");
if (index >= 0) {
    code = window.location.href.substring(index + 1);
    document.getElementById("code").value = code;
    updateSize();
}

function updateSize() {
    document.getElementById("size").innerHTML = document.getElementById("code").value.length;
}