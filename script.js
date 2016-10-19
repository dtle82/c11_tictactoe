/**
 * Created by danh on 10/18/16.
 */
var cell_template = function(parent,counter){
    var self = this;
    this.parent = parent;
    this.element = null;
    this.symbol = null;
    this.create_self = function(){
        this.element = $("<div>",
            {
                class:'ttt_cell',
                html: counter
            }
        ).click(this.cell_click);
        return this.element;
    };

    this.cell_click = function(){
        if(self.element.hasClass('selected')){
            return;
        }
        var qParse = questionArray[randomIndex].split("<br>");
        var qdiv = $("<div>",{
            html: qParse[0]
        });

        // var q_array = [];
        // for(i=0;i<=3;i++) {
        //     q_array.push($("<div id='"+i+"'>").text(i));
        // }
        // q_array.join('');


        calltimer();
        count = 10; // this resets the counter
        $("#question").html('');
        $("#answer").html('');
        $("#question").append(qdiv);
        //$("#question_area").append(q_array);
        $("#answer").append(answerArray[randomIndex]);
        //console.log('this cell clicked',self.element);
        var current_player = self.parent.get_current_player();
        self.symbol = current_player.get_symbol();
        console.log('current player\'s symbol: '+self.symbol);
        self.element.addClass('selected');
        self.change_symbol(self.symbol);
        self.parent.cell_clicked(self);
    };
    this.change_symbol = function(symbol){
        self.element.text(symbol);
    };
    this.get_symbol = function(){
        return self.symbol;
    };
};



var game_template = function(main_element){
    //console.log('game template constructor called');
    var self = this;
    this.element = main_element;
    this.cell_array = [];
    this.players = [];
    this.current_player = 0;
    //   0    1    2
    //   3    4    5
    //   6    7    8
    this.win_conditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    this.create_cells = function(cell_count){
        //console.log('game template create cells called');
        for(var i=0; i<cell_count; i++){
            var cell = new cell_template(this,i);
            var cell_element = cell.create_self();
            this.cell_array.push(cell);
            this.element.append(cell_element);
        }
    };
    this.create_players = function(){
        var player1 = new player_template('X', $('#player1'));
        var player2 = new player_template('O', $('#player2'));
        this.players.push(player1);
        this.players.push(player2);
        this.players[0].activate_player();
    };
    this.switch_players = function(){
        //console.log('current player before '+this.current_player);
        if(this.current_player){
            this.current_player=0;
        } else{
            this.current_player=1;
        }
        //console.log('current player before '+this.current_player);
    };
    this.get_current_player = function(){
        //console.log('current player is ',this.players);
        return this.players[this.current_player];
    };
    this.cell_clicked = function(clicked_cell){
        self.check_win_conditions();
        self.players[self.current_player].deactivate_player();
        self.switch_players();
        self.players[self.current_player].activate_player();

    };
    this.check_win_conditions = function(){
        //console.log('check win conditions called');
        var current_player_symbol = this.players[this.current_player].get_symbol();

        for(var i=0; i<this.win_conditions.length;i++){

            var count=0;
            //console.log('checking win conditions ',this.win_conditions);

            for(var j=0; j<this.win_conditions[i].length; j++){

                if(this.cell_array[this.win_conditions[i][j]].get_symbol() == current_player_symbol){
                    console.log('symbols match');
                    count++;
                    if(count==3){
                        console.log('someone won'); this.player_wins(this.players[this.current_player]);
                    }//end of count == 3
                } //end of symbols match
            } //end of inner loop
        } //end of outer loop
        //TODO check conditions
    };
    this.player_wins = function(player){
        console.log(player.get_symbol()+' won the game');
        alert(player.get_symbol()+' won the game');
    };
};

var player_template = function(symbol, element){
    //console.log('player constructor called');
    this.symbol = symbol;
    this.element = element;
    this.activate_player = function(){
        //console.log('activate player called');
        this.element.addClass('active_player');
    };
    this.deactivate_player = function(){
        this.element.removeClass('active_player');
    };
    this.get_symbol = function(){
        return this.symbol;
    };
};




var main_game = null;
$(document).ready(function(){
    apply_click_handlers()
    main_game = new game_template($('#gamebody'));
    main_game.create_cells(9);
    main_game.create_players();
});

