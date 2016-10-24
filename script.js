/**
 * Created by danh on 10/18/16.
 */

var games_played = 0;
var player_x_wins = 0;
var player_o_wins = 0;

var cell_template = function(parent){
    var self = this;
    this.parent = parent;
    this.element = null;
    this.symbol = null;
    this.create_self = function(){
        this.element = $("<div>",
            {
                class:'ttt_cell',
                html: ""
            }
        ).click(this.cell_click);
        return this.element;
    };
    /*
     This method has been heavily modified to start our question and timer for our
     citation game.
     */
    this.cell_click = function(){
        if(self.element.hasClass('selected')){
            return;
        }
        this.outcome = false; // our outcome is set to false as default
        //debugger;

        $("#temp_placeholder").remove();

        var current_player = self.parent.get_current_player();
        //self.symbol = current_player.get_symbol();
        self.add_temp_placeholder(current_player.get_symbol());

        clearInterval(main_game.timeCounter); // stops the timer from counting down
        var randomIndex = Math.floor(Math.random() * (questionArray.length));
        //console.log(randomIndex);
        /*
         random generate a number between our question array length.
         Afterwards, takes the same random index and look at the choices array
         to take a string that will be split up via <br>
         This array will then be looped through to insert individual dom answers divs
         into our question section
         */
        var cParse = choicesArray[randomIndex].split("<br>");
        //var qParse = questionArray[randomIndex];
        var qdiv = $("<div>",{
            html: questionArray[randomIndex]
        });

        calltimer(self); // call our timer to pressure the opponent!
        count = 30; // this resets the counter
        $("#timer span").text(count);
        /*
         Clear all of our question and answer div to prep our board area
         */
        $("#question").html('');
        $("#answer").html('');
        $("#question").append(qdiv);
        //$("#question_area").append(q_array);
        for (var i = 0; i<cParse.length;i++) {
            $("#answer").append("<div id='a"+i+"' class='choices'>" + cParse[i] + "</div>");
        }
        $("#answer").off("click");
        /*
         To reduce double click, this turns off any click events on our answers div.
         This event handler grabs our users choice, takes the element and reads the
         text.  After woulds it compares if their choices matches the answer array
         by key index.  If matches assigns a green_advice class below.  If not matches
         then it assigns a red_advice class.
         */
        $("#answer").on("click",".choices",function() {
            $("#temp_placeholder").remove();
            //console.log("random is " + randomIndex);
            var userChoice = $(this).text();
            $(this).addClass('answer_selected');
            //debugger;
            if(userChoice === answerArray[randomIndex])
            {
                //console.log($(this));
                $(this).addClass('green_advice');
                var coins = new Audio('assets/sounds/coins.mp3');
                coins.volume = 0.2;
                coins.play();
                // var advice = $("<div>", {
                //     class: "green_advice",
                //     text: answerArray[randomIndex]
                // });
                this.outcome = true;
                //$("#answer").append(advice);
                // var count_this = $(".choices").length;
                // console.log("count is " + count_this);
                // for(var i = 0;i<count_this;i++) {
                //
                //     $('.choices:eq('+i+')').hide(i*500);
                //
                // }
            } else { // When the user click on the wrong answer
                //console.log($(this));
                $(this).addClass('red_advice');
                var advice = $("<div>", {
                    class: "green_advice",
                    text: answerArray[randomIndex]
                });
                var count_this = $(".choices").length;
                // console.log("count is " + count_this);
                // for(var i = 0;i<count_this;i++) {
                //
                //     $('.choices:eq('+i+')').hide(i*500);
                //
                // }
                // $(".choices").hide(1000);
                $("#answer").append(advice);
                var wrong = new Audio('assets/sounds/wrong.mp3');
                //wrong.volume = 0.2;
                wrong.play();
                this.outcome = false;
            }

            //console.log("Time counter is " + main_game.timeCounter);
            clearInterval(main_game.timeCounter); // stops the timer again
            $('#timer').html("<span></span>");
            if(this.outcome) {
                /*
                 If outcome is true then assign the player symbol to the cell that was
                 clicked on.
                 */
                //debugger;
                var current_player = self.parent.get_current_player();
                self.symbol = current_player.get_symbol();
                //console.log('current player\'s symbol: '+self.symbol);
                self.element.addClass('selected');
                self.change_symbol(self.symbol);
                self.parent.cell_clicked(self,1); // run win condition check
            } else {
                /*
                 If outcome is false, calls function that does not assign a symbol,
                 does not checks for win conditions and switches players.
                 */
                self.incorrectAnswerAndSwitch();
            }
            $("#answer").off("click");
        });


    };

    this.incorrectAnswerAndSwitch = function() {
        /*
         This function runs just like a successful answer except does not add selected
         class and symbol.
         */
        self.parent.cell_clicked(self,0);

    };

    this.add_temp_placeholder = function(symbol){
        var inside = $("<div>",{
            id: 'temp_placeholder',
            class: 'inside_ttt blink_me transparent',
            html:symbol
        });
        //console.log("inside ",symbol);

        self.element.append(inside);
        run_blink();
    };

    this.change_symbol = function(symbol){
        //self.element.text(symbol);
        var inside = $("<div>",{
            class: 'inside_ttt',
            html:symbol
        });
        //console.log("Create! " + self.parent.board_size);
        self.element.append(inside);
        if(self.parent.board_size > 0 && self.parent.board_size <= 3) {
            //console.log("YES");
            //console.log("size is " + $(".inside_ttt").css("font-size"));
            $(".inside_ttt").css("font-size","9vh");
            //$(".inside_ttt").addClass("lg_font");
        } else if (self.parent.board_size > 3 && self.parent.board_size <= 8) {
            $(".inside_ttt").css("font-size","6vh");
            //$(".inside_ttt").addClass("md_font");
        } else if (self.parent.board_size > 8 && self.parent.board_size <= 12) {
            $(".inside_ttt").css("font-size","4vh");
            //$(".inside_ttt").addClass("sm_font");
        }
    };
    this.get_symbol = function(){
        return self.symbol;
    };
};

