var game = {

    currentPage: null,
    loadPage: function(pageName, opts = {}){
        /* Load a page.
            opts: {
                transition: what CSS animation to use
            }
        */
       
        if(!pageName) throw "need a page name!";
        if(!this.pages[pageName]) throw `page ${pageName} doesn't exist`;

        /* Clean up existing page */
        if(this.currentPage && this.pages[this.currentPage].onunload){
            this.pages[this.currentPage].onunload();
        }

        /* Show page */
        let fromPage = `.game-page-${this.currentPage}`;
        let toPage = `.game-page-${pageName}`
        $(toPage).addClass('visible')
        if(opts.transition && !opts.twoStep){
            if(this.currentPage){
                $(fromPage).addClass(opts.transition + ' out')
            }

            $(toPage).one('msAnimationEnd animationEnd oAnimationEnd', function(){
                /* once animation has finished, hide fromPage and clean up animation
                classes */
                $(fromPage).removeClass('visible out')
                $(toPage).removeClass('in');
                $(`${fromPage}, ${toPage}`).removeClass(opts.transition);
            })
        } else if(opts.transition && opts.twoStep) {
            if(this.currentPage){
                $(fromPage).addClass(opts.transition + ' out')
            }

            $(fromPage).one('msAnimationEnd animationend oAnimatioNEnd', function(){
                console.log('toPage start...')
                $(fromPage).removeClass('visible out');
                $(toPage).addClass(opts.transition + ' in')
            })

            $(toPage).one('msAnimationEnd animationEnd oAnimationEnd', function(){
                /* once animation has finished, hide fromPage and clean up animation
                classes */
                $(fromPage).removeClass('visible out')
                $(toPage).removeClass('in');
                $(`${fromPage}, ${toPage}`).removeClass(opts.transition);
            })
        } else {
            $(fromPage).removeClass('visible');
        }

        /* Run initialisation code for new screen */
        if(this.pages[pageName].onload) this.pages[pageName].onload();

        /* Remember what page we're on so we can clean it up before we exit
        it */
        this.currentPage = pageName;
    },

    pages: {},

    helpers: {
        goHome: function(){
            game.sfx.play('xylo');
            game.modal.hide();
            game.loadPage('title', {
                transition: 'circle',
                twoStep: true
            });  
        },
        homePrompt: function(){
            /* Shows home prompt in a modal. */
            let content = `
                <p>Are you sure?</p>
                <p>If you stop now, you'll have to start from the beginning!</p>
            `;
 
            let actions = `
                <div class="modal-action">
                    <button onclick="game.helpers.goHome()" class="btn-circle btn-96 btn-yes"></button>
                    <div class="modal-action-label">Yes, Go Home</div>
                </div>
                <div class="modal-action">
                    <button onclick="game.modal.hide()" class="btn-circle btn-96 btn-no"></button>
                    <div class="modal-action-label">No, Take Me Back!</div>
                </div>
            `

            game.modal.display(
                'Stop Playing?',
                content,
                actions
            )
        },

        startButtonSounds: function(){
            /* Makes a click sound when any button is pressed.
              WE might need to call this again if buttons are
              dynamically inserted (e.g. for modals) */
            
            /* TODO do this properly */
              $('button')
              .on('touchstart mousedown', function(){
                  game.sfx.play('button_depress');
              })
              .on('touchend mouseup', function(){
                  game.sfx.play('button_release');
              });
        }
    },

    modal: {
        display: function(title, html, actions, addClass = false){
            /* Show modal with specified title + HTML content. */

            $('.modal-title').html(title);
            $('.modal-content').html(html);
            $('.modal-actions').html(actions)

            /* Create animation timeline. */
            let tl = gsap.timeline();
            /* set initial states */
            tl.to('.modal-container', { opacity: 0, duration: 0.001})
            tl.to('.modal', { y: 1024, duration: 0.001 })
            /* then animate! */
            game.sfx.play('whoosh');
            tl.to('.modal-container', { opacity: 1, duration: .45 })
            tl.to('.modal', { y: 0, duration: .45 }, '-=.45')
            
            setTimeout(function(){
                $('.modal-container').css({
                    'pointer-events': 'all'
                })
            }, 450)

            /* if addClass is defined, add those classes to the modal */
            $('.modal').removeClass().addClass('modal')
            if(addClass){
                $('.modal').addClass(addClass);
            }
        },

        hide: function(){
            /* hides the modal */
            gsap.to('.modal-container', { opacity: 0, duration: .45 });
            gsap.to('.modal', { y: 1024, duration: .45 })
            $('.modal-container').css({
                'pointer-events': 'none'
            });
        },

        slide: function(i){
            gsap.to(`.slide--active`, .2, {
                x: -80,
                opacity: 0,
                onComplete: function(){
                    $(`.slide--active`).removeClass('slide--active');
                    $(`.slide${i}`).addClass('slide--active');
                }
            });

            gsap.to(`.slide${i}`, .2, {
                x: 80,
                opacity: 0,
                onComplete: function(){
                    gsap.to(`.slide${i}`, .2, {
                        x: 0,
                        opacity: 1
                    })
                }
            });
        }
    },

    modals: {
        labTutorial: function(){
            function toSlide2(){
                alert('foo')
            }

            let content = `
                <div class="slide slide1 slide--active">
                    <div class="video-container">
                        <video autoplay loop muted>
                            <source src="video/lab-tutorial1.webm" type="video/webm">
                        </video>
                    </div>
                    <div>
                        <p>To see if an object is magnetic, move it over to Maggie the magnet!</p>
                        <div class="modal-action">
                            <button onclick="game.modal.slide(2)" class="btn-circle btn-yes"></button>
                            <div class="modal-action-label">Next</div>
                        </div>
                    </div>
                </div>

                <div class="slide slide2">
                    <div class="video-container">
                        <video autoplay loop muted>
                            <source src="video/lab-tutorial2.webm" type="video/webm">
                        </video>
                    </div>
                    <div>
                        <p>If you think the object isn't magnetic, put it in the "Not Magnetic" box.</p>
                        <div class="modal-action">
                            <button onclick="game.modal.slide(3)" class="btn-circle btn-yes"></button>
                            <div class="modal-action-label">Next</div>
                        </div>
                    </div>
                </div>


                <div class="slide slide3">
                    <div class="video-container">
                        <video autoplay loop muted>
                            <source src="video/lab-tutorial3.webm" type="video/webm">
                        </video>
                    </div>
                    <div>
                        <p>And if you think it <em>is</em> magnetic, put it in the "Magnetic" box!</p>
                        <div class="modal-action">
                            <button onclick="game.modal.slide(4)" class="btn-circle btn-yes"></button>
                            <div class="modal-action-label">Next</div>
                        </div>
                    </div>
                </div>
                

                <div class="slide slide4">
                    <div class="slide4_content">
                        <p>That's everything!</p>
                        <h2>Are you ready?</h2>
                        <div class="buttons">
                            <div class="modal-action">
                                <button onclick="game.sfx.play('xylo'); game.loadPage('lab', {transition: 'circle',twoStep: true});   game.modal.hide(); " class="btn-circle btn-96 btn-yes"></button>
                                <div class="modal-action-label">Yes, Go Home</div>
                            </div>
                            <div class="modal-action">
                                <button onclick="game.modal.hide()" class="btn-circle btn-96 btn-no"></button>
                                <div class="modal-action-label">No, Take Me Back!</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            let actions = `
            `

            game.modal.display(
                'How To Play',
                content,
                actions,
                'lab-howto'
            )
        }
    },

    speech: {
        _timeouts: [],
        hideBubble: function(){
            /* Hide the bubble. */
            /* Clean up any timeouts */
            for ( let t of game.speech._timeouts) {
                clearTimeout(t);
            }

            /* Animate away */
            gsap.to('.speech-bubble-container', .5, { opacity: 0, y: -128 })
        },
        display: function(messageObj, callback = () => {}){
            /* Display (and optionally, play) a Speech object.
               They look like this:

               {
                   message: "whatever you want to say",
                   sound: "[name of speech file in speech directory]",
                   sync: [300, 400, 200, 100, 400] /* time in ms to say each word
                   delay: 1000 // if no sound is specified, wait 1000ms to dismiss msg
                }

               sync is important if you want the message displayed on screen to line up
               with the audio that's being spoken!
               
               After the audio is finished (or after the selected time period), we can also
               optionally execute a callback*/
                
            let { message } = messageObj;

            /* Clean up any timeouts */
            for ( let t of game.speech._timeouts) {
                clearTimeout(t);
            }

            /* let's split message by word - we need to do this so we can individually
               target words if/when we need to highlight them. */
            let words = message.split(' ');

            /* Now, let's append each word as a separate span - with incrementing ID numbers */
            /* i hate this for syntax but i need the iterator variable so... */
            let html = '';
            for ( let [ i, word] of words.entries() ){
                html += `<span class="speech-word speech-word${i}">${word}&nbsp;</span>`
            } 

            /* Let's replace speechbubble's content. */
            $('.speech-bubble-container .dialogue').html(html);
            
            /** Set up dismiss routine **/
            const dismiss = () => {
                /* Hide the speech bubble */
                game.speech.hideBubble();

                /* Callback */
                console.log(callback);
                callback();
            }

            /* Play audio if we have any. */
            if(messageObj.sound){
                /* Callback is set to our dismiss function, so it dismisses
                   as soon as audio ends */
                game.sfx.play(messageObj.sound, dismiss, 'speech');
            } else {
                /* If we don't have audio, hide after delay if we have one of those */
                if(messageObj.delay){
                    setTimeout(dismiss, messageObj.delay);
                }
            }

            /** If we have sync property, let's set that up now **/
            if(messageObj.sync){
                /* Okay. So basically, each index in the sync array corresponds
                   to how long each word lasts.
                   Let's take the sentence "hello, my name is faiz"
                   if the word hello takes 500ms to say, element 0 of sync is 500
                   if the world my takes 100ms, element 1 is 100.
                   et cetera, et cetera.
                   so what we need to do is:
                        * ALWAYS higlight the first word straight away.
                        * for each subsequent word, wait however many ms the word
                          prior took. so for word 1, wait word 0's sync value to highlight.
                        * for word 2, we wait word 0 + 1's sync values combined.
                */

                /* "dim" all words */
                $('.speech-bubble-container .dialogue .speech-word').addClass('dimmed');
            
                for ( let [ i, value ] of messageObj.sync.entries() ){
                    let word = words[i];
                    if(i == 0){
                        /* undim immediately */
                        $('.speech-bubble-container .dialogue .speech-word0').removeClass('dimmed');
                    } else {

                        /* create set timeout of each value prior. */
                        /* to do this, get only the values in sync array that precede i.
                        so, if i == 2, get values 0 + 1
                        we can do this with slice! */
                        
                        let syncValues = messageObj.sync.slice(0, i);
                        
                        /* sum the array */
                        let ms = syncValues.reduce((a, b) => a + b, 0);

                        /* wait that many ms before showing this word.
                           add it to our timeouts array so we can clean up properly
                           when the bubble despawns */
                        let timeout = setTimeout(() => {
                            $('.speech-bubble-container .dialogue .speech-word'+i).removeClass('dimmed');
                        }, ms)
                        game.speech._timeouts.push(timeout);

                    }
                }
            }

            /** Okay, now let's animate the speech bubble onto the page! **/
            let tl = gsap.timeline();
            tl.to('.speech-bubble-container', .000001, { opacity: 0, y: -128});
            tl.to('.speech-bubble-container', .5, { opacity: 1, y: 0});
            
        }
    },

    sfx: {
        play: function(name, callback=()=>{}, directory = 'sfx'){
            /* Play given SFX. example: game.sfx.play('falling');
               Optionally, can provide a callback to run some code after
               SFX finished playing */

            /* This function will:
                * create an audio element on the fly,
                * play it,
                * destroy the element.
            
               This allows us to play multiple instances of the sound effect at the same time! */
        

            /* Generate a random ID for the sound effect instance */
            let id = Math.round(Math.random() * 1E10)

            console.log(`playing SFX: ${name}`)
            $('.sound-effects-container').append(`
                <audio id="sound-effect-${id}">
                    <source src="${directory}/${name}.mp3" type="audio/mpeg">
                </audio>
            `)
            $(`#sound-effect-${id}`).one('ended', function(){
                console.log(`finished SFX: ${name}`)
                $(`#sound-effect-${id}`).remove()
                if(callback) callback();
            })
            $(`#sound-effect-${id}`)[0].play();
            
        }
    }

}

$(document).ready(function(){
    /* add sound effects for all buttons */
    game.helpers.startButtonSounds();

    /* Init home button */
    $('.btn-home').off().on('click', function(){
        game.helpers.homePrompt();
    })

    /* load the start page */
    game.loadPage('start')
})