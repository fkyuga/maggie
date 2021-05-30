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
                //$('.character-maggie').addClass('peeking');
            });
        })
        console.log('loaded title page')
    }
}