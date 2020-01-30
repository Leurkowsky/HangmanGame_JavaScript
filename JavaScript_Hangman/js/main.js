function include(path){
    document.write('<script src="'+path+'"></script>');
}
include("js/data.js");

var categoryID = 0;
var difficultyID = 0;
var failedCount = 0;
var found = 0;
var counterWin=0;
var counterLose=0;
var word = "";
var spaceCount;

$("a[data-section]").on("click", function(){
    let section = $(this).attr("data-section");
    $('section').hide();
    $('.section__' + section).show();
});

$(document).ready(function(e){
    for(let i = 0; i < categories.length; i++){
        $('[name="kategorie"]').append("<option value='"+i+"'>"+categories[i]+"</option>");
    }
    for(let i = 0; i < difficulties.length; i++){
        $('[name="trudnosc"]').append("<option value='"+i+"'>"+difficulties[i]+"</option>");
    }
});

function startGame(){
    categoryID = $('[name="kategorie"]').val();
    difficultyID = $('[name="trudnosc"]').val();

    $("#categoryname").html(categories[categoryID]);
    $(".player1__start").hide();
    $(".player1__gameplay").show();

    /* Losujemy słowo */
    let dlugosc = words[categoryID][difficultyID].length;
    let los = Math.floor(Math.random() * (dlugosc - 0) ) + 0;
    word = words[categoryID][difficultyID][los];

    /* Insertujemy literka po literce elementy */
    for(let i = 0; i < word.length; i++){
        let str = "";
        str = "<div class='word' data-letter='"+word[i]+"'";
        if(word[i] == " "){
            str = str + "style='border: none;'";
        }
        str = str + "><span>"+word[i]+"</span></div>";

        $(".game__word").append(str);
    }
    $(".word > span").css("opacity", "0");

    /* Prezentacja alfabetu */
    for(let i = 0; i < alphabet.length; i ++){
        $(".game__alphabet").append('<button class="letter_'+alphabet[i]+'" onClick="letter(\''+alphabet[i]+'\')">'+alphabet[i]+'</button>');
    }

    //Zliczanie spacji
    spaceCount = parseInt($(".word[data-letter=' ']").length);
}

function letter(l)
{
    let wordSpan = $('.word[data-letter="'+l+'"] span');
    let button = $('.letter_'+l);
    if(button.attr("data-clicked") != 'true' && failedCount < 8){
        button.attr("data-clicked", 'true');
        if(wordSpan.length > 0 ){

            wordSpan.css("opacity", "1");
            found += parseInt(wordSpan.length);
            
            if(found == ($(".word span").length - spaceCount)){
                playSound("win");
                setTimeout(function(){
                    showSummary(true, "Wygrałeś!");
                }, 1000);
            }
        }
        else {
            // Nie ma takiej litery, błąd            
            failedCount += 1;
            $('.game__image').css("background-image", "url(images/hang" + failedCount + ".png)");

            if(failedCount >= 8){
                playSound("lose");
                setTimeout(function(){
                    showSummary(false, "Przegrałeś!");
                }, 1000);
            }
        }
    }
}

function showSummary(winloose, alertText){
    $('section').hide();
    $('.section__summary').show();

    /* Zliczanie ilosci wygrany/przegranych */
    if(winloose == true){
        counterWin ++;
    }
    else{
        counterLose ++;
    }
    
    $('.summary__category').html(categories[categoryID]);
    $('.summary__word').html(word);
    $('.summary__win').html(counterWin);
    $('.summary__lose').html(counterLose);

    $(".player1__start").show();
    $(".player1__gameplay").hide();

    $('.game__image').css('background', "");
    $('.game__word').html('');
    $('.game__alphabet').html('');
    failedCount = 0;
    found = 0;

}

$(document).keypress(function(event){ 
    if($('.player1__gameplay').is(":visible") == true){
        var key = (event.keyCode ? event.keyCode : event.which); 
        var ch = String.fromCharCode(key).toUpperCase();
        if(jQuery.inArray(ch, alphabet) !== -1){
            letter(ch);
        }
    }   
});

function playSound(filename){
    if($(".settings__audio").is(":checked") == true){
        var mp3Source = '<source src="' + filename + '.mp3" type="audio/mpeg">';
        $("body").append('<audio autoplay="autoplay">' + mp3Source + '</audio>');
    }
  }
