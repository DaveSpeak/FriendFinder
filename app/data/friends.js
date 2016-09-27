var questions=[
	"You are always buzzed",
	"You like to jump up and down",
	"You love Donald Trump"
	// "You enjoy jumping out of the window",
	// "Your favorite band is Metallica",
	// "You love Hilary Clinton",
	// "Blue is your favorite color"
];
var answers=[];
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
			var quest=parseInt(number.charAt(0));
			var ans=parseInt(number.charAt(1));
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
		}else {
			var newFriend = {
				name:uname,
				picture:upic,
				answers:answers
			}
			var currentURL=window.location.origin;
			$.ajax({url:currentURL+"/api/friends", method:"GET"})
			.done(function(friendsdata){
				var mostCompatible='';
				var score=1000000;
				for (var j=0;j<friendsdata.length;j++){
					var testscore=0;
					console.log(newFriend.name,friendsdata[j].name);
					if (newFriend.name===friendsdata[j].name){
						console.log('Duplicates');
						duplicateFriend(newFriend.name);
						return true;
					}
					for (var i=0;i<friendsdata[j].answers.length;i++){
						testscore+=Math.abs(friendsdata[j].answers[i]-newFriend.answers[i]);
					console.log(friendsdata[j].answers[i], newFriend.answers[i],testscore);
					}
					if (testscore<score){
						score=testscore;
						mostCompatible=friendsdata[j].name;
					}
				}
				$('#modal-display').empty();
				$('#modal-display').append($('<p>').html(mostCompatible));
				$.post(currentURL+"/api/friends",newFriend);
				$('#myModal').modal('show');
				$('#modalClose').on('click',function(){location.reload();});
				$('#closeModal').on('click',function(){location.reload();});
			});
		}
	});
	return false;
}
function duplicateFriend(aname){
	$('#modal-display').empty();
	$('#modal-display').append($('<p>').html('Sorry, '+aname+' is already taken.'));
	$('.modal-title').empty();
	$('.modal-title').html('Duplicate Name');
	$('#myModal').modal('show');
	$('#modalClose').on('click',function(){location.reload();});
	$('#closeModal').on('click',function(){location.reload();});
}