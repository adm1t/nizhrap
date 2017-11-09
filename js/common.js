var artists = ["adm1t", "Morfo", "Варчун", "YASNO", "НичегоЛичного", "Nikelle", "ИNkkи", "Наби Набат", "Ира PSP", "shaMan", "NEW FLAVA", "Крэк", "БУУ", "Сэйн", "DeGo",
    "KOSTA TKACH", "Prosche", "badCurt", "Лито", "DoppDopp", "TIPPY YOUNG", "ПАФИ", "Dos-Vi-Dos", "da_Souza", "Спарцмен", "M.A.D.Mike", "MODI", "накурикота", "Bafff",
    "post haze", "Vitya GOOD", "МЁРФИ TRILLV", "САНСКРИТ", "OBSCURE", "психамир", "Кейси R.O", "COMEBAND", "Стичи", "Souse", "Сатанидзе", "#YOLOGANG", "Сорока",
    "thompson", "Матвей Ерагалин"];

var accessToken = "aeafd4ccaeafd4ccaeafd4cc6eaef08e55aaeafaeafd4ccf4af71ba184e0b01f39b1342";

var quote = { text: "", author: "", img: "" };
var artist;

var button = { artist: "", isTrue: false };

var progress = 0;
var quotes = new Set();

var hash = window.location.hash.substring(1);
//var accessToken = hash.substr(hash.indexOf('access_token=')).split('&')[0].split('=')[1];
var request = "https://api.vk.com/method/wall.search?domain=nnrapchik&v=5.68";

function getRandomNumber(maxN){
    return Math.floor(Math.random()*maxN);
}

function getRandomArtist(artistsArray){
    return artistsArray[getRandomNumber(artistsArray.length)];
}

function resetScreen(){

    $(".quote-block")[0].innerHTML = "";

    $(".answers-container .btn").each(function() {

        this.setAttribute("class", "btn btn-outline-primary");
        this.removeAttribute("disabled");
        this.blur();
        this.innerText = "";
        this.innerText = "";
    });

}

function getRandomQuote(){

    resetScreen();

    artist = getRandomArtist(artists);
    var script = document.createElement('SCRIPT');
    script.src = request + "&query=%23НижРэп_Цитата%20" + artist + "&access_token=" + accessToken + "&callback=callbackFunc";
    document.getElementsByTagName("head")[0].appendChild(script);
}

function callbackFunc(result) {

    if("response" in result){

        var response = result.response;
        var count = response.count;
        var post, postText;

        if (count > 0){

            post = response.items[getRandomNumber(count)];

            var postImg = post.attachments[0].photo;
            var imgUrl = getImgUrl(postImg);

            postText = post.text;

            if (checkPostText(postText, artist) != null){

                if (!quotes.has(quote.text)){

                    quote.img = imgUrl;
                    quotes.add(quote.text);

                    var str = '<pre>' + quote.text + '</pre>';
                    var html = $.parseHTML(str);
                    $(".quote-block")[0].prepend(html[0]);

                    calcRightPadding();
                    genButtons();

                    gettingAnswer();
                }
                else setTimeout(function() { getRandomQuote(); }, 500);
            }
            else setTimeout(function() { getRandomQuote(); }, 500);
        }
        else setTimeout(function() { getRandomQuote(); }, 500);
    }
    else setTimeout(function() { getRandomQuote(); }, 500);

};