function apply_click_handlers() {
    $("#submit").click(function(){
        var board_size = $("#board_size option:selected").val();
       console.log("board_size is ",board_size);

        var cell_width = 100/board_size;
        cell_width = cell_width.toFixed(2);
        cell_width = cell_width + "%";
        console.log("Cell width is " + cell_width);
        $("#gamebody").html("");
        main_game = new game_template($('#gamebody'));
        main_game.create_cells(board_size*board_size);
        main_game.create_players();
        $(".ttt_cell").css("width",cell_width);
        $(".ttt_cell").css("height",cell_width);
    });
}

var count=5;
function calltimer() {
    this.counter=setInterval(timer, 1000); //1000 will  run it every 1 second
}

function timer() {
    count = count - 1;
    if (count <= 0) {
        clearInterval(self.counter);
        //counter ended, do something here
    }
    if (count === 0) {
        alert("TIME OVER");
    }
    //Do code for showing the number of seconds here
    $("#timer h1").text(count);
    console.log(count);
}

var questionArray=['Veronica Smith<br> Mr. Thornton<br> U.S. History – Per. 2 <br>10 Sept. 2016,  Is this proper MLA heading?',
    ' Are in-text citations the same thing as parenthetical citations?',
    'Does MLA 8 allow you to underline, italicize, or bold the title of your paper?',
    'Choose the proper format for your MLA 8 paper',
    'Choose the correct way to list your sources on your Works Cited document',
    'Which method of indentation do you use on your works cited document when formatting your citations?',
    'A quote that goes over four lines of text:',
    'When do you cite a source in your paper?',
    'In this citation, what is the title of the book? <br> Barnaby, Benjamin. <em>Cool Science for Middle School Science Fairs</em>, Yale UP, 2010. ',
    'What type of source is this citation for? <br> Garner, Anthony. “History of 20th Century Literature.” <em>Literature Database</em>, www.litdb.com/history/20th-century.html. Accessed 16 Aug. 2016.',
    'If the reader of your paper wants more information on a source cited in-text, where do they look for more information?',
    'What type of source is this citation for? <br>Stanton, Daniel. “Methods of Analysis in Research Papers.” <em>Science of Informatics</em>, vol. 12, no. 2, 2011, pp. 2-15. JSTOR, doi:10.10.5.1/access_secure_doc#30892. Accessed 11 Oct. 2015.',
    'In this citation, what is the name of the publisher? Jones, Andrew. “The Cambodian Genocide.” <em>Genocide: A comprehensive introduction</em>, Routledge, 2006, pp. 40-60.',
    'In this citation, what does et al. stand for? Pearsall, Mitchell, et al. <em>A Concise History of Central America</em>, Cambridge UP, 2015.',
    ' When citing sources in your paper:',
    'In MLA 8, are you required to include page numbers at the top of your works cited and/or annotated bibliography pages?',
    'Where in your paper does your works cited go?',
    'What would be considered a ‘container’ in MLA 8?',
    'These are book citations. Which one is correct?',
    'When using NoodleTools to cite your sources, do you have to fill in every single box to get a proper citation? ',
    'When you block indent a direct quote, how many spaces or tabs do you use to indent? ',
    'When citing a web source, whether from a website or a database, do you include a URL in your citation?',
    'Which citation is correct?',
    'Which example is a proper in-text (parenthetical) citation?',
    'Is this the correct order to list these citations on your works cited? How do you know what order to put them in? ',
    'If a webpage citation has no author, what part of the citation do you use as the in-text or parenthetical citation?',
    'What is the password to log into the library website?'
];

