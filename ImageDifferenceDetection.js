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
            type: 'html-slider-response',
            start: 4,
            min: 1,
            max: 7,
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            button_label: 'Submit',
            timeline: [
                {
                    stimulus: function() {
                        return `
                        <div class="differenceDetectionElement">
                            <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('leftImage', true)}"/>
                            <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('rightImage', true)}"/>
                        </div>
                        <br></br>
                        <p>Please rate the apparent difference between images (0 = identical, 4 = significant difference, 7 = unrelated images)</p>
                        `
                    },
                }
            ],
            timeline_variables: function() {
                let images = []
                for (let i = 0; i < 10; i++) {
                    images.push({
                        leftImage: 'WF_17.jpg',
                        rightImage: 'WF_17.jpg'
                    })
                }
                return images;
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