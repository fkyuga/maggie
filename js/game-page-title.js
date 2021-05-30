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
                    $('.btn-orb-start').addClass('visible');
                    $('.lightrays').addClass('with-btn');
                    $('.title-logo').addClass('with-btn');

                });
            });
        })
        console.log('loaded title page')
    }
}