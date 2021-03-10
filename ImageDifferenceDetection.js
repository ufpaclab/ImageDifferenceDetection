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

        function createDifferenceDetectionStimulus(suffix = '') {
            return () => `
            <div class="differenceDetectionElement differenceDetectionContainer">
                <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('leftImage', true)}"/>
                <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('rightImage', true)}"/>
            </div>
            <div>${suffix}</div>`
        };

        function createStandardLikert(question, leftlabel, rightlabel, scale) {
            return {
                type: 'survey-likert',
                scale_width: 500,
                preamble: createDifferenceDetectionStimulus(),
                questions: [
                    {
                        prompt: question,
                        labels: function() {
                            let labels = [];
                            labels.push(leftlabel);
                            for (let i = 0; i < scale - 2; i++)
                                labels.push('');
                            labels.push(rightlabel);
                            return labels;
                        }()
                    }
                ]
            }
        };

        let differenceDetection = {
            button_label: 'Submit',
            timeline: [
                {
                    stimulus: createDifferenceDetectionStimulus('How much does the meaning change from one picture to the other? '),
                    type: 'html-slider-response',
                    slider_width: 500,
                    start: () => Math.random() * 100,
                    labels: ['Insignificant Change', 'Very Significant Change'],
                },
                createStandardLikert('How weird is the image?', 'Very Normal', 'Very Weird', 7),
                createStandardLikert('How likely is it to see this image in the real world?', 'Very Unlikely', 'Very Likely', 7),
                createStandardLikert('How hard is it to identify the object?', 'Very Easy', 'Very Hard', 7),
                createStandardLikert('How visually complicated is the image?', 'Very Simple', 'Very Complicated', 7)
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