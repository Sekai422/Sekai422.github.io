//Gets the tag that we want to configure 
var statisticList = document.querySelector('#statistic-List');

// This retrieves the offers data from Firebase and stores in an array
function getScholarshipAccepted() {
    db.collection("offers").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var scholarshipAcceptedList = doc.data()['scholarshipID'];
            console.log("Accepted Scholarship");
            console.log(scholarshipAcceptedList);
            for (var i = 0; i < scholarshipAcceptedList.length; i++) {
                if (AcceptedScholarshipList[scholarshipAcceptedList[i]] === undefined) {
                    console.log(scholarshipAcceptedList);
                    console.log("doesn't exist in list");
                    AcceptedScholarshipList[scholarshipAcceptedList[i]] = 1;
                } else {
                    console.log(scholarshipAcceptedList);
                    console.log("does exist in list");
                    AcceptedScholarshipList[scholarshipAcceptedList[i]] = AcceptedScholarshipList[scholarshipAcceptedList[i]] + 1;
                }
            }
        });
    });
}

// This retrieves the Scholarship data from Firebase and calls renderStatistics
function getAllApplicantAmountForEachScholarship() {
    db.collection("Scholarship Database").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var scholarshipApplicants = doc.data()['applicants'];
            var scholarshipApplicantNumber = scholarshipApplicants.length;
            console.log(scholarshipApplicants);
            console.log(scholarshipApplicantNumber);
            renderStatistics(doc);
        });
    });
}

// This function creates the statistics Page 
function renderStatistics(doc) {

    let name = document.createElement('div');
    name.classList.add("col-xl-6");
    name.textContent = doc.data()['name'];

    let acceptanceRate = document.createElement('div');
    acceptanceRate.classList.add("col-xl-6");
    acceptanceRate.classList.add("text-center");
    var totalApplicants = doc.data()['applicants'].length;

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    wait(2 * 1000).then(() => {
        if (AcceptedScholarshipList[doc.id] === undefined) {
            console.log(doc.id);
            console.log("This scholarship has no acceptance yet");
            acceptanceRate.textContent = 0 + '%';
        } else {
            console.log(doc.id);
            console.log("This scholarship has acceptance");
            if (totalApplicants !== null) {
                acceptanceRate.textContent = AcceptedScholarshipList[doc.id] / totalApplicants * 100 + '%';
            }
        }
    })

    statisticList.appendChild(name);
    statisticList.appendChild(acceptanceRate);
}

// Main 
var AcceptedScholarshipList = {};
getScholarshipAccepted();
getAllApplicantAmountForEachScholarship();