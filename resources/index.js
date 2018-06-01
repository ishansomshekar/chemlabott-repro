function make_slides(f) {
  var   slides = {};

  slides.consent = slide({
     name : "consent",
     start: function() {
      exp.startT = Date.now();
      $("#consent_2").hide();
      exp.consent_position = 0;
     },
    button : function() {
      if(exp.consent_position == 0) {
         exp.consent_position++;
         $("#consent_1").hide();
         $("#consent_2").show();
      } else {
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      window.addEventListener("keydown", exampleKeys);
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.example1 = slide({
    name : "example1",
    start : function() {
      window.addEventListener("keydown", exampleKeys);
    },
    ex1button: function() {
      ex_response = $('input[name="assess-example1"]:checked').val()
      if (ex_response == "left") {
        window.removeEventListener("keydown", exampleKeys);
        window.addEventListener("keydown", exampleKeys2);
        exp.go();
      } else if (ex_response == "right") {
        $("#exampleErr1").html("Are you sure? Please consider which card best matches the sentence and and try again.")
        $(".err").show();
      } else {
        $("#exampleErr1").html("Please select one of the cards")
        $(".err").show();
      }
    }
  });
  slides.example2 = slide({
    name : "example2",
    start : function() {
      window.addEventListener("keydown", exampleKeys2);
    },    
    ex2button: function() {
      ex_response = $('input[name="assess-example2"]:checked').val()
      if (ex_response == "right" || ex_response == "left") {
        window.removeEventListener("keydown", exampleKeys2);
        // window.addEventListener("keydown", continueKeys);
        exp.go();
      } else {
        $("#exampleErr2").html("Please select one of the cards")
        $(".err").show();
      }
    }
  });
  slides.all_slides = slide({
    name : "all_slides",
    present: exp.all_stims,
    start : function() {
      window.addEventListener("keydown", continueKeys);
      $(".err").hide();

    },
    present_handle : function(stim) {
      this.trial_start = Date.now();
      this.stim = stim;
      slide.condition = 0;
      $('input[name=assess-p1]').attr('checked',false);
      $('input[name=assess-p2]').attr('checked',false);
      $('input[name=assess-t]').attr('checked',false);
      document.getElementById('p1_div').style.display = 'block';
      document.getElementById('p2_div').style.display = 'none';
      document.getElementById('t_div').style.display = 'none';      
      // $("#category").html(stim["category"]);
      $("#p1-sentence").html(stim["p1-sentence"]);
      // $("#p1-left-image").html("../img/"+stim["p1-left-image"]);
      // $("#p1-right-image").html(stim["p1-right-image"]);
      // $("#p1-correct").html(stim["p1-correct"]);
      $("#p2-sentence").html(stim["p2-sentence"]);
      // $("#p2-left-image").html(stim["p2-left-image"]);
      // $("#p2-right-image").html(stim["p2-right-image"]);
      // $("#p2-correct").html(stim["p2-correct"]);
      $("#t-sentence").html(stim["t-sentence"]);
      // $("#t-left-image").html(stim["t-left-image"]);
      // $("#t-right-image").html(stim["t-right-image"]);
      // $("#t-correct").html(stim["t-correct"]);
      document.getElementById("p1-left-image").src="resources/img/" + stim["p1-left-image"];
      document.getElementById("p1-right-image").src="resources/img/"+stim["p1-right-image"];
      document.getElementById("p2-left-image").src="resources/img/"+stim["p2-left-image"];
      document.getElementById("p2-right-image").src="resources/img/"+stim["p2-right-image"];
      document.getElementById("t-left-image").src="resources/img/"+stim["t-left-image"];
      document.getElementById("t-right-image").src="resources/img/"+stim["t-right-image"];  
      window.addEventListener("keydown", continueKeys);          


    },
    button1: function() {

      this.p1_response = $('input[name="assess-p1"]:checked').val()
      if (this.p1_response != "left" && this.p1_response != "right") {
        $('.err').show();        
      } else {
        $('.err').hide();
        document.getElementById('p1_div').style.display = 'none';
        document.getElementById('p2_div').style.display = 'block';        
        window.removeEventListener("keydown", continueKeys);
        window.addEventListener("keydown", continueKeys2);            
      }



    }, 
    button2: function() {
      this.p2_response = $('input[name="assess-p2"]:checked').val()
      if (this.p2_response != "left" && this.p2_response != "right") {
        $('.err').show();  
      } else {
        $('.err').hide();
        slide.condition = 1;
        document.getElementById('p2_div').style.display = 'none';
        document.getElementById('t_div').style.display = 'block'; 
        window.removeEventListener("keydown", continueKeys2);
        window.addEventListener("keydown", trialKeys);               

      }

    },            
    button : function() {
      //find out the checked option
      this.t_response = $('input[name="assess-t"]:checked').val()      
      if (this.t_response != "left" && this.t_response != "right") {
        $('.err').show();  
      } else {
        $('.err').hide();      
        window.removeEventListener("keydown", trialKeys);
        window.addEventListener("keydown", continueKeys);

        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }  

      
    },
    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "primer",
        "trial_number" : exp.phase,
        "filler" : this.stim["filler"],

        "category" : this.stim["category"],
        "p1-correct" : this.stim["p1-correct"],
        "p1-response" : this.p1_response,
        "p2-correct" : this.stim["p2-correct"],
        "p2-response" : this.p2_response,
        "t-correct" : this.stim["t-correct"],
        "t-response" : this.t_response,
      });
    }    

  });


  slides.subj_info =  slide({
    name : "subj_info",
    start : function() {
      window.removeEventListener("keydown", continueKeys);
    },
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}


var exampleKeys = function(event) {
  console.log(event.key);
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case " ":
      $("#exampleButton1").click()
      break;
    default:
      return;
  }
  event.preventDefault();
}

var exampleKeys2 = function(event) {
  console.log(event.key);
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case " ":
      $("#exampleButton2").click()
      break;
    default:
      return;
  }
  event.preventDefault();
}
var continueKeys = function(event) {
  console.log(event.key);
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case " ":
      $("#continueButton").click()
      break;
    default:
      return;
  }
  event.preventDefault();
}

