game.pages.start = {
    onload: function(){
        $('.game-page-start-content').off().on('click', function(){
            game.loadPage('title');
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
    }
}