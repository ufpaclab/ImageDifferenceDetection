function ImageDifferenceDetection(jsPsychHandle, urlParameters) {
    jsPsychHandle.data.addProperties(urlParameters);
    const IMAGES_PER_SUBJECT = 40;
    let manifest = [];

    // START MODIFY NEEDED
    let sessionBuilder = new SessionBuilder();
    sessionBuilder.createSession(RunExperiment)

    function ChooseImageSet(session) {
        DisplayLoader('Please wait while we set up the experiment...');

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
            RunExperiment(session);
        })
    }
    // END

    function RunExperiment(session) {
        let welcomeTrial = {
            type: 'html-keyboard-response',
            stimulus: `
                <p>Welcome to the experiment.</p>
                <p>Press any key to begin.</p>
            `
        }

        let consentFormTrial = {
            type: 'external-html',
            url: 'resources/Consent.html',
            cont_btn: 'consent-button'
        }

        let getSex = {
            type: 'survey-multi-choice',
            questions: [
                {
                    name: 'sex',
                    prompt: 'What is your sex assigned at birth?',
                    options: ['Male', 'Female', 'Other'],
                    required: true
                }
            ]
        }

        let getAge = {
            type: 'survey-text',
            questions: [{
                name: 'age',
                prompt: 'What is your age (e.g. 20, 45, 63)?',
                required: true,
                columns: 3
            }]
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
                '<p>If you have difficulty spotting the change, you can wait 20 seconds and a button will appear that will allow you to reveal the change.</p>' +
                '<p>The change will be highlighted with a light blue box</p>'
                ,
                '<p>When you are ready, continue to the experiment. Please do your best to provide quick and accurate ratings. Thank you in advance for your hard work!</p>'
            ]
        }

        function createDifferenceDetectionStimulus(suffix = '') {
            return () => `
            <div class="differenceDetectionElement differenceDetectionContainer">
                <img class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('leftImage', true)}"/>
                <img style="display:inline-block;" id="differenceDetectionRightMain" class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('rightImage', true)}"/>
                <img style="display:none;" id="differenceDetectionRightAlt" class="differenceDetectionElement differenceDetectionImage" src="resources/${jsPsychHandle.timelineVariable('rightAltImage', true)}"/>
            </div>
            <button style="display:none;" id="viewAlt">Reveal Change</button>
            <div>${suffix}</div>`
        };

        function createStandardLikert(name, question, leftlabel, rightlabel, scale) {
            return {
                type: 'survey-likert',
                scale_width: 500,
                preamble: createDifferenceDetectionStimulus(),
                questions: [
                    {
                        name: name,
                        prompt: question,
                        labels: function () {
                            let labels = [];
                            labels.push(leftlabel);
                            for (let i = 0; i < scale - 2; i++)
                                labels.push('');
                            labels.push(rightlabel);
                            return labels;
                        }(),
                        required: true
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
                require_movement: true
            }
        }

        let differenceDetection = {
            button_label: 'Submit',
            on_start: function () {
                this.on_finish = DelayedReveal('viewAlt', 20000);
            },
            timeline: [
                createContinuousSlider('How much does the meaning change from one picture to the other?', 'Insignificant Change', 'Very Significant Change'),
                createStandardLikert('Likely', 'How likely is it for the <b>image on the right</b> to appear in the real world?', 'Very Unlikely', 'Very Likely', 7),
                createStandardLikert('Complicated', 'How visually complicated are the images?', 'Very Simple', 'Very Complicated', 7),
                createStandardLikert('Hard', 'How hard is it to identify the change in the image?', 'Very Easy', 'Very Hard', 7)
            ],
            data: function () {
                return {
                    image: jsPsychHandle.timelineVariable('leftImage', true)
                }
            },
            timeline_variables: function () {
                let variables = [];
                let images = jsPsych.randomization.sampleWithoutReplacement(manifest);
                for (let i = 0; i < images.length; i++) {
                    variables.push({
                        leftImage: `${images[i].name}.${images[i].extension}`,
                        rightImage: `${images[i].name}_2.${images[i].extension}`,
                        rightAltImage: `${images[i].name}_3.${images[i].extension}`
                    })
                }
                return variables;
            }()
        }

        let finalTrial = {
            type: 'instructions',
            pages: [`Thanks for participating! Push the right arrow key to finish the experiment.`],
        }

        // Configure and Start Experiment
        jsPsychHandle.init({
            timeline: [
                welcomeTrial,
                consentFormTrial,
                getSex,
                getAge,
                experimentInstructionsTrial,
                differenceDetection,
                finalTrial
            ],
            // START MODIFY NEEDED
            on_trial_finish: function (data) {
                session.insert(data);
            },
            on_finish: function () {
                DisplayLoader('Please wait while we clean up...');
                session.updateImageUsage(manifest);
                setTimeout(() => { }, 5000);
                window.top.location.href = 'https://www.prolific.co/';
            }
            // END
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

    function DisplayLoader(text) {
        const waitText = document.createElement('h1');
        waitText.id = 'loader-text';
        waitText.innerHTML = text;
        document.body.appendChild(waitText);
        const waitLoader = document.createElement('div');
        waitLoader.id = 'loader';
        document.body.appendChild(waitLoader);
    }

    function DelayedReveal(id, delay) {
        let trialIsFinished = false;

        const [SwapRightImage, ResetSwapRightImage] = function () {
            let showAltImage = true;
            return [
                function () {
                    let hiddenImage = document.getElementById('differenceDetectionRightAlt');
                    let shownImage = document.getElementById('differenceDetectionRightMain');

                    if (showAltImage) {
                        let temp = hiddenImage;
                        hiddenImage = shownImage;
                        shownImage = temp;
                    }

                    hiddenImage.style.display = 'none';
                    shownImage.style.display = 'inline-block';
                    showAltImage = !showAltImage;
                },
                function () {
                    showAltImage = true;
                }
            ];
        }()

        async function reveal() {
            setTimeout(() => {
                if (!trialIsFinished)
                    document.getElementById(id).style.display = '';
                document.getElementById(id).onclick = SwapRightImage;
            }, delay)
        }
        reveal();

        return function () {
            trialIsFinished = true;
            ResetSwapRightImage();
        }
    }
}