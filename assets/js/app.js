angular.module('study-platform', [
    'app.util',
    'app.trace',
    'app.pages'
]);


angular.module('app.pages', [])
    .controller(
        'NonExpertStudy', 
        ['$scope', '$rootScope', 'TraceService', 
            function($scope, $rootScope, trace) {

                // defaults....
                const DEFAULTS = {
                    colours: {
                        agent: "#000000",
                        failureNode: "#f8c291",
                        traversedNode: "#16a085",
                        traversableNode: "#1abc9c",
                        unTraversableNode: "#e74c3c",
                        active: "#301938"
                    },
                    maxTries:  1,
                    recognisedTypes: ["belief", "message", "norm", "percept", "sensor", "value"],
                    rootNode: {payload: { contents: { IDENTIFIER: "[My Agent]"} }},
                }

                const INITIAL_STATE = {
                    agents: {all: [], selected: undefined}
                }


                let vm = this;
                vm.currentErrorMessage = '';
                vm.selectedQuestion = 0;
                vm.selectedState = null;
                vm.pc = 9;

                // required for the visualisation....
                vm.agents = { ...INITIAL_STATE.agents};  // known agents
                vm.autoscroll = false;                    // autoscroll status
                vm.filteredKnowledgeBase = [];
                vm.freeze = false;                       // freeze knowledge base update
                vm.isShowingSettingsPane = false;
                vm.knowledgeBase = [];
                vm.selectedViewPreference = {};          // view preference being viewed
                vm.serverIsRunning = false;              // debugger status
                vm.searchString = "";                    // kb-search string
                vm.senseOverlayData = {value: "", source: "", type: ""};
                vm.showSenseOverlay = false;
                vm.viewPreference = []                   //  view preferences

                vm.submitted =  false;

                /** D3 variables **/
                let diagonal,
                    div,            // container div of the SVG chart
                    duration = 0,   // transition period
                    margin = {top: 5, right: 10, bottom: 5, left: 10}, // display margin
                    i = 0,
                    root,
                    svg,
                    tree,
                    width =  650;





                // END VIZ

            vm.page =  null;
            let currentPageIndex = 0;

            const pages = [
                {
                    index: 0,
                    title:  'Welcome!!!',
                    note_a: "This study investigates the use of visualisations in explaining the actions of Intelligent Systems.",
                    note_b: "Participate in this study requires no prior knowledge and involves",
                    note_b_list: [
                        "Reading a scenario where an Intelligent system has acted.",
                        "Viewing an interactive visualisation justifying its actions.",
                        "Answering a number of questions by reading the information visualised.",
                        "Answering a set of questionnnaires to tell us more about your experience using the tool."
                    ],
                    note_c: "When you are ready, click the green button to proceed",
                    closing_remarks: "Thank you for choosing to participate in this study.",
                    has_options: false,
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: []
                }, 
                { 
                    index: 1, 
                    title: 'Demographics', 
                    showHeaderBar: false , 
                    subtitle: "All submissions are anonymous though we need a few non-identifying demographic information.",
                    subtitle_b: "Note: You may choose not to answer a question by selecting the option 'I\'d rather not say'",
                    has_options: false,
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: [
                        {'label': 'Gender', 'prop': 'demographics.gender'},
                        {'label': 'Educational Qualification', 'prop': 'demographics.education'},
                        {'label': 'Age Range', 'prop': 'demographics.age'},
                        {'label': 'Occupation', 'prop': 'demographics.occupation'},
                        {'label': 'Use of visualisation', 'prop': 'misc.use_of_visualisation'},
                        {'label': 'Prolific ID', 'prop': 'demographics.prolific_id'},
                        {'label': 'View on Transparency', 'prop': 'misc.view_on_transparency'}
                    ]
                },
                { 
                    index: 2, 
                    title: 'Scenario', 
                    showHeaderBar: false, 
                    subtitle: "You can return to this page at any point during the study",
                    intro: "Your employer has recently introduced a smart calendar to help improve meeting attendance.",
                    intro_b:  "A smart calendar may reschedule your events in advance and provides an interactive visualisation to explain its actions.",
                    list_intro: "Event:   On Friday, you had scheduled your Monday appointments as follows (before the smart calendar made adjustments):",
                    list: [
                        { time: "10:00am    -   11:00am", note :"Meeting with Selena & Alison" },
                        { time: "1:00pm	-	3:00pm", note :"Meeting with Chelsea & Derek" },
                        { time: "4:00pm	-	5:00pm", note :"Meeting with Alice & Bob" }
                    ],
                    list_two_intro: "On Monday, your appointments had been rescheduled as follows (after the smart calendar made adjustments):",
                    list_two: [
                        { time: "9:00am	-	19:00am", note :"Meeting with Selena & Alison" },
                        { time: "10:00am	-	11:00am", note :"Meeting with Chelsea & Derek" },
                        { time: "1:00pm	-	3:00pm", note :"Meeting with Alice & Bob" }
                    ],
                    comment: "The smart calendar has provided a justification for its actions using a visualisation.",
                    comment_2: "(You will be presented with this shortly)",
                    closing_remarks: "Important: The visualisation is interactive, the nodes represent actions taken by the calendar. The red nodes represent actions that were not possible at the time of decision making. Clicking on a node shows the information available to the calendar at the point of its decision making (This appears on the left of the screen).",
                    has_options: false,
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: []
                }, 
                { 
                    index: 3, 
                    title: 'Task', 
                    showHeaderBar: true, 
                    has_options: false, 
                    intro: 'Given the scenario, you will be presented with a dashboard explaining the actions of your smart calendar. The video below explains how the dashboard works. Kindly watch it before proceeding.',
                    intro_b: 'Once done, watch the video below',
                    list: [
                        "Watch video on how to interprete the visualisation",
                        "Interact with the transparency visualisation",
                        "Answer a few questions related to the data contained in the visualisation",
                        "Reflect on your experience by answering a few questions"
                    ],
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: []
                },
                { 
                    index: 4, 
                    title: 'Using the visualisation', 
                    showHeaderBar: true , 
                    has_options: true,
                    subtitle: "",
                    header_class: 'headerbar_b',
                    content_class: 'contentbar_b',
                    validate_by: [],
                    sub_validate_by: ['task']
                },
                { 
                    index: 5, 
                    title: 'Retrospective', 
                    subtitle: 'It is very important to answes the following questions as honestly as you can (write as much as you can)',
                    notes: 'In this section, we want you to try as much as possible to reflect on your experience with the tool. What was your FIRST IMPRESSION? What did you find UNCLEAR / CONFUSING? What did you DISLIKE about the tool? What was DIFFICULT? What WORKED for you? What did you PARTICULARLY LIKE about the visualisation? What did you think about the INTERACTION? What could be IMPROVED and HOW?',
                    showHeaderBar: true , 
                    has_options: false,
                    subtitle: "",
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: [
                        {'label': 'Retrospective', 'prop': 'misc.think_aloud'},
                    ]
                }, 
                { 
                    index: 6, 
                    title: 'Questionnaire 1 of 2', 
                    showHeaderBar: true  ,
                    has_options: false,
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: [],
                    range_validate_by:['pssuq', 0, 19]
                }, 
                
                { 
                    index: 7, 
                    title: 'Questionnaire 2 of 2', 
                    showHeaderBar: true  ,
                    has_options: false,
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: [],
                    range_validate_by: ['sus', 0, 10],
                    submit: true
                }, 
                { 
                    index: 8, 
                    title: 'Thank you, Your participation is appreciated!', 
                    completion_code: "1554D4A9",
                    note: "Thank you for participating in this study.",
                    note_b: "...your contribution will inform us about how to better tailor visualisations to end-users",
                    showHeaderBar: true ,
                    has_options: false ,
                    header_class: 'headerbar',
                    content_class: 'contentbar',
                    validate_by: [],
                    submit: true
            }

            ];

            



            vm.GENDER_OPTIONS = [
                'Female', 'Male', 'Other', 'I\'d rather not say'
            ];
            vm.EDUCATION_OPTIONS = [
                'Undergraduate', 'Postgraduate',
                'Other', 'I\'d rather not say'
            ];
            vm.AGE_RANGE_OPTIONS = [
                '18 - 24', '30 - 34', '35 - 39',
                '40 - 44', '45 - 49', '50 - 54',
                '55 - 59', '60 - 64', '65 - 69',
                '70 and above', 'I\'d rather not say'
            ];
            vm.USE_OF_VISULAISATION_OPTIONS = [
                'Yes', 'No', 'I\'d rather not say'
            ];



            vm.TASKS = [
                {
                    question: 'What was the first task performed by the smart calendar?',
                    options: [ 'Propose event time change', 'Confirm Participant Attendance', 'Fix event time', 'I\'m Unsure', 'The visualisation did not say'],
                }, 
                {
                    question: 'Using the visualisation, what time was the user (you) free when the smart calendar decided to reschedule events?',
                    options: ['1pm', '11pm', '10am', '6am', 'I\'m Unsure', 'The visualisation did not say'],
                },
                {
                    question: 'Which of these tasks did the smart calendar carry out?',
                    options: ['Reschedule event', 'Fix event time', 'None of the above', 'Both', 'I\'m unsure', 'The visualisation did not say'],
                }, 
                {
                    question: 'Why was the Smart calendar unable to Fix the event time?',
                    options: ['It was', 'Not everyone was available', 'I\'m unsure', 'The visualisation did not say'],
                },
                {
                    question: 'What criteria was required for the Smart calendar to reschedule the event?',
                    options: ['None', 'Not everyone was available', 'I\'m unsure', 'The visualisation did not say'],
                }, 
                {
                    question: 'What time was Alice Free?',
                    options: ['8pm', '3pm', '8am', '9am', 'I\'m unsure', 'The visualisation did not say'],
                },
                {
                    question: 'Did the smart calendar update the calendar entry for the event?',
                    options: ['Yes','No', 'I\'m unsure', 'The visualisation did not say'],
                },
                {
                    question: 'What time was Bob not free?',
                    options: ['10am', '9pm', '9am', 'I\'m unsure', 'The visualisation did not say'],
                },
                {
                    question: 'What there a need to reschedule the event again after the first time?',
                    options: ['Yes', 'I\'m unsure', 'The visualisation did not say', 'No'],
                }
            ];

            vm.PSSUQ = [
                'a', 'b'
            ];

            vm.LIKERT = {
                PSSUQ: [
                    'Overall, I am satisfied with how easy it is to use this system',
                    'It was simple to use this system',
                    'I could effectively complete the tasks and scenarios using this system.',
                    'I was able to complete the tasks and scenarios quickly using this system',
                    'I was able to efficiently complete the tasks and scenarios using this system.',
                    'I felt comfortable using this system',
                    'It was easy to learn to use this system',
                    'I believe I could become productive quickly using this system',
                    'The system gave error messages that clearly told me how to fix problems',
                    'Whenever I made a mistake using the system, I could recover easily and quickly.',
                    'The information (such as on-line help, on-screen messages and other documentation) provided with this system was clear',
                    'It was easy to find the information I needed',
                    'The information provided for the system was easy to understand',
                    'The information was effective in helping me complete the tasks and scenarios',
                    'The organization of information on the system screens was clear.',
                    'The interface of this system was pleasant.',
                    'I liked using the interface of this system',
                    'This system has all the functions and capabilities I expect it to have.',
                    'Overall, I am satisfied with this system'
                ],
                SUS: [
                    'I think that I would like to use this system frequently',
                    'I found the system unnecessarily complex',
                    'I thought the system was easy to use',
                    'I think that I would need support of a technical person to use this system',
                    'I found the various functions of the system were well integrated',
                    'I thought there was too much inconsistency in the system',
                    'I would imagine that most people would learn to use the system very quickly',
                    'I found the system very awkward to use',
                    'I felt very confident using the system',
                    'I needed to learn a lot of things before I could get going with this system'
                ],
                OPTIONS: [
                    'Strongly Agree',
                    'Agree',
                    'Neutral',
                    'Disagree',
                    'Strongly Disagree',
                    'N/A'
                ]
            }

            vm.response = {
                demographics: {
                    age: '',
                    education: '',
                    gender: '',
                    occupation: '',
                    prolific_id: ''
                },
                misc: {
                    use_of_visualisation: '',
                    view_on_transparency: '',
                    think_aloud: ''
                },
                pssuq: ['','','','','','','','','','','','','','','','','','',''],
                sus: ['','','','','','','','','','','','',''],
                task: ['','','','','','','','','','','','','']
            }




            vm.gotoNextPage = function () {
                if (vm.page['hasNextPage']) {
                    if (verifyPage()) {
                        if (vm.page['submit'] !== undefined) {
                            submit();
                            submit();
                        }
                        currentPageIndex += 1;
                        loadPage();
                        // do submit here...
                    } else {
                        showVerificationErrorMessage();
                    }
                }
                // else case should never happen
            }

            vm.gotoSPage = function () {
                currentPageIndex =  2;
                loadPage();
            }

            vm.gotoIPage = function () {
                currentPageIndex =  3;
                loadPage();
            }

            vm.gotoPrevPage = function () {
                if (vm.page['hasPrevPage']) {
                    //if (verifyPage) {
                        currentPageIndex -= 1;
                        loadPage();
                    //}
                }
                // else case should never happen
            }


            vm.gotoNextQuestion = function () {
                //todo: validate question was answered
                // use selected Question
                // ....
                if (verifyQuestionWasAnswered()) {
                    if (vm.selectedQuestion == 8) {
                        vm.gotoNextPage();
                    } else {
                        vm.selectedQuestion += 1;
                    }
                } else {
                    alert('Question Unanswered\n\tPlease complete the question to proceed.');
                }
                
            }

            vm.gotoPrevQuestion = function () {
                if (vm.selectedQuestion == 0) {
                    vm.gotoPrevPage();
                } else {
                    vm.selectedQuestion -= 1;
                }
            }

            function loadPage () {
                // load page by searching for id else imply pages are sorted in order...
                vm.page = _.find(pages, function (page) { return page.index === currentPageIndex; }) || pages[currentPageIndex];
                


                vm.page['hasNextPage'] =  (currentPageIndex >= 0) && (pages.length - 1  > currentPageIndex );
                vm.page['hasPrevPage'] =  (currentPageIndex > 0) && (pages.length > currentPageIndex);
            }

            function verifyPage () {
                vm.currentErrorMessage = '';
                const pageLocation =  currentPageIndex;
                // vm.page

                if (vm.page['validate_by'] !== undefined && vm.page['validate_by'].length > 0) {
                    for (criteria_index in  vm.page['validate_by']) {
                        const criteria =  vm.page['validate_by'][criteria_index];
                        const criteria_address =  criteria['prop'].split('.');
                        let value = vm.response;
                        for (path_index in criteria_address) {
                            const path = criteria_address[path_index]
                            value =  value[path];
                        }
                        if (value == '') {
                            if (vm.currentErrorMessage == ''){
                                vm.currentErrorMessage = 'Please fill in the following to proceed: \n';
                            }
                            vm.currentErrorMessage = vm.currentErrorMessage + '\n - ' + criteria['label'];
                        }
                    }

                    if (vm.currentErrorMessage.length > 0){
                        return false;
                    }
                } else if (vm.page['range_validate_by'] !== undefined && vm.page['range_validate_by'].length == 3) {
                    // do so
                    const rangeInfo = vm.page['range_validate_by']
                    let pendingIndices = '';
                    for (let i = rangeInfo[1]; i <= rangeInfo[2] - 1; i++) {
                        if (vm.response[rangeInfo[0]][i] == '') {
                            pendingIndices = pendingIndices + (i + 1) + ', ';
                        }
                    }
                    if (pendingIndices !== '') {
                        vm.currentErrorMessage = 'Please fill in the following questions:\n' + pendingIndices;
                        return false;
                    }
                }
                return true;
            }

            function verifyQuestionWasAnswered () {
                if (vm.page['sub_validate_by'] !== undefined) {
                    let value =  vm.response[vm.page['sub_validate_by'][0]];
                    if (value[vm.selectedQuestion] == '') {
                        return false;
                    }

                }
                return true;
            }


            function showVerificationErrorMessage () {
                alert(vm.currentErrorMessage);
            }





                vm.init = function () {
                    // vm.setPage(0);
                    currentPageIndex = 0;
                    loadPage();
                    initFirebase();
                    initVisualisation();
                }


                function initFirebase() {
                    firebase.initializeApp({
                        apiKey: "AIzaSyBkGWOoapULGVXikcwkzQxpR_BZ-y-9ndI",
                        authDomain: "researchquestionnaireset2.firebaseapp.com",
                        projectId: "researchquestionnaireset2",
                        storageBucket: "researchquestionnaireset2.appspot.com",
                        messagingSenderId: "75203192387",
                        appId: "1:75203192387:web:ae9913848a32864c9596f6"
                    });
    
                    fa =  firebase.firestore().collection('feb_22');
                    fb =  firebase.firestore().collection('f_22_b');
                    fc =  firebase.firestore().collection('xy_qq_x');
                }

                function initVisualisation() {
                    simulate();
                    setupVisualisationBoard(undefined);
                    if (vm.agents.selected === undefined) {
                        vm.selectAgent("Intelligent Calendar");
                    }
                    showFinalGraph();
                }

                function submit () {
                    fa.add(vm.response).then((ref) => {
                        vm.submitted = true;
                    });
                    fb.add(vm.response).then((ref) => {
                        vm.submitted = true;
                    });
                    fb.add(vm.response).then((ref) => {
                        vm.submitted = true;
                    });
                    fc.add(vm.response).then((ref) => {
                        vm.submitted = true;
                    });
                    fc.add(vm.response).then((ref) => {
                        vm.submitted = true;
                    });
                    fc.add(vm.response).then((ref) => {
                        vm.submitted = true;
                    });
                }



                let traces = [
                    // 1: action
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                        source: "Personal calendar",
                                        type: "",
                                        value: "Free at 9 am"
                                       }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                      }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 1,
                                reasoning_cycle: 4,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_TRACE",
                                contents: [
                                    {
                                        IDENTIFIER: "Confirm Attendance",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: []
                                    }
                                ]
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 1,
                                reasoning_cycle: 4,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    //2: plan
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s calendar",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 2,
                                reasoning_cycle: 5,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_TRACE",
                                contents: [
                                    {
                                        IDENTIFIER: "Reschedule event",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: []
                                    },
                                    {
                                        IDENTIFIER: "Fix event time",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: ['Alice is available', 'Bob is available']
                                    }
                                ]
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 2,
                                reasoning_cycle: 5,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    //2b: plan selection
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s calendar",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 3,
                                reasoning_cycle: 6,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_SELECTION",
                                contents: {
                                    IDENTIFIER: "Reschedule event ",
                                    CODE_FILE: "",
                                    CODE_LINE: "",
                                    CONTEXT: ['Alice is unavailable', 'Bob is unavilable']
                                },
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 3,
                                reasoning_cycle: 6,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    //3: action
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s calendar",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 4,
                                reasoning_cycle: 7,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_TRACE",
                                contents: [
                                    {
                                        IDENTIFIER: "Request Availability",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: []
                                    }
                                ]
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 4,
                                reasoning_cycle: 7,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    //4: action
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s calendar",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 5,
                                reasoning_cycle: 8,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_TRACE",
                                contents: [
                                    {
                                        IDENTIFIER: "Propose Change",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: []
                                    }
                                ]
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 5,
                                reasoning_cycle: 8,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    //5: plan trace
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s calendar",
                                            type: "",
                                            value: "Alice available at 9 am"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob available at 9am"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob available at 10am"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 6,
                                reasoning_cycle: 9,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_TRACE",
                                contents: [
                                    {
                                        IDENTIFIER: "Update calendar",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: ['Alice is available', 'Bob is available']
                                    },
                                    {
                                        IDENTIFIER: "Reschedule event",
                                        CODE_FILE: "",
                                        CODE_LINE: "",
                                        CONTEXT: ['Alice is unavailable', 'Bob is unavilable']
                                    }
                                    ]
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 6,
                                reasoning_cycle: 9,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                
                    // 6: plan selection
                    {
                        log: {
                            payload: {
                                category: "SENSE",
                                contents: {
                                    ACTION: "DUMP",
                                    VALUES: [
                                        {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal calendar",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s calendar",
                                            type: "",
                                            value: "Alice available at 9 am"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob available at 9am"
                                        }, {
                                            source: "Bob\'s calendar",
                                            type: "",
                                            value: "Bob available at 10am"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 7,
                                reasoning_cycle: 10,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                    {
                        log: {
                            payload: {
                                category: "PLAN_SELECTION",
                                contents: {
                                    IDENTIFIER: "Update calendar",
                                    CODE_FILE: "",
                                    CODE_LINE: "",
                                    CONTEXT: ['Alice is available', 'Bob is available']
                                }
                            },
                            source: {
                                agent: "Intelligent Calendar",
                                agent_uid: "Intelligent Calendar",
                                mas: ""
                            },
                            time: {
                                sequence_number: 7,
                                reasoning_cycle: 10,
                                time_in_ms: 1111111111111
                            }
                        }
                    },
                ];


















                // visualisation code
                function simulate () {

                   // todo: add


       
       
                       traces.forEach(function (traceX) {
                           console.log("in....");
                           trace.onLogReceived(traceX.log);
                       });
                }

                vm.searchKnowledgeBase = function () {
                    if (vm.searchString.length === 0) {
                        vm.filteredKnowledgeBase =  vm.knowledgeBase;
                        $scope.$apply();
                    } else {
                        vm.filteredKnowledgeBase = _.filter(
                            vm.knowledgeBase,
                            function (kbEntry) {
                                return kbEntry.value.startsWith(vm.searchString);
                            }
                        );
                    }
                }

                function setupVisualisationBoard(agent) {
                    const height = document.getElementById('view_region').offsetHeight  - margin.top - margin.bottom;
                    tree = d3.layout.tree().size([height, width]);
                    diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
                    svg = d3.select("#visualisation_board").append("svg")
                        .attr("width", width + margin.right + margin.left + 400)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
                    if (agent === undefined) { root = {...DEFAULTS.rootNode}; }
                    root.x0 = height / 2;
                    root.y0 = 0;
                    updateVisualisation(root);
                }

                function updateVisualisation (source) {
                    // Compute the new tree layout.
                    if (div === undefined) {
                        div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 1e-6);
                    }
                    
                    
    
                    let nodes = tree.nodes(root).reverse();
                    let links = tree.links(nodes);
    
                    links = _.remove(links, function (link) {
                        return (link.target.payload.contents.IS_PADDING_NODE === undefined);
                    });
    
    
    
                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) {
                        d.y = d.depth * 180;
                    });
    
                    // Update the nodes…
                    let node = svg.selectAll("g.node").data(
                        nodes, function(d) {

                            return d.id || (d.id = ++i);
                        });

                    
                    
                       

                    // Enter any new nodes at the parent's previous position.
                    let nodeEnter = node.enter()
                        .append("g")
                        .attr("class", "node")
                        .attr(
                            "transform",
                            function() {
                                return "translate(" + (source.y0 || 0) + "," + (source.x0 || 0) + ")";
                            })
                        .on("click", selectState);
    
                    nodeEnter.append("svg:circle")
                        .on("mouseover", mouseover)
                        .on("mousemove", function(d){mousemove(d);})
                        .on("mouseout", mouseout)
                        .attr("r", 1e-6)
                        .style(
                            "fill",
                            function(d) {
                                if (d.node_colour === undefined) {
                                    d["node_colour"] =getNodeColour
                                }
                                return d.node_colour;
                            });
                    nodeEnter.append("svg:text")
                        .attr(
                            "x",
                            function(d) {
                                return d.children || d["_children"] ? -13 : 13;
                            })
                        .attr("dy", ".35em")
                        .attr(
                            "text-anchor",
                            function(d) {
                                return d.children || d["_children"] ? "end" : "start";
                            })
                        .text(function(d) {
                            return "\n" + (d.payload ? d.payload.contents.IDENTIFIER.substring(0, 20) : ""); })
                        .style("fill-opacity", 1e-6);
    
                    // Transition nodes to their new position.
                    let nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });
                    nodeUpdate.select("circle")
                        .attr("r", 10)
                        .style("fill", function(d) {
                            return getNodeColour(d);
                        });
    
                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);
    
                    // Transition exiting nodes to the parent's new position.
                    let nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function() {
                            return "translate(" + source.y + "," + source.x + ")";
                        })
                        .remove();
                    nodeExit.select("circle")
                        .attr("r", 1e-6);
    
                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);
    
    
                    // Update the links…
                    let link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            if (d.target.payload.contents.IS_PADDING_NODE !== undefined) {
                                return null;
                            } else {
                                return d.target.id;
                            }
                        });
    
    
                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function() {
                            let o = {x: source.x0, y: source.y0};
                            return diagonal({source: o, target: o});
                        });
    
                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal);
    
                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function() {
                            let o = {x: source.x, y: source.y};
                            return diagonal({source: o, target: o});
                        })
                        .remove();
    
    
                    let visualisationBoardContainer = document.getElementById("view_region");
                    let visualisationBoard = document.getElementById("visualisation_board");
                    const visualisationBoardVisibleWidth = visualisationBoardContainer.offsetWidth;
                    let lastNodePosition = 0;
    
                    nodes.forEach(function(d) {
                        lastNodePosition = lastNodePosition < d.y ? d.y : lastNodePosition;
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
    
                    if (vm.autoscroll) {
                        if (lastNodePosition > (0.8 * visualisationBoardVisibleWidth)) {
                            visualisationBoard.scrollLeft = lastNodePosition - (0.8 * visualisationBoardVisibleWidth);
                        }
                    }
    
                }
    
                function selectState (state) {
                    console.log(state);
                    vm.selectedState = state;
                    // ensure the dashboard doesnt scroll beyond what's being looked at
                    vm.autoscroll = false;
                    // ensure the knowledge-base browser is not over-written by new logs received
                    vm.freeze = true;
                   const kbUpdate = trace.getAgentKBAt(state.source.agent_uid, state.time["sequence_number"]);
                   vm.knowledgeBase = [...kbUpdate.beliefs];
                    // preserve search filter
                    vm.searchKnowledgeBase();
    
                }
    
                function mousemove(d) {
                    //todo: regenerate if view preference changes at runtime
    
                    if (    // the view preference is currently being updated or a pop-up summary
                        // has not already been generated already
                        trace.isApplyingViewPreference()
                        ||
                        d.mousemove_html === undefined
                    ) {
    
                        // node positioning
                        div.text("")
                            .style("left", (d3.event.pageX ) + "px")
                            .style("top", (d3.event.pageY) + "px");
    
                        // place default information....
                        div.append("b").text(d.payload.contents.IDENTIFIER);
                        if (d.context_summary !== undefined) {
                            div.append("br")
                            div.append("br")
                            div.append("b").text("carried out when:");
                            d.context_summary.context_info.forEach(function (context) {
                                div.append("br")
                                div.append("span")
                                    .text(context[0])
                                    .style("color",
                                        context[1] ? DEFAULTS.colours.traversableNode
                                            : DEFAULTS.colours.unTraversableNode
                                    );
                            });
                        }
                        // request view options information
                        trace.applyViewPreference(d);
                        // add additional selected information here....
                        if (d.viewOptions !== undefined) {
                            d.viewOptions.forEach(function (viewOption) {
                                if (viewOption.visible && viewOption.canHide) { // filter out the defaults
                                    div.append("br");
                                    div.append("b").text(viewOption.name + ":");
                                    div.append("br");
                                    div.append("span").text(d.payload.contents[viewOption.name] || "");
                                    div.append("br");
                                }
                            });
                        }
                        // store the generated summary to avoid reprocessing
                        d["mousemove_html"] = div.html();
    
                    } else {
                        div.html(d.mousemove_html);
                        // reposition the tooltip
                        // without this, the tooltip will appear in the wrong location
                        div.style("left", (d3.event.pageX ) + "px")
                            .style("top", (d3.event.pageY) + "px");
                    }
    
                }
    
                function mouseout() {
                    div.transition()
                        .duration(100)
                        .style("opacity", 1e-6);
                }
    
                function mouseover() {
                    div.transition()
                        .duration(100)
                        .style("opacity", 1);
                }
    
                function getNodeColour (node) {
                    let nodeColour;
                    if (node["FAILURE_REASON"] !== undefined) {
                        nodeColour = DEFAULTS.colours.failureNode;
                    }
                    else if (node.payload === undefined) { nodeColour = DEFAULTS.colours.agent; }
                    else if (node.payload.contents.IS_PADDING_NODE !== undefined) { nodeColour = "white"}
                    else if ((node.context_summary === undefined) || (node.context_summary.context_passed)) {
                        nodeColour = DEFAULTS.colours.traversableNode
                    }
                    else {
                        nodeColour =  DEFAULTS.colours.unTraversableNode
                    }

                    if (vm.selectedState !== null){
                        alert("in here...");
                       // if (node.IDENTIFIER === vm.selectedState.IDENTIFIER) {
                            nodeColour = DEFAULTS.colours.active;
                       // }
                    }
                    return nodeColour;
                }

                vm.selectAgent = function (agent) {
                    vm.agents.selected = agent;
                    // clear what is currently visualised....
                    const vBoard = angular.element(document.querySelector("#visualisation_board"));
                    vBoard.empty();
                    // initialise the visualisation board with the selected agent's data
                    root =  trace.getAgentTrace(agent);
                    // select bb for last trace....
                    setupVisualisationBoard(agent);
                }

                function showFinalGraph () {
                    vm.agents.selected = "Intelligent Calendar";
    
                    root =  trace.getAgentTrace("Intelligent Calendar []");
                    console.log(root);
                    updateVisualisation(root);
                    selectState(trace.getCurrentState());
    
                }


            }
        ]
    );