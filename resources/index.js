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
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.weak_primer = slide({
    name : "weak_primer",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    // present : _.shuffle([
    //    "John and Mary laugh.",
    //    "Does John and Mary laugh?",
    //    "John and I am happy."
    // ]),    

    present : _.shuffle([
       ["There are 5 clubs", "club6.png", "club9.png", "weak primer",],
       ["There are 3 diamonds", "diam4.png", "diam6.png", "weak primer",],
       ["There are 4 hearts", "hear6.png", "hear5.png", "weak primer",],
    ]),

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      $(".err").hide();

      // uncheck the button and erase the previous value 
      $("#weak_primeSentence").html(stim[0]);
      document.getElementById("weak_leftImage").src=stim[1];
      document.getElementById("weak_rightImage").src=stim[2];


      this.stim = stim; //you can store this information in the slide so you can record it later.

    },

    button : function() {
      //find out the checked option
      this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
      _stream.apply(this);
      
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "primer",
        "prime_status": this.stim[3], // don't forget to log the stimulus
        "prime_sentence" : this.stim[0]
      });
    }
  });  


// 
  slides.weak_trial = slide({
    name: "weak_trial",
    present : [
       ["there are 5 spades", "spad6.png", "better.png", "weak prime, they should choose image here",],
    ],

    present_handle : function(stim) {
      $(".err").hide();

      // uncheck the button and erase the previous value 
      $("#weak_prime-test").html(stim[0]);
      document.getElementById("weak_left-test").src=stim[1];
      document.getElementById("weak_right-test").src=stim[2];


      this.stim = stim; //you can store this information in the slide so you can record it later.

    },    

    button : function() {
      //find out the checked option
      this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
      _stream.apply(this);
      
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "trial",
        "prime_sentence" : this.stim[0],
        "prime_status" : false,
        "response" : $('input[name="assess"]:checked').val(),
      });
    },
  });


  slides.strong_primer = slide({
    name : "strong_primer",
    present : _.shuffle([
       ["There are 4 spades", "spad4.png", "spad6.png", "strong primer",],
       ["There are 3 clubs", "club9.png", "club3.png", "strong primer",],
       ["There are 5 hearts", "hear5.png", "hear6.png", "strong primer",],
    ]),

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      $(".err").hide();

      // uncheck the button and erase the previous value 
      $("#strong_primeSentence").html(stim[0]);
      document.getElementById("strong_leftImage").src=stim[1];
      document.getElementById("strong_rightImage").src=stim[2];


      this.stim = stim; //you can store this information in the slide so you can record it later.

    },

    button : function() {
      //find out the checked option
      this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
      _stream.apply(this);
      
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "primer",
        "prime_status": this.stim[3], // don't forget to log the stimulus
        "prime_sentence" : this.stim[0]
      });
    }
  });  


// 
  slides.strong_trial = slide({
    name: "strong_trial",
    present : [
       ["there are 4 diamonds", "diam5.png", "better.png", "strong prime, they should choose better here",],
    ],

    present_handle : function(stim) {
      $(".err").hide();

      // uncheck the button and erase the previous value 
      $("#strong_prime-test").html(stim[0]);
      document.getElementById("strong_left-test").src=stim[1];
      document.getElementById("strong_right-test").src=stim[2];


      this.stim = stim; //you can store this information in the slide so you can record it later.

    },    

    button : function() {
      //find out the checked option
      this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
      _stream.apply(this);
      
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "trial",
        "prime_sentence" : this.stim[0],
        "prime_status" : true,
        "response" : $('input[name="assess"]:checked').val(),
      });
    },
  });

  slides.subj_info =  slide({
    name : "subj_info",
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

/// init ///
function init() {
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
  exp.structure=["i0", "consent", "instructions", "weak_primer", "weak_trial", "strong_primer", "strong_trial", 'subj_info', 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
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
