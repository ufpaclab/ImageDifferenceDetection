function ExampleExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // Define Constants
        const CONTACT_EMAIL = 'fake@email.com'
        const SONA_URL = `<SONA_URL>&survey_code=${survey_code}`

        // Define Experiment Trials
        let WelcomeTrial = {
            type: 'html-keyboard-response',
            stimulus:`
                <p>Welcome to the experiment.</p>
                <p>Press any key to begin.</p>
            `
        }

        let FinalTrial = {
            type: 'instructions',
            pages: [`Thanks for particpating! Please email us at ${CONTACT_EMAIL}. Push the right arrow key to recieve credit.`]
        }

        // Configure and Start Experiment
        jsPsychHandle.init({
            timeline: [WelcomeTrial, FinalTrial],
            on_trial_finish: session.insert,
            on_finish: function() { window.top.location.href = SONA_URL }
        })
    }
}