


Results = new Meteor.Collection('results');



if (Meteor.isClient) {
 
Template.resultsList.helpers({

	results: function(){
    allResults = Results.find({},{sort: {number: 1}})
    arrayResults = allResults.fetch();

    // We know we are sorted (as per the find()), so we don't have to check the entire array for
    // duplicates, just the number +1 ahead in the array.
    for (var i=0; i < arrayResults.length-1; i++) {
      if (arrayResults[i].number === arrayResults[i+1].number) {
        arrayResults[i].class = "same"
        arrayResults[i+1].class = "same"
      }
    }

    // Check if we have a winner
    // It should be the first index, and shouldn't have a class yet
    if (!arrayResults[0].hasOwnProperty('class')) {
      arrayResults[0].class = "success"
    }

		return arrayResults;
	}
	
	
	
});
Meteor.Router.add({
	'/': 'entry',
	'/waiting/': 'waiting',
	'/results/':'resultsList'
	});	

Template.entry.events({ 'submit form': function(e) {
	e.preventDefault();
	var result = {
				number: parseInt($(e.target).find('[name=myNumber]').val()),
				name: $(e.target).find('[name=myName]').val(), 
				winClass: ''

	}
	Results.insert(result);
	
  	Meteor.Router.to('/waiting/');
}
});



Template.resultsList.events({'click td': function(event){
	if($(event.target).parent().parent().hasClass('same')){
		
	$(event.target).parent().parent().removeClass('same')}
	else{
	$(event.target).parent().parent().addClass('same')
	}
	



}

});


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(Results.find().count()===0){
    Results.insert({ number: 10,
    name: 'Evan'
    });

    Results.insert({ number: 2,
    name: 'Dave'
    });

    Results.insert({ number: 4,
    name: 'Mileaux'
   
    });
    Results.insert({ number: 4,
    name: 'Josie'
   
    });
    Results.insert({ number: 8,
    name: 'Micah'
   
    });
    }
   
  });
}


