function ImageDifferenceDetection(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // Define Constants
        const CONTACT_EMAIL = 'fake@email.com'

        const IMAGE_QUESTIONS = [
            {
                question: 'How much does the meaning change from one picture to the other?',
                leftLabel: 'Insignificant Change',
                rightLabel: 'Very Significant Change',
                min: 1,
                max: 7
            },
            {
                question: 'How weird is the image?',
                leftLabel: 'Very Normal',
                rightLabel: 'Very Weird',
                min: 1,
                max: 7
            },
            {
                question: 'How likely is it to see this image in the real world?',
                leftLabel: 'Very Unlikely',
                rightLabel: 'Very Likely',
                min: 1,
                max: 7
            },
            {
                question: 'How hard is it to identify the object?',
                leftLabel: 'Very Easy',
                rightLabel: 'Very Hard',
                min: 1,
                max: 7
            },
            {
                question: 'How visually complicated is the image?',
                leftLabel: 'Very Simple',
                rightLabel: 'Very Complicated',
                min: 1,
                max: 7
            }
        ]

        // Define Experiment Trials
        let welcomeTrial = {
            type: 'html-keyboard-response',
            stimulus:`
                <p>Welcome to the experiment.</p>
                <p>Press any key to begin.</p>
            `
        }

        let differenceDetection = {
            type: 'html-slider-response',
            start: 1,
            min: jsPsychHandle.timelineVariable('min'),
            max: jsPsychHandle.timelineVariable('max'),
            button_label: 'Submit',
            timeline: [
                {
                    stimulus: function() {
                        return `
                        <div class="differenceDetectionElement">
                            <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('leftImage', true)}"/>
                            <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('rightImage', true)}"/>
                        </div>
                        <p>${jsPsychHandle.timelineVariable('question', true)}</p>
                        <div style="overflow: hidden">
                            <p style="float: left; padding-left: 10%">${jsPsychHandle.timelineVariable('leftLabel', true)}</p>
                            <p style="float: right; padding-right: 10%">${jsPsychHandle.timelineVariable('rightLabel', true)}</p>
                        </div>
                        `
                    },
                }
            ],
            timeline_variables: function() {
                let variables = []
                for (let image = 0; image < IMAGE_MANIFEST.length; image++) {
                    for (let question = 0; question < IMAGE_QUESTIONS.length; question++) {
                        variables.push({
                            leftImage: `${IMAGE_MANIFEST[image].name}.${IMAGE_MANIFEST[image].extension}`,
                            rightImage: `${IMAGE_MANIFEST[image].name}_2.${IMAGE_MANIFEST[image].extension}`,
                            question: IMAGE_QUESTIONS[question].question,
                            leftLabel: IMAGE_QUESTIONS[question].leftLabel,
                            rightLabel: IMAGE_QUESTIONS[question].rightLabel,
                            min: IMAGE_QUESTIONS[question].min,
                            max: IMAGE_QUESTIONS[question].max
                        })
                    }
                }
                return variables;
            }()
        }

        let finalTrial = {
            type: 'instructions',
            pages: [`Thanks for participating! Please email us at ${CONTACT_EMAIL}. Push the right arrow key to recieve credit.`]
        }

        // Configure and Start Experiment
        jsPsychHandle.init({
            timeline: [welcomeTrial, differenceDetection, finalTrial],
            on_trial_finish: session.insert,
            on_finish: function() { document.write("<h1>Experiment Complete</h1>") }
        })
    }
}