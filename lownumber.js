


Results = new Meteor.Collection('results');



if (Meteor.isClient) {
 
Template.resultsList.helpers({

	results: function(){
    allResults = Results.find({classID: Session.get('classID')},{sort: {number: 1}})

    // This means that there are no results (or no such class) so we can just return undefined.
    // The template will evaluate results and render the correct sub-template.
    if (allResults.count() === 0) {
      return undefined;
    }

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
	'/waiting/': 'waiting',
  // This is annoying. It seems Meteor's router doesn't let you do truly optional
  // params, so we need two routes for each endpoint, one with a classID, one without

  // The order here is quite important so that they fallback correctly and, for example,
  // /results/ doesn't get seen as a classID.
  '/results/': function () {
    Session.set('classID', '');
    return 'resultsList';
  },
  '/results/:classID': function (classID) {
    Session.set('classID', classID);
    return 'resultsList';
  },
  '/:classID': function (classID) {
    Session.set('classID', classID);
    return 'entry';
  },
  '/': function () {
    Session.set('classID', '');
    return 'entry';
  }
	});	

Template.entry.events({ 'submit form': function(e) {
	e.preventDefault();
	var result = {
				number: parseInt($(e.target).find('[name=myNumber]').val()),
				name: $(e.target).find('[name=myName]').val(), 
				winClass: '',
        classID: Session.get('classID')
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
    name: 'Evan',
    classID: ''
    });
    Results.insert({ number: 2,
    name: 'Dave',
    classID: 'winners'
    });

    Results.insert({ number: 4,
    name: 'Mileaux',
    classID: ''
    });
    Results.insert({ number: 4,
    name: 'Josie',
    classID: ''
    });
    Results.insert({ number: 8,
    name: 'Micah',
    classID: ''
    });
    }
   
  });
}