/*
 This function now accepts 3 parameters, the 2nd is for board size and the 3rd is the
 win condition
 */
var game_template = function(main_element,board_size,win_size){
    if (win_size === undefined)
    {
        win_size = 3;
    }
    //console.log('game template constructor called');
    var self = this;
    this.board_size = board_size;
    this.element = main_element;
    this.cell_array = [];
    this.players = [];
    this.current_player = 0;

    // TODO add properties to hold counter for player x wins, player o wins, total games played
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

    /*
     Hard coded win condition is overwritten with a function that dynamically generates
     the win conditions based on the user selected board size.
     */
    this.win_conditions = calculateWinConditionArray(board_size);

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
    this.cell_clicked = function(clicked_cell,nocheck){
        /*
         when 2nd param passed, do not check win condition so that the match
         counter does not move up!
         */
        if(nocheck)
        {
            self.check_win_conditions();
        }
        self.players[self.current_player].deactivate_player();
        self.switch_players();
        self.players[self.current_player].activate_player();

        //console.log("how many cells " + this.cell_array.length);
        this.total_cell = this.cell_array.length;
        //console.log("how many selected cells ", $(".selected").length);

        this.total_selected = $(".inside_ttt").length;
        if (this.total_cell === this.total_selected) {
            //console.log("TIE!");
            this.callTie();
        }

    };
    this.check_win_conditions = function(){
        //console.log('check win conditions called');
        var current_player_symbol = this.players[this.current_player].get_symbol();

        for(var i=0; i<this.win_conditions.length;i++){

            var count=0;
            //console.log('checking win conditions ',this.win_conditions);
            //console.log('cell array is',this.cell_array);
            this.applause = false;
            for(var j=0; j<this.win_conditions[i].length; j++){
                if(this.cell_array[this.win_conditions[i][j]].get_symbol() == current_player_symbol){
                    count++;
                    //console.log("Player " + current_player_symbol + ", i is: " + i + ",j is: " + j + " win count is " + count + ", on Win : "+ this.win_conditions[i][j]);
                    if(count==win_size){
                        /*
                         Even though win size is customizable, it does not check if the matches
                         were consecutive, we can have a win where X X O X is a win :(
                         */
                        clearInterval(main_game.timeCounter); // stop the timer in event of win
                        console.log('someone won');
                        this.player_wins(this.players[this.current_player]);
                        // TODO Here is where you increment the object properties for the winner
                        if(!this.applause)
                        {
                            var applause = new Audio('assets/sounds/applause.mp3');
                            applause.play();
                            this.applause = true;
                            //console.log(this.applause);
                        }

                    } //end of count == 3

                } else { //if symbols don't match consecutively reset count to zero
                    count = 0;
                }//end of symbols match
            } //end of inner loop
        } //end of outer loop
    };
    this.player_wins = function(player){
        /*
         Show out custom win message popup! No more alerts!
         */
        console.log("Player Won!");
        $("#win").html('Player ' + player.get_symbol()+ ' won the game!');
        $("#win").show();
        $("#reset_button").addClass('blink_me');
        run_blink();
        $(".ttt_cell").addClass("selected");
        if(!this.no_click) {
            if(player.get_symbol() === "X")
            {
                player_x_wins++;
            } else {
                player_o_wins++;
            }
        }

        this.no_click = true;
    };

    this.callTie = function(){
        console.log(this.applause);
        if(!this.applause) {
            $("#win").html('It\'s a draw!');
            $("#win").show();
            $("#reset_button").addClass('blink_me');
            run_blink();
            $(".ttt_cell").addClass("selected");
            this.no_click = true;
        }
    }
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

    apply_click_handlers();
    main_game = new game_template($('#gamebody'),3);
    main_game.create_cells(9);
    main_game.create_players();
});
/*
 This function are out custom click handlers.  This one is for the submit button.
 On submit, it collects the values of our select pulldown menus and stores them in
 variables that would pass into our instantiated object via parameters.
 It also does some calculation so that the CSS width and height would be adjusted
 accordingly.
 */
