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
        if(opts.transition){
            if(this.currentPage){
                $(fromPage).addClass(opts.transition + ' out')
            }
            $(toPage).addClass(opts.transition + ' in')

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
        
            console.log(`playing SFX: ${name}`)
            $(`#sound-effect-${name}`).one('ended', function(){
                console.log(`finished SFX: ${name}`)
                if(callback) callback();
            })
            $(`#sound-effect-${name}`)[0].play();
            
        }
    }

}

$(document).ready(function(){
    /* load SFX */
    let sfxs = ['drop', 'falling']
    sfxs.forEach(sfx => {
        let audioElement = $(`
            <audio id="sound-effect-${sfx}">
                <source src="sfx/${sfx}.mp3" type="audio/mpeg">
            </audio>
        `)
        $('.sound-effects-container').append(audioElement);
    })

    game.loadPage('start')
})