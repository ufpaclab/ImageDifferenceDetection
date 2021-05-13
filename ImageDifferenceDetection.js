function ImageDifferenceDetection(jsSheetHandle, jsPsychHandle, survey_code) {
    const IMAGES_PER_SUBJECT = 40;
    let manifest = [];
    
    jsSheetHandle.CreateSession(ChooseImageSet);

    function ChooseImageSet(session) {
        document.write(
            `<h1>Please Wait...</h1>`
        );
        session.getImageUsage(IMAGE_MANIFEST, (totalManifest) => {
            manifest = Shuffle(totalManifest)
            .sort((left, right) => {
                if (left.usage > right.usage)
                    return 1;
                if (right.usage > left.usage)
                    return -1;
                return 0;
            })
            .slice(0, IMAGES_PER_SUBJECT);
        })
        RunExperiment(session);
    }

    function RunExperiment(session) {
        let welcomeTrial = {
            type: 'html-keyboard-response',
            stimulus:`
                <p>Welcome to the experiment.</p>
                <p>Press any key to begin.</p>
            `
        }

        let consentFormTrial = {
            type: 'external-html',
            url: 'resources/Consent.html',
            cont_btn: 'consent-button'
        }

        let experimentInstructionsTrial = {
            type: 'instructions',
            show_clickable_nav: true,
            pages: [
                '<h1> Welcome to the Experiment </h1>' + 
                '<p>Welcome to the experiment! In this task, you will be asked to provide ratings' + 
                ' about pairs of images. Each pair of images contains a specific change, and we will' +
                ' ask you questions about it.</p>'
                ,
                '<p>For each pair of pictures, we will ask you how much the <b>meaning</b> changes from' +
                ' one picture to another.</p>'
                ,
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/soldier with kids 2.jpg"></img>' +
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/soldier with kids 2_2.jpg"></img>' +
                '<p>Above is an example where the meaning has a <b>Very Significant Change</b>.</p>'
                ,
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/casino.jpg"></img>' +
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/casino_2.jpg"></img>' +
                '<p>Above is an example where the meaning has an <b>Insignificant Change</b>.</p>'
                ,
                '<p>For each pair of pictures, we will also ask you how <b>likely</b> it is for the <b>image on the right</b> to appear in the real world.</p>'
                ,
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/kid eating cereal.jpg"></img>' +
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/kid eating cereal_2.jpg"></img>' +
                '<p>Above is an example where the image on the right is <b>Very Unlikely</b> to appear in the real world.</p>'
                ,
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/graduation.jpg"></img>' +
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/graduation_2.jpg"></img>' +
                '<p>Above is an example where the image on the right is <b>Very Likely</b> to appear in the real world.</p>'
                ,
                '<p>For each pair of pictures, we will also ask you how <b>complicated</b> the images are.</p>'
                ,
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/fruit market stand.jpg"></img>' +
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/fruit market stand_2.jpg"></img>' +
                '<p>Above is an example where the images are <b>Very Complicated</b></p>'
                ,
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/dumbo.jpg"></img>' +
                '<img class="differenceDetectionElement differenceDetectionImage" src="resources/dumbo_2.jpg"></img>' +
                '<p>Above is an example where the images are <b>Very Simple</b></p>'
                ,
                '<p>Finally, we will also ask you about how hard it is to identify the change between the images in a given pair.</p>' +
                '<p>We will not give you a reference for this question. Simply report how hard it was for <b>you</b> to identify the difference.</p>'
                ,
                '<p>When you are ready, continue to the experiment. Please do your best to provide quick and accurate ratings. Thank you in advance for your hard work!</p>'
            ]
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

        function createContinuousSlider(question, leftlabel, rightlabel) {
            return {
                stimulus: createDifferenceDetectionStimulus(question),
                type: 'html-slider-response',
                slider_width: 500,
                start: () => Math.random() * 100,
                labels: [leftlabel, rightlabel],
            }
        }

        let differenceDetection = {
            button_label: 'Submit',
            timeline: [
                createContinuousSlider('How much does the meaning change from one picture to the other?', 'Insignificant Change', 'Very Significant Change'),
                createStandardLikert('How likely is it for the <b>image on the right</b> to appear in the real world?', 'Very Unlikely', 'Very Likely', 7),
                createStandardLikert('How visually complicated are the images?', 'Very Simple', 'Very Complicated', 7),
                createStandardLikert('How hard is it to identify the change in the image?', 'Very Easy', 'Very Hard', 7)
            ],
            timeline_variables: function() {
                let variables = [];
                console.log(manifest);
                let images = jsPsych.randomization.sampleWithoutReplacement(manifest);
                for (let i = 0; i < images.length; i++) {
                    variables.push({
                        leftImage: `${images[i].name}.${images[i].extension}`,
                        rightImage: `${images[i].name}_2.${images[i].extension}`,
                    })
                }
                return variables;
            }()
        }

        let finalTrial = {
            type: 'instructions',
            pages: [`Thanks for participating! Push the right arrow key to finish the experiment.`]
        }

        // Configure and Start Experiment
        jsPsychHandle.init({
            timeline: [
                welcomeTrial,
                chooseImageSet,
                consentFormTrial,
                experimentInstructionsTrial,
                differenceDetection,
                finalTrial
            ],
            on_trial_finish: session.insert,
            on_finish: function() { 
                session.updateImageUsage(manifest)
                document.write("<h1>Experiment Complete</h1>")
            }
        })
    }

    function Shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array.slice(0);
    }
}