function getImgUrl(postImg){

    var propNamesArr = Object.getOwnPropertyNames(postImg);
    var sizes = new Set();

    propNamesArr.forEach(function(item, i) {

        if (item.indexOf("photo_") != -1){

            sizes.add(parseInt(item.substr(6)));
        }
    });

    var maxSize = getMaxOfArray(Array.from(sizes));

    return postImg["photo_" + maxSize];
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function checkPostText(postText, artist){

    var copyrightPosition = postText.indexOf("©");
    var quoteText = postText.substring("#НижРэп_Цитата".length, copyrightPosition).trim();
    if (postText.substr(copyrightPosition).toUpperCase().indexOf(artist.toUpperCase()) != -1){
        quote.text = cutOffQuotes(quoteText);
        quote.author = artist;
        return quote;
    }
    else return null;
}

function calcRightPadding(){
    var blockHeight = $(".quote-block").height();
    $(".quote-block").css("background-size", blockHeight - 10).css("padding-right", blockHeight + 10);
}

function cutOffQuotes(str){
    var reg = /"|«|»|“/;
    if (reg.test(str[0])){
        str = str.substring(1);
    }
    if (reg.test(str[str.length - 1])){
        str = str.substring(0, str.length - 1)
    }
    return str.trim();
}

function genButtons(){
    var buttons = [];
    var numOfTrueAnswer = getRandomNumber(4);
    var artistSet = new Set(artists);
    artistSet.delete(quote.author);

    buttons[numOfTrueAnswer] = {
        //index: numOfTrueAnswer,
        artist: quote.author,
        isTrue: true
    };

    for (i = 0; i < 4; i++){
        if (i != numOfTrueAnswer){
            var randomArtist = getRandomArtist(Array.from(artistSet));
            artistSet.delete(randomArtist);
            buttons[i] = {
                artist: randomArtist,
                isTrue: false
            }
        }
    }

    buttons.forEach(function(currentValue, index) {
        $(".answers-container > .btn")[index].setAttribute("data-is-true", currentValue.isTrue);
        $(".answers-container > .btn")[index].innerText = currentValue.artist;
    });
}

getRandomQuote(artist);

var allowMistake = false;

function gettingAnswer(){

    $(".answers-container > .btn").click(function (e) {

        if (this.getAttribute("data-is-true") == "true"){

            if (allowMistake){ allowMistake = false; }

            this.setAttribute("class", "btn btn-success");

            progress++;
            $(".progress-bar")[0].style.width = (progress * 10) + "%";

            if(progress == 10){

                setTimeout(function() { showFinalModal(successfulFinal); }, 1000);
            }
            else{
                setTimeout(function() { getRandomQuote(); }, 1000);
            }
        }
        else{

            this.setAttribute("class", "btn btn-danger");

            if (allowMistake){

                allowMistake = false;
                setTimeout(function() { gettingAnswer(); }, 1000);

            }
            else{
                setTimeout(function() { showFinalModal(lostFinal); }, 1000);
            }
        }

        e.stopImmediatePropagation();

    });
}


$(".btn.help[data-helptype=50to50]").click(function () {

    var selector = ".answers-container>.btn[data-is-true=false]";

    for (i = 0; i < 2; i++){

        var thisElement = $(selector)[getRandomNumber($(selector).length)];

        thisElement.setAttribute("class", "btn disabled");
        thisElement.setAttribute("disabled", "disabled");
        thisElement.removeAttribute("data-is-true");

    }

    this.setAttribute("disabled", "disabled");

});

$(".btn.help[data-helptype=photohelp]").click(function () {

    $("#myModal").modal("show");

    $("#myModal").on("shown.bs.modal", function (e) {

        $(".modal-title")[0].innerText = "Фотоподсказка";
        $(".modal-body")[0].innerHTML = "<img src=" + quote.img + " class=\"img-fluid\">";
        $(".modal-footer")[0].style.display = "none";

    });

    $("#myModal").on("hidden.bs.modal", function (e) {

        $(".modal-title")[0].innerText = "";
        $(".modal-body")[0].innerHTML = "";

    });

    this.setAttribute("disabled", "disabled");

});

$(".btn.help[data-helptype=margin-for-error]").click(function () {

    allowMistake = true;
    this.setAttribute("disabled", "disabled");

});

$(".btn.help[data-helptype=exchange]").click(function () {

    setTimeout(function() { getRandomQuote(); }, 1000);
    this.setAttribute("disabled", "disabled");

});

function showFinalModal(finalVariant){

    $("#myModal").modal("show");

    $("#myModal").on("shown.bs.modal", function (e) {

        $(".modal-footer")[0].style.display = "flex";

        $(".modal-title")[0].innerText = finalVariant.title;

        $(".modal-body")[0].classList.add("final-modal-body");
        $(".modal-body")[0].innerHTML = "" +

            "<div class='final-img-container'><img src=\"img/" + finalVariant.imgName + ".png\" class=" + finalVariant.imgName + "></div>" +
            "<div class='final-text'>" + finalVariant.mainText + "</div>"

        $(".modal-footer button")[0].innerText = finalVariant.buttonText;

        $(".modal-footer button").click(function (e) {

            location.reload();
            e.stopImmediatePropagation()

        });
    });

    $("#myModal").on("hidden.bs.modal", function (e) { window.location.href = "index.html"; });

};

var successfulFinal = {
    title: "Поздравляю!",
    imgName: "medal",
    mainText: "Ты успешно угадал(а) авторов всех 10/10 цитат и теперь можешь гордо носить звание знатока \"Нижегородского Рэпчика\"",
    buttonText: "Начать заново"
};

var lostFinal = {
    title: "Это фиаско, братан :[",
    imgName: "sadly",
    mainText: "К сожалению, в это раз ты проявил(а) себя недостаточно хорошо. Не расстраивайся. Попробуй еще раз, и у тебя обязательно всё получится!",
    buttonText: "Попробовать снова"
};
