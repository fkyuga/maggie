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
        display: function(title, html, actions){
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

            /* Refresh button click sound */
            game.helpers.startButtonSounds();
    
        },

        hide: function(){
            /* hides the modal */
            gsap.to('.modal-container', { opacity: 0, duration: .45 });
            gsap.to('.modal', { y: 1024, duration: .45 })
            $('.modal-container').css({
                'pointer-events': 'none'
            });
        }
    },

    sfx: {
        play: function(name, callback=()=>{}){
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
                    <source src="sfx/${name}.mp3" type="audio/mpeg">
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