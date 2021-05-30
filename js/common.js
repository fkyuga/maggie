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
        if(this.pages.onload) this.pages.onload();

        /* Remember what page we're on so we can clean it up before we exit
        it */
        this.currentPage = pageName;
    },

    pages: {}

}

$(document).ready(function(){
    game.loadPage('title')
})