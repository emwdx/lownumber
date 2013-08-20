

LowNumbers = new Meteor.Collection('lownumbers');


Router.map(function() { 
	this.route('entry',{path: '/'});
    this.route('resultsList', {
    path: '/results/',
    data: function(){
    allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
    return allResults[0];
    }
    });
    
    this.route('waiting',{path: '/waiting/'});
    this.route('config',{path: '/config/'});
    
  
  });


if (Meteor.isClient) {
Template.resultsList.helpers({

	results: function(){
	allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
	currentID =allResults.length-1
	guesses = LowNumbers.findOne({classID: currentID}).guesses
	
	guesses.sort(function(a,b) { return parseFloat(a.number) - parseFloat(b.number) } );
	
	for (var i=0; i < guesses.length-1; i++) {
      if (guesses[i].number === guesses[i+1].number) {
        guesses[i].winClass = "same"
        guesses[i+1].winClass = "same"
        }
    }

    // Check if we have a winner
    // It should be the first index, and shouldn't have a class yet
    
    
    for (var i=0; i < guesses.length-1; i++) {
      if (guesses[i].winClass != "same") {
        guesses[i].winClass = "success"
        break;
        
      }
      
    }
    	
	return guesses	
	}


});
Template.waiting.helpers({
	lowNumber: function(){
	allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
	currentID =allResults.length-1
	return LowNumbers.findOne({classID: currentID})
	
	}


});

Template.config.events(
	{'click #newGame':function(){
	allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
	newLowNumber = {
	classID: allResults.length,
	finished: false,
	guesses:[]
	
	},
	
	LowNumbers.insert(newLowNumber);
	Router.go('/');

	},
	'click #endGame':function(){
	allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
	currentID =allResults.length-1
	currentGame = LowNumbers.findOne({classID: currentID})._id
	LowNumbers.update({_id: currentGame},
                   {$set: {finished: true}});
	
	Router.go('/');
	
	}
	
	});
	
	
	
Template.entry.events({ 'submit form': function(e) {
	e.preventDefault();
	var newGuess = {
				number: parseInt($(e.target).find('[name=myNumber]').val()),
				name: $(e.target).find('[name=myName]').val(), 
				winClass: '',
    };
	allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
	currentID = allResults.length-1;
	currentGame = LowNumbers.findOne({classID: currentID})._id
	LowNumbers.update({_id: currentGame}, 
	{$push:{guesses:newGuess}});
  	Router.go('/waiting/');
}
});


}


if (Meteor.isServer) {
allResults = LowNumbers.find({},{sort: {classID: 1}}).fetch();
currentID =allResults.length-1
if(currentID==-1){
newLowNumber = {
	classID: allResults.length,
	finished: false,
	guesses:[]
	
	},
	
	LowNumbers.insert(newLowNumber);

}



}





