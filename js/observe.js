"use strict";

$(function() {
    if (typeof jsonReplacement !== 'undefined') {
        result = jsonReplacement;
        ccoi.ccoiSchema = ccoi.parseCCOI(result);
        setUpObservation();
        $('#coder_name').text(jsUserVars['first'] + " " + jsUserVars['last'] + "'s Sessions");
    
        function setUpObservation() {
            ccoiObservation.setDemoBool(false);
            ccoiObservation.getSessions();
            ccoiObservation.bindListeners();
        }
    }
    else {
        ccoi.callToAPI('/storage/ccoi-new.json').then(function(result) {
            ccoi.ccoiSchema = ccoi.parseCCOI(result);
        }).then(function(){
            setUpObservation();
            $('#coder_name').text(jsUserVars['first'] + " " + jsUserVars['last'] + "'s Sessions");
        }, function(error) {
            console.log(error)
        })
    
        function setUpObservation() {
            ccoiObservation.setDemoBool(false);
            ccoiObservation.getSessions();
            ccoiObservation.bindListeners();
        }
    }
});