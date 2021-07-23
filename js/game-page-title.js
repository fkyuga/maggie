game.pages.start = {
    onload: function(){
        $('.game-page-start-content').off().on('click', function(){
            game.loadPage('story');
        })
    }
}

game.pages.title = {
    onload: function(){
        game.sfx.play('falling', ()=>{
            game.sfx.play('drop', () => {
                $('.character-maggie').addClass('peeking');
                game.sfx.play('peek', () => {
                    /*  btn-orb-start's transition-duration is usually 150ms, but we need it to be 1000ms to move in synchrony with title-logo
                        so we change transition here, and then change it back after animation is complete.
                        this is inelegant, i will use gsap in final build to avoid this kind of jank */
                    
                    $('.btn-orb-start').css({
                        transition: '1s ease-in-out'
                    }).one('transitionend', (e)=>{
                        $(e.target).css({
                            transition: '0.15s ease-in-out'
                        })
                    })

                    $('.btn-orb-start').addClass('visible');
                    $('.title-logo').addClass('with-btn');

                });
            });
        })
        console.log('loaded title page')

        /* Register handlers */
        $('.btn-orb-start').on('touchend mouseup', game.pages.title.onClickStartButton);
        $('.menu-option').on('touchend mouseup', game.pages.title.onClickActivity)
    },

    onClickStartButton: function(){
        /* CLICK START BUTTON
           Fade the start button to 0 opacity, hide it, and animate in menu options one-by-one. */
        
        $('.btn-orb-start')
            .one('animationend', (e)=>{
                console.log(e);
                $(e.currentTarget).removeClass('a-fadeout-300ms').hide();

                /* callbacks are messy :( */
                game.sfx.play('whoosh');
                $('.menu-options .menu-option:nth-of-type(1)')
                    .addClass('animating')
                    .one('transitionend', e => {
                        game.sfx.play('whoosh');
                        $('.menu-options .menu-option:nth-of-type(2)')
                            .addClass('animating')
                            .one('transitionend', e => {
                                game.sfx.play('whoosh');
                                $('.menu-options .menu-option:nth-of-type(3)')
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