function apply_click_handlers() {
    $("#submit").click(function(){
        clearInterval(main_game.timeCounter);
        clear_all();

        var board_size = $("#board_size option:selected").val();
        var win_size = $("#win_size option:selected").val();

        console.log("board_size is ",board_size);
        console.log("win_size is " , win_size);

        var cell_width = 100/board_size;
        cell_width = cell_width.toFixed(3);
        cell_width = cell_width + "%";
        console.log("Cell width is " + cell_width);
        $("#gamebody").html("");
        main_game = new game_template($('#gamebody'),board_size,win_size);
        main_game.create_cells(board_size*board_size);
        main_game.create_players();
        $(".ttt_cell").css("width",cell_width);
        $(".ttt_cell").css("height",cell_width);
        $("#settings_window").hide(function(){
            $("body.container>div").css("opacity","1");
        });
    });

    /*
     Our reset button removes active_player if it's on player2
     It clears the gamebody, question_area and timer to default.
     It invokes our main_game object methods and recreates our players and cells again
     */
    $('#reset_button').click(function() {
        clear_all();
    });

    $("#settings").click(function() {
        if(!main_game.no_click)
        {
            $("body.container>div").not("#settings_window").css("opacity",".5");
            $("#settings_window").show(function(){
                $("#settings_windows").css("opacity","1");
            });
        }
    });

    $("#settings_close").click(function() {
        $("#settings_window").hide(function(){
            $("body.container>div").css("opacity","1");
        });
    });

    $("#board_size").on("change",function() {
       var board_size = $("#board_size option:selected").val();
        console.log(board_size);
        var options = [];
        for(var i=3;i<=board_size;i++) {
            options_inside = $("<option>",{
                text: i
            });
            options.push(options_inside);
        }
        console.log(options);
        $("#win_size").text('');
        $("#win_size").append(options);
    });

}

function clear_all() {
    $("#player2").removeClass('active_player');
    $("#gamebody").html("");
    $('#question_area').html('<div id="question"><h1>Question</h1></div><div id="answer"></div>');
    clearInterval(main_game.timeCounter);
    $('#timer').html("<span>Timer</span>");
    main_game = new game_template($('#gamebody'),3,3);
    main_game.create_cells(9);
    main_game.create_players();
    $("#win").hide();
    $("#reset_button").removeClass('blink_me');
    $("#pxScore").text(player_x_wins);
    $("#poScore").text(player_o_wins);
    $("#gpSpan").text(++games_played);
    console.log(player_o_wins,player_x_wins,games_played);
    //games_played = 0;
    //player_o_wins = 0;
    //player_x_wins = 0;

}


var count=30;
/*
 this timer gets called outside of our object but it's reference is passed into this
 function as a parameter so that we can call methods to current player and append
 the timer message for that specific person.
 */
