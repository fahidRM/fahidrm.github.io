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
                        source: "Settings",
                        type: "",
                        value: "Preferred Temp: 14 C"
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
                        IDENTIFIER: "Check Temperature",
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
                            source: "Settings",
                            type: "",
                            value: "Preferred Temp: 14 C"
                           }, {
                                source: "Thermometer",
                                type: "",
                                value: "Current Temp: 10 C"
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
                        IDENTIFIER: "Turn on Heater",
                        CODE_FILE: "",
                        CODE_LINE: "",
                        CONTEXT: ["Temp below preference"]
                    },
                    {
                        IDENTIFIER: "Turn off Heater",
                        CODE_FILE: "",
                        CODE_LINE: "",
                        CONTEXT: ['Temp above preference']
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
                            source: "Settings",
                            type: "",
                            value: "Preferred Temp: 14 C"
                           }, {
                                source: "Thermometer",
                                type: "",
                                value: "Current Temp: 10 C"
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
                    IDENTIFIER: "Turn on Heater",
                    CODE_FILE: "",
                    CODE_LINE: "",
                    CONTEXT: ["Temp below preference"]
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
   
   // 1: action
    {
        log: {
            payload: {
                category: "SENSE",
                contents: {
                    ACTION: "DUMP",
                    VALUES: [
                        {
                        source: "Settings",
                        type: "",
                        value: "Preferred Temp: 14 C"
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
                        IDENTIFIER: "Check Temperature",
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
                            source: "Settings",
                            type: "",
                            value: "Preferred Temp: 14 C"
                           }, {
                                source: "Thermometer",
                                type: "",
                                value: "Current Temp: 10 C"
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
                        IDENTIFIER: "Turn on Heater",
                        CODE_FILE: "",
                        CODE_LINE: "",
                        CONTEXT: ["Temp below preference"]
                    },
                    {
                        IDENTIFIER: "Turn off Heater",
                        CODE_FILE: "",
                        CODE_LINE: "",
                        CONTEXT: ['Temp above preference']
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
                            source: "Settings",
                            type: "",
                            value: "Preferred Temp: 14 C"
                           }, {
                                source: "Thermometer",
                                type: "",
                                value: "Current Temp: 10 C"
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
                    IDENTIFIER: "Turn off Heater",
                    CODE_FILE: "",
                    CODE_LINE: "",
                    CONTEXT: ["Temp above preference"]
                },
            },
            source: {
                agent: "Intelligent Calendar",
                agent_uid: "Intelligent Calendar",
                mas: ""
            },
            time: {
                sequence_number: 6,
                reasoning_cycle: 6,
                time_in_ms: 1111111111111
            }
        }
    },


];