var continueKeys2 = function(event) {
  console.log(event.key);
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case " ":
      $("#continueButton2").click()
      break;
    default:
      return;
  }
  event.preventDefault();
}
var trialKeys = function(event) {
  console.log(event.key);
  if (event.defaultPrevented) {
    return;
  }
  switch (event.key) {
    case " ":
      $("#trialButton").click()
      break;
    default:
      return;
  }
  event.preventDefault();
}
/// init ///
function init() {
  var item_dicts = [];
  for (var i = 0; i < 3; i++) {
    
    prime_types = ["some_", "four_", "six_"];
    prime_sentences = ["Some of the symbols are ", "There are four ", "There are six "];
    for (var j = 0; j < 2; j++) {
      strength_types = ["weak_", "strong_"];
      for (var k = 0; k < 3; k++) {
        trial_types = ["some", "four", "six"];

        for (var x = 0; x < 3; x++ ) {
          dict = {};
          dict["filler"] = "false";

          images = _.shuffle(['club', 'heart', 'diamond', 'spade', 'square']);
          dict["category"] = prime_types[i] + strength_types[j] + trial_types[k];
          dict["p1-sentence"] = prime_sentences[i] + images[0] + "s.";
          dict["p2-sentence"] = prime_sentences[i] + images[1] + "s.";
          dict["t-sentence"] = prime_sentences[k] + images[2]  + "s.";

          if (i == 0) {
            if (j == 1) {
              var opt = _.shuffle([0, 1]);
              var sents = [images[0]+"3"+images[3]+"6.png", images[0]+"9.png"];
              dict["p1-left-image"] = sents[opt[0]];
              dict["p1-right-image"] = sents[opt[1]];
              dict["p1-correct"] = opt.indexOf(0);
              
              opt = _.shuffle([0, 1]);
              sents = [images[1]+"3"+images[4]+"6.png", images[1]+"9.png"];
              dict["p2-left-image"] = sents[opt[0]];
              dict["p2-right-image"] = sents[opt[1]];
              dict["p2-correct"] = opt.indexOf(0);                
           
            } else {
              var opt = _.shuffle([0, 1]);
              var sents = [images[0]+"9.png", images[3]+"9.png"];
              dict["p1-left-image"] = sents[opt[0]];
              dict["p1-right-image"] = sents[opt[1]];
              dict["p1-correct"] = opt.indexOf(0);
              
              opt = _.shuffle([0, 1]);
              sents = [images[1]+"9.png", images[4]+"9.png"];
              dict["p2-left-image"] = sents[opt[0]];
              dict["p2-right-image"] = sents[opt[1]];
              dict["p2-correct"] = opt.indexOf(0);                   
            }  
          } else if (i == 1) {
            if (j == 1 ) {
              var opt = _.shuffle([0, 1]);
              var sents = [images[0]+"4.png", images[0]+"6.png"];
              dict["p1-left-image"] = sents[opt[0]];
              dict["p1-right-image"] = sents[opt[1]];
              dict["p1-correct"] = opt.indexOf(0);
              
              opt = _.shuffle([0, 1]);
              sents = [images[1]+"4.png", images[1]+"6.png"];
              dict["p2-left-image"] = sents[opt[0]];
              dict["p2-right-image"] = sents[opt[1]];
              dict["p2-correct"] = opt.indexOf(0);              
            } else {
              var opt = _.shuffle([0, 1]);
              var sents = [images[0]+"6.png", images[0]+"2.png"];
              dict["p1-left-image"] = sents[opt[0]];
              dict["p1-right-image"] = sents[opt[1]];
              dict["p1-correct"] = opt.indexOf(0);
              
              opt = _.shuffle([0, 1]);
              sents = [images[1]+"6.png", images[1]+"2.png"];
              dict["p2-left-image"] = sents[opt[0]];
              dict["p2-right-image"] = sents[opt[1]];
              dict["p2-correct"] = opt.indexOf(0);   
            }
   
          } else if (i == 2) {
            if (j == 1) {
              var opt = _.shuffle([0, 1]);
              var sents = [images[0]+"6.png", images[0]+"9.png"];
              dict["p1-left-image"] = sents[opt[0]];
              dict["p1-right-image"] = sents[opt[1]];
              dict["p1-correct"] = opt.indexOf(0);
              
              opt = _.shuffle([0, 1]);
              sents = [images[1]+"6.png", images[1]+"9.png"];
              dict["p2-left-image"] = sents[opt[0]];
              dict["p2-right-image"] = sents[opt[1]];
              dict["p2-correct"] = opt.indexOf(0);              
            } else {
              var opt = _.shuffle([0, 1]);
              var sents = [images[0]+"6.png", images[0]+"4.png"];
              dict["p1-left-image"] = sents[opt[0]];
              dict["p1-right-image"] = sents[opt[1]];
              dict["p1-correct"] = opt.indexOf(0);
              
              opt = _.shuffle([0, 1]);
              sents = [images[1]+"6.png", images[1]+"4.png"];
              dict["p2-left-image"] = sents[opt[0]];
              dict["p2-right-image"] = sents[opt[1]];
              dict["p2-correct"] = opt.indexOf(0);   
            }
            
          }
          if (k == 0) {
            dict["t-left-image"] = images[2] + "9.png";
            dict["t-right-image"] = "better.png";
            dict["t-correct"] = j;           
          } else if (k == 1) {
            dict["t-left-image"] = images[2] + "6.png";
            dict["t-right-image"] = "better.png";
            dict["t-correct"] = j;           

          } else if (k == 2) {
            dict["t-left-image"] = images[2] + "9.png";
            dict["t-right-image"] = "better.png";
            dict["t-correct"] = j;            
          }
        
          item_dicts.push(dict);
        }
      }
    }
  } 

  for (var i = 0; i < 3; i++) { 
    prime_types = ["some_", "four_", "six_"];
    prime_sentences = ["Some of the symbols are ", "There are four ", "There are six "];
    for (var j = 0; j < 2; j++) {
      strength_types = ["weak_", "strong_"];

      for (var x = 0; x < 2; x++ ) {
        dict = {};
        dict["filler"] = "true";

        images = _.shuffle(['club', 'heart', 'diamond', 'spade', 'square']);
        dict["category"] = prime_types[i] + strength_types[j] + trial_types[i];
        dict["p1-sentence"] = prime_sentences[i] + images[0] + "s.";
        dict["p2-sentence"] = prime_sentences[i] + images[1] + "s.";
        dict["t-sentence"] = prime_sentences[i] + images[2]  + "s.";

        if (i == 0) {
          if (j == 1) {
            var opt = _.shuffle([0, 1]);
            var sents = [images[0]+"3"+images[3]+"6.png", images[0]+"9.png"];
            dict["p1-left-image"] = sents[opt[0]];
            dict["p1-right-image"] = sents[opt[1]];
            dict["p1-correct"] = opt.indexOf(0);
            
            opt = _.shuffle([0, 1]);
            sents = [images[1]+"3"+images[4]+"6.png", images[1]+"9.png"];
            dict["p2-left-image"] = sents[opt[0]];
            dict["p2-right-image"] = sents[opt[1]];
            dict["p2-correct"] = opt.indexOf(0);                
         
          } else {
            var opt = _.shuffle([0, 1]);
            var sents = [images[0]+"9.png", images[3]+"9.png"];
            dict["p1-left-image"] = sents[opt[0]];
            dict["p1-right-image"] = sents[opt[1]];
            dict["p1-correct"] = opt.indexOf(0);
            
            opt = _.shuffle([0, 1]);
            sents = [images[1]+"9.png", images[4]+"9.png"];
            dict["p2-left-image"] = sents[opt[0]];
            dict["p2-right-image"] = sents[opt[1]];
            dict["p2-correct"] = opt.indexOf(0);                   
          }            

        } else if (i == 1) {
          if (j == 1 ) {
            var opt = _.shuffle([0, 1]);
            var sents = [images[0]+"4.png", images[0]+"6.png"];
            dict["p1-left-image"] = sents[opt[0]];
            dict["p1-right-image"] = sents[opt[1]];
            dict["p1-correct"] = opt.indexOf(0);
            
            opt = _.shuffle([0, 1]);
            sents = [images[1]+"4.png", images[1]+"6.png"];
            dict["p2-left-image"] = sents[opt[0]];
            dict["p2-right-image"] = sents[opt[1]];
            dict["p2-correct"] = opt.indexOf(0);              
          } else {
            var opt = _.shuffle([0, 1]);
            var sents = [images[0]+"6.png", images[0]+"2.png"];
            dict["p1-left-image"] = sents[opt[0]];
            dict["p1-right-image"] = sents[opt[1]];
            dict["p1-correct"] = opt.indexOf(0);
            
            opt = _.shuffle([0, 1]);
            sents = [images[1]+"6.png", images[1]+"2.png"];
            dict["p2-left-image"] = sents[opt[0]];
            dict["p2-right-image"] = sents[opt[1]];
            dict["p2-correct"] = opt.indexOf(0);   
          }
 
        } else if (i == 2) {
          if (j == 1) {
            var opt = _.shuffle([0, 1]);
            var sents = [images[0]+"6.png", images[0]+"9.png"];
            dict["p1-left-image"] = sents[opt[0]];
            dict["p1-right-image"] = sents[opt[1]];
            dict["p1-correct"] = opt.indexOf(0);
            
            opt = _.shuffle([0, 1]);
            sents = [images[1]+"6.png", images[1]+"9.png"];
            dict["p2-left-image"] = sents[opt[0]];
            dict["p2-right-image"] = sents[opt[1]];
            dict["p2-correct"] = opt.indexOf(0);              
          } else {
            var opt = _.shuffle([0, 1]);
            var sents = [images[0]+"6.png", images[0]+"4.png"];
            dict["p1-left-image"] = sents[opt[0]];
            dict["p1-right-image"] = sents[opt[1]];
            dict["p1-correct"] = opt.indexOf(0);
            
            opt = _.shuffle([0, 1]);
            sents = [images[1]+"6.png", images[1]+"4.png"];
            dict["p2-left-image"] = sents[opt[0]];
            dict["p2-right-image"] = sents[opt[1]];
            dict["p2-correct"] = opt.indexOf(0);   
          }
          
        }
        if (i == 0) {
          dict["t-left-image"] = images[2] + "9.png";
          dict["t-right-image"] = "better.png";
          dict["t-correct"] = j;           
        } else if (i == 1) {
          dict["t-left-image"] = images[2] + "6.png";
          dict["t-right-image"] = "better.png";
          dict["t-correct"] = j;           

        } else if (i == 2) {
          dict["t-left-image"] = images[2] + "9.png";
          dict["t-right-image"] = "better.png";
          dict["t-correct"] = j;            
        }
      
        item_dicts.push(dict);
      } 
    }
  } 
      

  
  exp.all_stims = _.shuffle(item_dicts);

  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "consent", "instructions","example1", "example2", "all_slides", 'subj_info', 'thanks'];

  exp.data_trials = [];
  window.addEventListener("keydown", continueKeys);
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length();
  console.log(exp.nQs); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
