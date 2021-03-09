function ImageDifferenceDetection(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // Define Constants
        const CONTACT_EMAIL = 'fake@email.com'

        // Define Experiment Trials
        let welcomeTrial = {
            type: 'html-keyboard-response',
            stimulus:`
                <p>Welcome to the experiment.</p>
                <p>Press any key to begin.</p>
            `
        }

        let differenceDetection = {
            type: 'survey-likert',
            scale_width: 500,
            button_label: 'Submit',
            timeline: [
                {
                    preamble: function() {
                        return `
                        <div class="differenceDetectionElement">
                            <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('leftImage', true)}"/>
                            <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('rightImage', true)}"/>
                        </div>
                        `
                    },
                    questions: [
                        {
                            prompt: 'How much does the meaning change from one picture to the other?',
                            labels: ['Insignificant Change', '', '', '', '', '', 'Very Significant Change']
                        },
                        {
                            prompt: 'How weird is the image?',
                            labels: ['Very Normal', '', '', '', '', '', 'Very Weird']
                        },
                        {
                            prompt: 'How likely is it to see this image in the real world?',
                            labels: ['Very Unlikely', '', '', '', '', '', 'Very Likely']
                        },
                        {
                            prompt: 'How hard is it to identify the object?',
                            labels: ['Very Easy', '', '', '', '', '', 'Very Hard']
                        },
                        {
                            prompt: 'How visually complicated is the image?',
                            labels: ['Very Simple', '', '', '', '', '', 'Very Complicated']
                        }
                    ]
                }
            ],
            timeline_variables: function() {
                let variables = []
                for (let image = 0; image < IMAGE_MANIFEST.length; image++) {
                    variables.push({
                        leftImage: `${IMAGE_MANIFEST[image].name}.${IMAGE_MANIFEST[image].extension}`,
                        rightImage: `${IMAGE_MANIFEST[image].name}_2.${IMAGE_MANIFEST[image].extension}`,
                    })
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