function calltimer(that) {
    main_game.timeCounter=setInterval(function(){
    $("#start_clock").removeClass("timer_no_start").addClass("timer");
    $("#start_mask").removeClass("mask_no_start").addClass("mask");


        count = count - 1;
        if (count <= 0) {
            clearInterval(main_game.timeCounter);
            //counter ended, do something here
        }
        if (count === 0) {
            /*
             If our count hits 0 then show the time up popup message
             */
            //main_game.invokeTimerSwitch = true;
            var player_symbol = that.parent.get_current_player().get_symbol();
            $("#win").html('<span>Player ' + player_symbol + '\'s time is up! Click for next player\'s turn</span>');
            $("#win span").addClass("blink_me");
            run_blink();
            $("#win").show();
            var times_up = new Audio('assets/sounds/timesup.mp3');
            times_up.play();
            $("#win").click(function(){
                $(this).hide();
                $("#win span").removeClass("blink_me");
                that.incorrectAnswerAndSwitch();
            });

            $("#start_clock").addClass("timer_no_start").removeClass("timer");
            $("#start_mask").addClass("mask_no_start").removeClass("mask");

            $("#temp_placeholder").remove();
            this.no_click = true;
        }
        /*
         As long as the timer is not 0, update our timer div with the current count
         */
        $("#timer span").text(count);
        var tick = new Audio('assets/sounds/Tick.mp3');
        tick.play();
        //console.log(count);

    }, 1000); //1000 will  run it every 1 second
}
/*
 There are 3 arrays.  One for question, choices and answers.  Their subindex means they
 are all grouped today. Choices aways will be delimited by <br> to separate into separate
 divs later on in the logic and dynamically inserted into the dom.
 */
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

var choicesArray=['Yes<br>No',
    'Yes<br>No',
    'Yes<br>No',
    '(a)Single-spaced, 12 pt. Arial font <br>(b)Double-spaced, 14 pt. Times New Roman font <br>(c)Double-spaced, 12 pt. Times New Roman font',
    '(a)List them in the order that they appear in your paper <br>(b)List them in alphabetical (A to Z) order.',
    '(a)Hanging indent<br>(b)block indent;',
    '(a)Is considered plagiarism <br>(b)Should be block indented.',
    '(a)When you directly quote someone or something <br>(b) When you interview someone and use something that they said <br>(c)When you use common knowledge – like ‘Water freezes at 32 degrees F’<br>(d)When you put a direct quote into your own words<br>(e)(a), (b), and (d) only.',
    '(a)Barnaby, Benjamin <br> (b) Yale UP (c) 2010 <br>(d) Cool Science for Middle School Science Fairs',
    '(a)A book on 20th Century Literature; <br>(b)A journal article in a database; <br>(c)A webpage',
    '(a)The Internet <br>(b)The index <br>(c)Your works cited document',
    '(a)Webpage <br>(b)JSTOR journal article<br> (c) Magazine',
    '(a)Routledge<br> (b) Jones,Andrew <br> (c)"The Cambrian Genocide" <br> (d) <em> Genocide:A Comprehenisve Introduction </em> <br> (e)2006 <br> (f) pp.40-60',
    '(a)The words et al. are a suffix to the author’s name; <br>(b)The words et al. mean ‘and others’, because there are more than three authors.<br>(c)The words et al. mean there are editors and authors for this book.',
    '(a)You only need to cite each source one time – no matter how often you use it;<br>(b)You should cite direct quotes at the end of the sentence where it is used.',
    '(a)No, only your paper needs to have page numbers; <br>(b)Yes, your paper, works cited, and annotated bibliography should have a running page number from the beginning of the document to the end.',
    '(a)On the same page right after the last paragraph of your paper;<br>(b)On page one of your document;<br>(c)On a separate page after your paper.',
    '(a)A TV show;<br>(b)A book;<br>(c)A journal;<br>(d)A website;<br>(e)A database;<br>(f)All of the above.',
    '(a)Baron, Sandra.<em>Yosemite National Park</em>. New York: Chelsea, 2010, pp. 2-10. <br>(b)Baron, Sandra. Yosemite National Park, Chelsea, 2010, pp. 2-10',
    '(a)Yes. That’s why the boxes are there. <br>(b)No. Only fill in the boxes necessary for the source you are citing.',
    '(a)Ten spaces or two tabs <br>(b)Five spaces or one tab.',
    '(a)No. URLs are long and messy and should never be included <br>(b)Yes! URLs are required by the new MLA 8 style.',
    '(a)Johnson, Betty. “Abstract Art.”Modern Art – San Francisco, 24 Jan. 2015, www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015. <br> (b)Johnson, Betty. “Abstract Art.”<em> Modern Art – San Francisco</em>, 24 Jan. 2015, http://www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015.',
    '(a)(239 Smith)<br>(b)(Smith, 239)<br>(c)(Smith, p. 239)<br>(d)(Smith 239)',
    '(a)Smith, John. “Modern World History.”<br> (b)Smith, John. “World History Overview.”',
    '(a)The webpage article title (which is in quotes)<br>(b)The publisher of the website;',
    '(a)lions<br>(b)library<br>(c)JSerra'
];

