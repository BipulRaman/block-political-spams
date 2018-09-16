var baseURL = "https://web.bipul.in/block-political-spams"
var xmlhttp = new XMLHttpRequest();
var blacklist;

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    return str;
}

var xTime = getFormattedDate();
var url = baseURL + "/app/data/blacklist.json?t=" + xTime;
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        blacklist = JSON.parse(this.responseText);
        Array.from(blacklist).forEach(function(eachItem){
            console.log(eachItem);
        });        
        setInterval(function () {
            removeSpamPost();
        }, 1000)
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function removeSpamPost() {
    try {
        var x = document.querySelectorAll("div[id^='hyperfeed_story_id_']");
        Array.from(x).forEach(function (element) {
            var xLinks = element.getElementsByTagName('a');
            var xLinks_ReportString = "";
            Array.from(xLinks).forEach(function (eachLink) {
                if (eachLink.href != '#' && xLinks_ReportString.includes(eachLink.href.split("?")[0]) == false && eachLink.href.includes('facebook.com/ajax') == false && eachLink.href.includes('facebook.com/l.php') == false && eachLink.href.includes('facebook.com/ufi') == false && eachLink.href.includes('facebook.com/photo.php') == false) {
                    xLinks_ReportString = xLinks_ReportString + eachLink.href.split("?")[0] + ";";
                }
            })
            var appendHTML = "<a name='fbFakeNewsReporter' style='padding-left:5px;' href='" + baseURL + "/app/?r=" + xLinks_ReportString + "' target='_blank'>Report Fake News</a>"
            if (element.querySelectorAll("div[id^='feed_subtitle_']")[0].innerHTML.includes('fbFakeNewsReporter') == false) {
                element.querySelectorAll("div[id^='feed_subtitle_']")[0].innerHTML = element.querySelectorAll("div[id^='feed_subtitle_']")[0].innerHTML + appendHTML;
            }
            Array.from(blacklist).forEach(function (item) {
                if (element.innerHTML.includes(item)) {
                    element.remove();
                    // element.style.backgroundColor = "yellow";
                }
            });
        });
    } catch (ex) {
        console.log('Error: ' + ex.message);
    }
}

