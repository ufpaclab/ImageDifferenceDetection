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
            start: 0,
            min: 0,
            max: 100,
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
                        <p>How much does the meaning change from one picture to the other?</p>
                        <div style="overflow: hidden">
                            <p style="float: left">Not at all</p>
                            <p style="float: right">Totally</p>
                        </div>
                        `
                    },
                }
            ],
            timeline_variables: function() {
                let images = []
                for (let i = 0; i < IMAGE_MANIFEST.length; i++) {
                    images.push({
                        leftImage: `${IMAGE_MANIFEST[i].name}.${IMAGE_MANIFEST[i].extension}`,
                        rightImage: `${IMAGE_MANIFEST[i].name}_2.${IMAGE_MANIFEST[i].extension}`
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