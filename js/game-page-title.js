game.pages.start = {
    onload: function(){
        $('.btn-help').hide();
        const startGame = () => {
            game.loadPage(game.params.get('screen') || 'title');
        }

        // If audioskip is specified, start the game immediately
        // if it isn't, ask the user to click the screen before we start
        // i had to do this to get the home button working. kludgy but works

        if(game.params.get('audioskip')){
            setTimeout(startGame, 1);
        }

        $('.game-page-start-content').off().on('click', function(){
            startGame();    
        })
    }
}

game.pages.title = {
    onload: function(){
        
        if(game.params.get('titleskip')){
            /* Adding ?titleskip=1 to the URL skips the title screen. We use this when the user presses the home button
               - we stealthily reload the page so they don't notice.
                I do this instead of changing pages because reverting the state of all the elements would be far 
                too laborious. */
    
            $('.game-page-title .title-logo').addClass('with-btn no-animate');
            $('.game-page-title .menu-options .menu-option').addClass('animating')
            $('.game-page-title .menu-option').off().on('click', game.pages.title.onClickActivity)
            $('.game-page-title .character-maggie').addClass('peeking');
            return;
        }

        game.sfx.play('falling', ()=>{
            game.sfx.play('drop', () => {
                $('.game-page-title .character-maggie').addClass('peeking');
                game.sfx.play('peek', () => {
                    /*  btn-orb-start's transition-duration is usually 150ms, but we need it to be 1000ms to move in synchrony with title-logo
                        so we change transition here, and then change it back after animation is complete.
                        this is inelegant, i will use gsap in final build to avoid this kind of jank */
                    
                    $('.game-page-title .btn-orb-start').css({
                        transition: '1s ease-in-out'
                    }).one('transitionend', (e)=>{
                        $(e.target).css({
                            transition: '0.15s ease-in-out'
                        })
                    })

                    $('.game-page-title .btn-orb-start').addClass('visible');
                    $('.game-page-title .title-logo').addClass('with-btn');

                });
            });
        })
        console.log('loaded title page')

        /* Register handlers */
        $('.game-page-title .btn-orb-start').on('touchend mouseup', game.pages.title.onClickStartButton);
    },

    onClickStartButton: function(){
        /* CLICK START BUTTON
           Fade the start button to 0 opacity, hide it, and animate in menu options one-by-one. */
        
        $('.game-page-title .menu-option').off().on('click', game.pages.title.onClickActivity)
        $('.game-page-title .btn-orb-start')
            .one('animationend', (e)=>{
                console.log(e);
                $(e.currentTarget).removeClass('a-fadeout-300ms').hide();

                /* callbacks are messy :( */
                game.sfx.play('whoosh');
                $('.game-page-title .menu-options .menu-option:nth-of-type(1)')
                    .addClass('animating')
                    .one('transitionend', e => {
                        game.sfx.play('whoosh');
                        $('.game-page-title .menu-options .menu-option:nth-of-type(2)')
                            .addClass('animating')
                            .one('transitionend', e => {
                                game.sfx.play('whoosh');
                                $('.game-page-title .menu-options .menu-option:nth-of-type(3)')
                                .addClass('animating')
                            });
                    });
            })
            .addClass('a-fade-out-300ms');
    },

    onClickActivity: function(e){
        /* CLICK ACTIVITY
           Takes the user to the activity page they clicked on.
           The menu option elements have a custom attribute "data-activity" that tells this function
           what page to go to. */

           
        console.log('onClickActivity FIRED');

        let pageName = e.currentTarget.getAttribute('data-activity');
        
        switch(pageName){
            case "lab":
                game.modals.labTutorial()
                break;
            default:
                game.sfx.play('xylo');
                game.loadPage(pageName, {
                    transition: 'circle',
                    twoStep: true
                });
        }
    }

}