var answerArray=['No',
    'Yes',
    'No',
    '(c)Double-spaced, 12 pt. Times New Roman font',
    '(b)List them in alphabetical (A to Z) order.',
    '(a)Hanging indent',
    '(b)Should be block indented.',
    '(e)(a), (b), and (d) only.',
    '(d) Cool Science for Middle School Science Fairs',
    '(c)A webpage',
    '(c)Your works cited document',
    '(b)JSTOR journal article',
    '(a)Routledge',
    '(b)The words et al. mean ‘and others’, because there are more than three authors.',
    '(b)You should cite direct quotes at the end of the sentence where it is used.',
    '(b)Yes, your paper, works cited, and annotated bibliography should have a running page number from the beginning of the document to the end.',
    '(c)On a separate page after your paper.',
    '(f)All of the above.',
    '(b)Baron, Sandra. Yosemite National Park, Chelsea, 2010, pp. 2-10',
    '(b)No. Only fill in the boxes necessary for the source you are citing.',
    '(b)Five spaces or one tab.',
    '(b)Yes! URLs are required by the new MLA 8 style.',
    '(a)Johnson, Betty. “Abstract Art.”Modern Art – San Francisco, 24 Jan. 2015, www.MASF.org/abstract_art.html. Accessed 11 Oct. 2015. ',
    '(d)(Smith 239)',
    '(a)Smith, John. “Modern World History.”',
    '(a)The webpage article title (which is in quotes)',
    '(b)library'
];


var categoryArray=['citation format','citation source', 'source format', 'MLA 8 format','MLA 8 style','in-text citations','works cited','web citations','citation style'];
var categoryArray=['4, 5, 4, 3, 2, 6, 3, 1, 8, 1, 5, 2, 8, 0, 0, 4, 6, 3, 0, 1, 8 , 7, 7 , 5, 6, 7, 2'];



/*
 This function runs 4 loops with subloops to calculate
 1) Horizontal win conditions
 2) Vertical win conditions
 3) Diagonal from left to right
 4) Diagonal from right to left
 */
function calculateWinConditionArray(row) {
    //console.log("row is " + row);
    var win = [];
    var wintotal = [];
    row = parseInt(row);
    /* horizontal win array generator */
    for(var i = 0; i < row*row; i)
    {
        var temp = [];
        for(var j=i; j<i+row; j++)
        {
            temp.push(j);
        }
        win.push(temp);
        wintotal.push(temp);
        i=j;

    }

    /* vertical win array generator */
    var win = [];
    for(var i=0;  i< row; i++)
    {
        temp = [];
        for(j=i;j<row*row;j+=row)
        {
            temp.push(j);
        }
        win.push(temp);
        wintotal.push(temp);
    }
    //console.log("vertical", win);

    var win = [];
    var temp = [];
    for(var i=0;i<row*row;i+=row+1)
    {
        temp.push(i);

    }
    wintotal.push(temp);
    //console.log("diagonal LR", temp);

    var temp = [];
    for(i=row-1;i<row*row-1;i+=row-1)
    {
        temp.push(i);
    }
    wintotal.push(temp);
    //console.log("diagonal RL", temp);
    //console.log("total", wintotal);
    return wintotal;
}


function run_blink() {
    (function blink() {
        $('.blink_me').fadeOut(500).fadeIn(500, blink);
    })();
}