var questions=[
	"You are always buzzed",
	"You like to jump up and down",
	"You love Donald Trump",
	"You enjoy jumping out of the window",
	"Your favorite band is Metallica",
	"You love Hilary Clinton",
	"Blue is your favorite color",
	"You take surveys like this seriously",
	"You are detail oriented",
	"You are a big-picture thinker"
];
var answers=[];
var friendID=-1;
$(document).ready(function(){
	populateList();
});
// builds question list based on var 'questions' & dynamically allocates them to survey.html
function populateList(){
	for (var j=0;j<questions.length;j++){
		//initialise answer variable based on # of answers in 'questions' variable
		answers[j]=0;
		// Start building the input for each question
		var questionInput=$('<div>').attr({'id':'question'+(j+1)});
		// Add each piece of html needed to generate the list and assign unique ids to the individual responses (I've got a headache after this one & it's a beauty)
		questionInput.append($('<h2>').html('Question '+(j+1)),$('<h3>').html(questions[j]),$('<div>').attr({'class':'dropdown'}).append(
		$('<button>').attr({'class':'btn btn-custom dropdown-toggle','type':'button','data-toggle':'dropdown', 'id':'q'+(j+1)}).html('Select an Option').append($('<span>').attr({'class':'caret'}))).append(
		$('<ul>').attr({'class':'dropdown-menu','id':'dq'+(j+1)}).html($('<li>').attr({'value':(j+1).toString()+'1'}).append($('<a>').html('1 (Strongly Disagree)'))).append($('<li>').attr({'value':(j+1).toString()+'2'}).
		append($('<a>').html('2'))).append($('<li>').attr({'value':(j+1).toString()+'3'}).append($('<a>').html('3'))).append($('<li>').attr({'value':(j+1).toString()+'4'}).append($('<a>').html('4'))).
		append($('<li>').attr({'value':(j+1).toString()+'5'}).append($('<a>').html('5 (Strongly Agree)')))));
		$("#questions").append(questionInput);
		//Now assign function to be performed when user clicks on an answer
		$("#dq"+(j+1)).on("click","li", function(){
			var number = $(this).attr('value');
			// parse button id & assign correct title to button
			var quest=parseInt(number.substr(0,(number.length-1)));
			var ans=parseInt(number.substr(number.length-1,number.length-1));
			// Check if user has resonded with 1 or 5 and update button name accordingly
			if (ans==1){
				$('#q'+(quest)).html(ans+' (Strongly Disagree)').append($('<span>').attr({'class':'caret'}));
			}else if(ans==5){
				$('#q'+(quest)).html(ans+' (Strongly Agree)').append($('<span>').attr({'class':'caret'}));
			}else {
				$('#q'+(quest)).html(ans).append($('<span>').attr({'class':'caret'}));
			}
			//update 'answers' array with user input
			answers[quest-1]=ans;
		});
	}
	// When user clicks 'submit' button:
	$('#submit').on('click', function(){
		var uname=$('#name').val().trim();
		var upic=$('#picture').val().trim();
		var unotdone=false;
		console.log(answers);
		//Go thru answers & if one is not filled out set unotdone=true
		for (var i=0;i<answers.length;i++){
			if (answers[i]==0) unotdone=true;
		}
		//Check that both text fields are filled out and answers answered, if not
		//alert the user that input is incomplete.
		if (uname==='' || upic==='' || unotdone){
			alert('Please answer all the questions!');
		// user has answered all questions, assign variable
		}else {
			var newFriend = {
				name:uname,
				picture:upic,
				answers:answers
			}
			// Query api/friends to get current friends data
			var currentURL=window.location.origin;
			$.ajax({url:currentURL+"/api/friends", method:"GET"})
			.done(function(friendsdata){
				// set placeholders for most compatible name and score
				// score cannot be greater than questions.length *4 (5-1), so set max score higher than that
				var mostCompatible='';
				var score=4*questions.length+1;
				// loop thru friends database
				for (var j=0;j<friendsdata.length;j++){
					// set score for this friend = 0
					var testscore=0;
					// if new friend's name already exists in the database, alert user
					// and allow them to enter new data - don't clear form
					if (newFriend.name===friendsdata[j].name){
						console.log('Duplicates');
						duplicateFriend(newFriend.name);
						return true;
					}
					// Loop thru answers of jth friend sum absolute value of differences
					for (var i=0;i<friendsdata[j].answers.length;i++){
						testscore+=Math.abs(friendsdata[j].answers[i]-newFriend.answers[i]);
					console.log(friendsdata[j].answers[i], newFriend.answers[i],testscore);
					}
					// test if this friends score is lower than the lowest score, if so 
					// replace the lowest score and remember id, score name
					if (testscore<score){
						friendID=j;
						score=testscore;
						mostCompatible=friendsdata[j].name;
					}
				}
				// set up modal
				// empty modal display, assign header, compatible friends name and picture
				$('#modal-display').empty();
				$('.modal-title').html('You are most compatible with:');
				$('#modal-display').append($('<p>').html(mostCompatible));
				$('#pictureFoot').prepend($('<img>').attr({'class':'thumbnail','src':friendsdata[friendID].picture}));
				// post current friend info to api/friends
				$.post(currentURL+"/api/friends",newFriend);
				// show modal
				$('#myModal').modal('show');
				// reload page to reset dropdown & input windows
				$('#modalClose').on('click',function(){location.reload();});
				$('#closeModal').on('click',function(){location.reload();});
			});
		}
	});
	return false;
}
// prepare modal if there is a duplicate name
function duplicateFriend(aname){
	// empty modal display, load with message alerting user that their name is already used
	$('#modal-display').empty();
	$('#modal-display').append($('<p>').html('Sorry, '+aname+' is already taken.'));
	$('.modal-title').empty();
	$('.modal-title').html('Duplicate Name');
	// display modal
	$('#myModal').modal('show');
}