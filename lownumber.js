


Results = new Meteor.Collection('results');



if (Meteor.isClient) {
 
Template.resultsList.helpers({

	results: function(){
		allResults = Results.find({},{sort: {number: 1}})
		arrayResults = allResults.fetch();
		
		lastNumber = 0;
		for(var i=0;i<arrayResults.length;i++){
			if(arrayResults[i].number==lastNumber){
				arrayResults[i].winClass = 'same'
			}
			lastNumber = arrayResults[i].number
		
		}
		
		return allResults;
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


