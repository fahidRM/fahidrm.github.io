angular.module('study-platform', [
    'app.util',
    'app.trace',
    'app.pages'
]);

angular.module('app.pages', [])
    .controller(
        'NonExpertStudy', ['$scope', '$rootScope', 'TraceService', function($scope, $rootScope, trace) {

            let vm = this;
            vm.currentPage = {};
            vm.showScenario =  false;

            

            // VIZ

            const DEFAULTS = {
                colours: {
                    agent: "#000000",
                    failureNode: "#f8c291",
                    traversedNode: "#16a085",
                    traversableNode: "#1abc9c",
                    unTraversableNode: "#e74c3c"
                },
                maxTries:  1,
                recognisedTypes: ["belief", "message", "norm", "percept", "sensor", "value"],
                rootNode: {payload: { contents: { IDENTIFIER: "[My Agent]"} }},
            }

            vm.agents = {all: [], selected: undefined};  // known agents
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



            

            
            let currentPageIndex = 0;

            const pages = [
                { 
                    index: 2, 
                    title: 'Intro', 
                    showHeaderBar: false 
                }, 
                { 
                    index: 1, 
                    title: 'Demographics', 
                    showHeaderBar: false , 
                    subtitle: "All submissions are anonymous though we need a few non-identifying demographic information. Note: You may choose not to answer a question by selecting the option 'I\'d rather not say'"
                }, 
                { 
                    index: 5, 
                    title: 'Task Scenario', 
                    showHeaderBar: false, 
                    subtitle: "you can return to this page at any point during the study",
                    intro: "Your employer has recently introduced a smart calendar to help improve meeting attendance. A smart calendar may reschedule your events in advance and provides an interactive visualisation to explain its actions (as shown below).",
                    list_intro: "Event:   On Friday, you had scheduled your Monday appointments as follows (before the smart calender made adjustments):",
                    list: [
                        { time: "10:00am    -   11:00am", note :"Meeting with Selena & Alison" },
                        { time: "1:00pm	-	3:00pm", note :"Meeting with Chelsea & Derek" },
                        { time: "4:00pm	-	5:00pm", note :"Meeting with Alice & Bob" }
                    ],
                    list_two_intro: "On Monday, your calendar had been rescheduled as follows (after the smart calender made adjustments):",
                    list_two: [
                        { time: "9:00am	-	19:00am", note :"Meeting with Selena & Alison" },
                        { time: "10:00am	-	11:00am", note :"Meeting with Chelsea & Derek" },
                        { time: "1:00pm	-	3:00pm", note :"Meeting with Alice & Bob" }
                    ],
                    comment: "The justification provided by your calender is presented below:",
                    comment_2: "The smart calender has provided a justification for its actions using a diagram. You will be presented with this shortly",
                    closing_remarks: "Important: The visualisation is interactive, the nodes represent actions taken by the calender. The red nodes represent actions that were not possible at the time of decision making. Clicking on a node shows the information available to the calendar at the point of its decision making (This appears on the left of the screen).",
                }, 
                { 
                    index: 3, 
                    title: 'Task', 
                    showHeaderBar: true,  
                    list: [
                        "Watch video on how to interprete the visualisation",
                        "Interact with the transparency visualisation",
                        "Answer a few questions related to the data contained in the visualisation",
                        "Reflect on your experience by answering a few questions"
                    ]
                }, 
                { 
                    index: 0, 
                    title: 'Using the visualisation', 
                    showHeaderBar: true , 
                    subtitle: ""
                },
                { 
                    index: 5, 
                    title: 'Questionnaire 1 of 2', 
                    showHeaderBar: true , 
                    subtitle: ""
                }, 
                { 
                    index: 6, 
                    title: 'Questionnaire 2 of 2', 
                    showHeaderBar: true  
                }, 
                { 
                    index: 7, 
                    title: 'Final Feedback', 
                    showHeaderBar: true  
                }, 
                { 
                    index: 8, 
                    title: 'Closing', 
                    showHeaderBar: true  
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

            ];

            vm.PSSUQ = [
                'a', 'b'
            ]
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
                    view_on_transparency: ''
                },
                pssuq: ['','','','','','','','','','','','',''],
                sus: ['','','','','','','','','','','','',''],
                task: ['','','','','','','','','','','','','']
            }



            vm.gotoNextPage = function () {
                if (vm.currentPage['hasNextPage']) {
                    if (verifyPage) {
                        currentPageIndex += 1;
                        loadPage();
                    }
                }
                // else case should never happen
            }

            vm.gotoPrevPage = function () {
                if (vm.currentPage['hasPrevPage']) {
                    //if (verifyPage) {
                        currentPageIndex -= 1;
                        loadPage();
                    //}
                }
                // else case should never happen
            }


            vm.log = function () {
                console.log(vm.response);
                vm.gotoNextPage();
            }

            vm.init =  function () {
                loadPage();
                simulate();
                setupVisualisationBoard(undefined);
                if (vm.agents.selected === undefined) {
                    vm.selectAgent("agent1");
                }
                //$scope.$apply();
                showFinalGraph();
            }

            function loadPage () {
                // load page by searching for id else imply pages are sorted in order...
                vm.currentPage = _.find(pages, function (page) { return page.index === currentPageIndex; }) || pages[currentPageIndex];
                


                vm.currentPage['hasNextPage'] =  (currentPageIndex >= 0) && (pages.length > currentPageIndex);
                vm.currentPage['hasPrevPage'] =  (currentPageIndex > 0) && (pages.length > currentPageIndex);
            }

            function verifyPage () {

            }


            vm.getPssuqAdjectives = function () {
                // calculate score
                // get adjective
            }

            vm.getSusAdjective = function () {
                // get adjective
            }


            function simulate () {

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
                                        source: "Personal Calender",
                                        type: "",
                                        value: "Free at 9 am"
                                       }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                      }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s Calender",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                        CONTEXT: ['Alice is Available', 'Bob is Available']
                                    }
                                ]
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s Calender",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                    IDENTIFIER: "Reschedule event",
                                    CODE_FILE: "",
                                    CODE_LINE: "",
                                    CONTEXT: []
                                },
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s Calender",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s Calender",
                                            type: "",
                                            value: "Alice Unavailable"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob Available"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s Calender",
                                            type: "",
                                            value: "Alice available at 9 am"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob available at 9am"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob available at 10am"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                        CONTEXT: ['Alice is unvailable', 'Bob is unvailable']
                                    }
                                    ]
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 9 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 11 am"
                                        }, {
                                            source: "Personal Calender",
                                            type: "",
                                            value: "Free at 12 pm"
                                        },
                                        {
                                            source: "Alice\'s Calender",
                                            type: "",
                                            value: "Alice available at 9 am"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob available at 9am"
                                        }, {
                                            source: "Bob\'s Calender",
                                            type: "",
                                            value: "Bob available at 10am"
                                        }
                                    ]
                                }
                            },
                            source: {
                                agent: "agent1",
                                agent_uid: "agent1",
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
                                agent: "agent1",
                                agent_uid: "agent1",
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
   
   
                   traces.forEach(function (traceX) {
                       console.log("in....");
                       trace.onLogReceived(traceX.log);
                   });
            }

            function showFinalGraph () {
                vm.agents.selected = "agent1";
                root =  trace.getAgentTrace("agent1 []");
                console.log(root);
                updateVisualisation(root);
                selectState(trace.getCurrentState());

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
                // ensure the dashboard doesnt scroll beyond what's being looked at
                vm.autoscroll = false;
                // ensure the knowledge-base browser is not over-written by new logs received
                vm.freeze = true;
               const kbUpdate = trace.getAgentKBAt(state.source.agent_uid, state.time["sequence_number"]);
                vm.knowledgeBase = [...kbUpdate.beliefs, ...kbUpdate.removedBeliefs];
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
                        div.append("b").text("context:");
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
                return nodeColour;
            }

            vm.searchKnowledgeBase = function () {
                if (vm.searchString.length === 0) {
                    vm.filteredKnowledgeBase =  vm.knowledgeBase;
                } else {
                    vm.filteredKnowledgeBase = _.filter(
                        vm.knowledgeBase,
                        function (kbEntry) {
                            return kbEntry.value.startsWith(vm.searchString);
                        }
                    );
                }
            }



            vm.getIcon = function(kbEntry) {
                const iconName = DEFAULTS.recognisedTypes.includes(kbEntry.type) ? kbEntry.type : "unknown";
                return kbEntry.isDeleted === undefined ?
                    iconName : iconName + "_deleted";
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

















        }]
    );