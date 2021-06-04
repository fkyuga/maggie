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
    $('.btn-orb')
        .on('touchstart mousedown', function(){
            game.sfx.play('button_depress');
        })
        .on('touchend mouseup', function(){
            game.sfx.play('button_release');
        });

    /* load the start page */
    game.loadPage('start')
})