var choicesArray=['Yes <br> No',
    'Yes <br> No',
    'Yes <br> No',
    '(a)Single-spaced, 12 pt. Arial font <br>(b)Double-spaced, 14 pt. Times New Roman font <br>(c)Double-spaced, 12 pt. Times New Roman font',
    '(a) List them in the order that they appear in your paper <br>(b) List them in alphabetical (A to Z) order.',
    '(a) Hanging indent <br>(b) block indent;',
    '(a)Is considered plagiarism <br>(b)Should be block indented.',
    '(a)When you directly quote someone or something <br>(b) When you interview someone and use something that they said <br>(c)When you use common knowledge – like ‘Water freezes at 32 degrees F’<br>(d)When you put a direct quote into your own words <br>(e)(a), (b), and (d) only. ',
    '(a) Barnaby, Benjamin <br> (b) Yale UP (c) 2010 <br>(d)<em>Cool Science for Middle School Science Fairs </em> ',
    '(a)A book on 20th Century Literature; <br>(b)A journal article in a database; <br>(c)A webpage',
    '(a)The Internet <br>(b)The index <br>(c)Your works cited document',
    '(a) Webpage <br> (b)JSTOR journal article <br> (c) Magazine',
    '(a) Routledge <br> (b) Jones,Andrew <br> (c)"The Cambrian Genocide" <br> (d) <em> Genocide:A Comprehenisve Introduction </em> <br> (e)2006 <br> (f) pp.40-60',
    '(a)The words et al. are a suffix to the author’s name; <br>(b)The words et al. mean ‘and others’, because there are more than three authors.<br>(c)The words et al. mean there are editors and authors for this book.',
    '(a)You only need to cite each source one time – no matter how often you use it;<br>(b)You should cite direct quotes at the end of the sentence where it is used.',
    '(a)No, only your paper needs to have page numbers; <br> (b)Yes, your paper, works cited, and annotated bibliography should have a running page number from the beginning of the document to the end.',
    '(a)On the same page right after the last paragraph of your paper;<br>(b)On page one of your document;<br>(c)On a separate page after your paper.',
    '(a)A TV show;<br>(b)A book;<br>(c)A journal;<br>(d)A website;<br>(e)A database;<br>(f)All of the above.',
    '(a)Baron, Sandra.<em>Yosemite National Park</em>. New York: Chelsea, 2010, pp. 2-10. <br>(b)Baron, Sandra.<em> Yosemite National Park</em>, Chelsea, 2010, pp. 2-10',
    '(a)Yes. That’s why the boxes are there. <br>(b)No. Only fill in the boxes necessary for the source you are citing.',
    '(a)Ten spaces or two tabs <br> (b)Five spaces or one tab.',
    '(a)No. URLs are long and messy and should never be included <br>(b)Yes! URLs are required by the new MLA 8 style.',
    '(a)Johnson, Betty. “Abstract Art.”<em> Modern Art – San Francisco</em>, 24 Jan. 2015, www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015. <br> (b)Johnson, Betty. “Abstract Art.”<em> Modern Art – San Francisco</em>, 24 Jan. 2015, http://www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015.',
    '(a)(239 Smith)<br>(b)(Smith, 239)<br>(c)(Smith, p. 239)<br>(d)(Smith 239)',
    '(a)Smith, John. “Modern World History.”<br> (b)Smith, John. “World History Overview.”',
    '(a)The webpage article title (which is in quotes)<br>(b)The publisher of the website;',
    '(a)lions<br>(b)library <br>(c)JSerra'
];

var answerArray=['No',
    'Yes',
    'No',
    '(c)Double-spaced, 12 pt. Times New Roman font',
    '(b)List them in alphabetical (A to Z) order.',
    '(a)Hanging indent',
    '(b)Should be block indented.',
    '(e)(a), (b), and (d) only.',
    '(d)<em>Cool Science for Middle School Science Fairs.</em> ',
    '(c)A webpage',
    '(c)Your works cited document',
    '(b)JSTOR journal article',
    '(a)Routledge',
    '(b)The words et al. mean ‘and others’, because there are more than three authors.',
    '(b)You should cite direct quotes at the end of the sentence where it is used.',
    '(b)Yes, your paper, works cited, and annotated bibliography should have a running page number from the beginning of the document to the end.',
    '(c)On a separate page after your paper.',
    '(f)All of the above.',
    '(b)Baron, Sandra.<em> Yosemite National Park</em>, Chelsea, 2010, pp. 2-10',
    '(b)No. Only fill in the boxes necessary for the source you are citing.',
    '(b)Five spaces or one tab.',
    '(b)Yes! URLs are now required by the new MLA 8 style.',
    '(a)Johnson, Betty. “Abstract Art.”<em> Modern Art – San Francisco</em>, 24 Jan. 2015, www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015.',
    '(d)(Smith 239)',
    '(a)Smith, John. “Modern World History.',
    '(a)The webpage article title (which is in quotes)',
    '(b)library'
];

//var categoryArray=['citation format','source format', 'source type', 'MLA 8 format','in-text citations','works cited','web citations','quotes','library'];
var categoryArray=['citation format','citation source', 'source type', 'MLA 8 format','MLA 8 styles','in-text citations','works cited','web citations','citation style'];
var categoryArray=['4, 5, 4, 3, 6, 6, 8, 1,    '];

//var categoryQuestions=[3, 4, 3, 3, 5, 5, 7, 5, 0, 2,4, 2, 0,0, 1, 3, 5, 3, 0, 1, 7, 6, 0, 4, 5, 4, 8 ];

var randomIndex = Math.floor(Math.random() * questionArray.length);
console.log(questionArray[randomIndex]);
console.log(questionArray[16]);
console.log(answerArray[16]);

// test