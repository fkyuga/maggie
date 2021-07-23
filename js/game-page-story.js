game.pages.story = {
    onload: function(){
        game.pages.story.scenes[0].animate();
    },

    scenes: [
        {
            /* Scene 0 */
            animate: () => {
                let tl = gsap.timeline({ onComplete: () => {
                    /* After completion, display Maggie's room */
                    let tl2 = gsap.timeline({ onComplete: () => {
                        /* After transitioning to Maggie's room, run scene 1's
                           animations. */
                        game.pages.story.scenes[1].animate();
                    } });
                    tl2.timeScale(10);

                    $('.scene1').addClass('scene--active');
                    tl2.to('.scene1', .000001, { opacity: 0, scale: 6 })
                    tl2.to('.scene0', 2, { scale: 0.5, opacity: .5 });
                    tl2.to('.scene1', 2, { scale: 1, opacity: 1}, '-=2')
                } });
                tl.timeScale(10);
                tl.to('.city', 7, { x: 37, ease:Linear.easeNone } );
                tl.to('.car', 3, { x: 2000 }, '-=5')
            }
        },

        {
            /* Scene 1 -- Maggie's room, Maggie asleep in bed. */
            animate: () => {
                /* Wait for speech to complete. */
                setTimeout(function(){
                    /* Switch to scene 2. */

                    $('.scene').removeClass('scene--active');
                    $('.scene2').addClass('scene--active');

                }, 5000);
            }
        }
    ]
}