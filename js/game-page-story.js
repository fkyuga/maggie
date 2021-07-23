game.pages.story = {
    onload: function(){
        game.pages.story.scenes[0].animate();
    },

    scenes: [
        {
            /* Scene 0 */
            animate: () => {
                let tl = gsap.timeline();
                tl.to('.city', 7, { x: 37, ease:Linear.easeNone } );
                tl.to('.car', 3, { x: 2000 }, '-=5')
            }
        }
    ]
}