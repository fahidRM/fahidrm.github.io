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
                        CONTEXT: ['Alice is unavailable', 'Bob is unavailable']
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
                    IDENTIFIER: "Reschedule event",
                    CODE_FILE: "",
                    CODE_LINE: "",
                    CONTEXT: []
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
                        CONTEXT: ['Alice is vailable', 'Bob is avilable']
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