const currentDate = Date.now();
var unaccepted;


removeUnaccepted();

/* Removes scholarship offers if they have not been accepted after 2 weeks of the offer. Called
   every time the login page is accessed*/
function removeUnaccepted(){
	console.log(currentDate);
	unaccepted = new Array();
	findUnacceptedApplications();
}


/* Parses the database for scholarship offers that have passed their scholarship offer date,
   calls the functions to remove the scholarship offers */
function findUnacceptedApplications(){
	var acceptanceData;
	
	database.collection('offers').get().then((snapshot) => {
        snapshot.docs.forEach(offer => {
			acceptanceData = offer.data();
			
			if(acceptanceData.acceptDate < currentDate){			
				unaccepted.push({
					id: acceptanceData.id,
					scholarshipID: acceptanceData.scholarshipID,
					offerID: offer.id
				})
			}
        })
		
		removeApplication();
		removeAcceptance();
    })
	
}

/* Removes the application for a scholarship that has not been accepted after two weeks 
   from the database so that the scholarship coordinator does not try to make the offer
   again */
function removeApplication(){
	unaccepted.forEach(function(toRemove){
		database.collection('Scholarship Database').doc(toRemove.scholarshipID)
			.get().then(scholarship =>{
					const scholarshipApplicants = scholarship.data().applicants;
					const numTaken = scholarship.data().numberTaken;				
					const databaseRef = database.collection('Scholarship Database').doc(toRemove.scholarshipID);
					
					
					for( var applicantNum = 0; applicantNum < scholarshipApplicants.length; applicantNum++)
						{ if ( scholarshipApplicants[applicantNum] == toRemove.id) 
							{ scholarshipApplicants.splice(applicantNum, 1); applicantNum--; }}
					
					databaseRef.update({
						applicants: scholarshipApplicants,
						numberTaken: numTaken - 1
					});	
		});
	});
}


/* Removes the offer from the offer section of the scholarship database */
function removeAcceptance(){
	unaccepted.forEach(function(toRemove){
		database.collection('offers').doc(toRemove.offerID).delete();
	});

}


