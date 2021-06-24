angular.module("questionnaire-results-page", [
    'app.pages3'
]);

angular.module('app.pages3', [])
    .controller(
        'QuestionnaireResults', [ '$scope', function ($scope) {


            let vm = this;

            vm.demographics = [
                "Gender",
                "Educational Qualification",
                "Age Range",
                "Occupation"
            ];
            let a = {
               a:  "The visualisation helps me understand how the tool works",
               b: "The visualisation of how the Agent works is satisfying",
               c:  "The visualisation is sufficiently detailed",
               d: "The visualisation seems complete",
               e:  "The visualisation of how the tool works tells me how to use it",
               f: "The tool was helpful in allowing me to quickly understanding the reasons for the outcome"
            };

            let b = {
                a: "Was it necessary for the calendar to reschedule the event?",
                b: "What was the first action performed by the calendar?",
                c: "Was the agent equipped to reschedule the event if the first proposed time was not suitable?",
                d: "Did you get an understanding of how the calender made it's decisions?"
            };



            let question_b_answers = [
                "Yes",
                "No",
                "Confirm Attendance (of other members)",
                "Yes"
            ];

            let question_b_uncertainties = "I'm not sure";

            let question_b_not_included = "The justification did not say";
            let processCount = 0;

            let fc = "";
            let fs = "";

            let may_data = [];
            let june_data = [];

            vm.init =  function () {
                firebase.initializeApp({
                    apiKey: "AIzaSyBkGWOoapULGVXikcwkzQxpR_BZ-y-9ndI",
                    authDomain: "researchquestionnaireset2.firebaseapp.com",
                    projectId: "researchquestionnaireset2",
                    storageBucket: "researchquestionnaireset2.appspot.com",
                    messagingSenderId: "75203192387",
                    appId: "1:75203192387:web:ae9913848a32864c9596f6"
                });

                fc =  firebase.firestore().collection('q2dc');
                fs =  firebase.firestore().collection('q2d1');
                fetchData();
            }




            function fetchData() {
                fc.get().then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                       // processEntry(doc.data());
                    });
                    processCompleted();
                });

                fs.get().then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        processEntry(doc.data());
                    });
                    processCompleted();
                });

            }



            let gender_distribution = {}
            let aa = {};
            let ab = {};
            let ac = {};
            let ad = {};
            let ae = {};
            let af = {};

            function processEntry (entry) {
               // console.log(entry);

                if (entry === undefined) { return; }
                if (entry.demographics === undefined) { return; }

                if (entry.demographics.gender) {
                    if (gender_distribution.hasOwnProperty(entry.demographics.gender)) {
                        gender_distribution[entry.demographics.gender] = gender_distribution[entry.demographics.gender] + 1;
                    } else {
                        gender_distribution[entry.demographics.gender] = 1;
                    }
                }

                if (entry.responses.a.a) {
                    if (aa.hasOwnProperty(entry.responses.a.a)) {
                        aa[entry.responses.a.a] = aa[entry.responses.a.a] + 1;
                    } else {
                        aa[entry.responses.a.a] = 1
                    }

                    if (ab.hasOwnProperty(entry.responses.a.b)) {
                        ab[entry.responses.a.b] = ab[entry.responses.a.b] + 1;
                    } else {
                        ab[entry.responses.a.b] = 1
                    }

                    if (ac.hasOwnProperty(entry.responses.a.c)) {
                        ac[entry.responses.a.c] = ac[entry.responses.a.c] + 1;
                    } else {
                        ac[entry.responses.a.c] = 1
                    }

                    if (ad.hasOwnProperty(entry.responses.a.d)) {
                        ad[entry.responses.a.d] = aa[entry.responses.a.d] + 1;
                    } else {
                        ad[entry.responses.a.d] = 1
                    }

                    if (ae.hasOwnProperty(entry.responses.a.a)) {
                        ae[entry.responses.a.e] = ae[entry.responses.a.e] + 1;
                    } else {
                        ae[entry.responses.a.e] = 1
                    }

                    if (af.hasOwnProperty(entry.responses.a.a)) {
                        af[entry.responses.a.f] = aa[entry.responses.a.f] + 1;
                    } else {
                        af[entry.responses.a.f] = 1
                    }
                }




            }


            function processCompleted () {
                processCount = processCount + 1;
                if (processCount >= 2) {
                    showGraph();
                }
            }

            function getKVPairs (data) {

                let k = [];
                let v = []

                const kys = Object.keys(data);
                kys.forEach(kVal => {
                    k.push(kVal);
                    v.push(data[kVal]);
                })


                return {
                    keys: k,
                    values: v
                }
            }


            function showGraph () {

                let genderData =  getKVPairs(gender_distribution);
                let aaData = getKVPairs(aa);
                let abData = getKVPairs(ab);
                let acData = getKVPairs(ac);
                let adData = getKVPairs(ad);
                let aeData = getKVPairs(ae);
                let afData = getKVPairs(af);



               var genderChart = new Chart(
                    document.getElementById('genderChart'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: genderData.keys,
                            datasets: [{
                                label: 'Gender Distribution',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#eb2f06",
                                    "#fad390",
                                    "#e55039",
                                    "#3c6382"

                                ],

                                data: genderData.values,
                            }]
                        },
                        options: {}
                    }
                );

                let aaChart = new Chart(
                    document.getElementById('aa'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: aaData.keys,
                            datasets: [{
                                label: '..',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#38ada9",
                                    "#b71540",
                                    "#fad390",
                                    "#e55039"
                                ],
                                data: aaData.values,
                            }]
                        },
                        options: {}
                    }
                );


                let abChart = new Chart(
                    document.getElementById('ab'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: abData.keys,
                            datasets: [{
                                label: '',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#38ada9",
                                    "#b71540",
                                    "#fad390",
                                    "#e55039",


                                ],

                                data: abData.values,
                            }]
                        },
                        options: {}
                    }
                );

                let acChart = new Chart(
                    document.getElementById('ac'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: acData.keys,
                            datasets: [{
                                label: '',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#38ada9",
                                    "#b71540",
                                    "#fad390",
                                    "#e55039",


                                ],

                                data: acData.values,
                            }]
                        },
                        options: {}
                    }
                );

                let adChart = new Chart(
                    document.getElementById('ad'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: adData.keys,
                            datasets: [{
                                label: '',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#38ada9",
                                    "#b71540",
                                    "#fad390",
                                    "#e55039",


                                ],

                                data: adData.values,
                            }]
                        },
                        options: {}
                    }
                );

                let aeChart = new Chart(
                    document.getElementById('ae'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: aeData.keys,
                            datasets: [{
                                label: '',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#38ada9",
                                    "#b71540",
                                    "#fad390",
                                    "#e55039",


                                ],

                                data: aeData.values,
                            }]
                        },
                        options: {}
                    }
                );

                let afChart = new Chart(
                    document.getElementById('af'),
                    {
                        type: 'polarArea',
                        data: {
                            labels: afData.keys,
                            datasets: [{
                                label: '',
                                backgroundColor: [
                                    "#0a3d62",
                                    "#38ada9",
                                    "#b71540",
                                    "#fad390",
                                    "#e55039",


                                ],

                                data: afData.values,
                            }]
                        },
                        options: {}
                    }
                );



















            }






            /*
            backgroundColor: [
                                    "#0a3d62",
                                    "#3c6382",
                                    "#fad390",
                                    "#e55039",
                                    "#eb2f06"
                                ],
             */

        }
        ]
    )