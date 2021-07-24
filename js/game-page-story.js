game.pages.story = {
    onload: function(){
        game.pages.story.scenes[0].animate();
    },

    scenes: [
        {
            /* Scene 0 - Magnets are in everything! */
            animate: () => {
                let tl = gsap.timeline({ onComplete: () => {
                    /* After completion, move to the next scene. */
                    game.pages.story.scenes[1].animate();
                } })

                /* Set initial state of elements */
                tl.to('.scene0 .text', .0000001, { opacity: 0 })
                tl.to('.scene0 .items *', .0000001, { opacity: 0, y: 64});
                tl.to('.scene0 .items .compass-needle', .0000001, { opacity: 1, y: 0});
            
                /* Fade in the text */
                tl.to('.scene0 .text', .5, { opacity: 1 });

                /* Start displaying the items in time with the narration. */
                tl.to('.scene0 .items .card', .5, { opacity: 1, y: 0 }, '+=1');
                tl.to('.scene0 .items .compass', .5, { opacity: 1, y: 0 }, '+=1');
                tl.to('.scene0 .items .phone', .5, { opacity: 1, y: 0 }, '+=1');

                /* Animate the compass needle in time with the compass appearing on the display. */
                tl.to('.scene0 .items .compass-needle', 1, {
                    rotate: 359
                }, '-=2')
            }
        },
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

                    $('.scene1').addClass('scene--active');
                    tl2.to('.scene1', .000001, { opacity: 0, scale: 6 })
                    tl2.to('.scene0', 2, { scale: 0.5, opacity: .5 });
                    tl2.to('.scene1', 2, { scale: 1, opacity: 1}, '-=2')
                } });
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
                    game.pages.story.scenes[2].animate();
                }, 5000);
            }
        },

        {
            /* Scene 2 -- Maggie in bed closeup. */
            animate: () => {
                $('.scene').removeClass('scene--active');
                $('.scene2').addClass('scene--active');

                /* Sleep bubbles */
                let sleepBubblesTl = gsap.timeline({ repeat: 3 });
                    sleepBubblesTl.to('.sleepbubbles *', .00001, { opacity: 0 })
                    sleepBubblesTl.to('.sleepbubble0', .00001, { opacity: 1 })
                    sleepBubblesTl.to('.sleepbubble0', .5, { opacity: 1 })

                    sleepBubblesTl.to('.sleepbubbles *', .00001, { opacity: 0 })
                    sleepBubblesTl.to('.sleepbubble1', .00001, { opacity: 1 })
                    sleepBubblesTl.to('.sleepbubble1', .5, { opacity: 1 })

                    sleepBubblesTl.to('.sleepbubbles *', .00001, { opacity: 0 })
                    sleepBubblesTl.to('.sleepbubble2', .00001, { opacity: 1 })
                    sleepBubblesTl.to('.sleepbubble2', .5, { opacity: 1 })

                    sleepBubblesTl.to('.sleepbubbles *', .00001, { opacity: 0 })
                    sleepBubblesTl.to('.sleepbubble3', .00001, { opacity: 1 })
                    sleepBubblesTl.to('.sleepbubble3', .5, { opacity: 1 })

                /* Play alarm clock sound after 2s */
                setTimeout(function(){
                    game.sfx.play('alarm');
                    setTimeout(function(){
                        /* Wake maggie up (stop her sleeping anim) */
                        $('.scene2 .maggie-pajamas').addClass('awake');
                        $('.scene2 .sleepbubbles').hide();
                        $('.scene2 .maggie-pajamas .expression-sleeping').hide();
                        $('.scene2 .maggie-pajamas .expression-shocked').show();

                        game.sfx.play('magnet')
                        gsap.to('.scene2 .clock', .2, {
                            left: 562,
                            rotate: 359,
                            onComplete: function(){
                                setTimeout(function(){
                                    $('.scene2 .maggie-pajamas .expression-shocked').hide();
                                    $('.scene2 .maggie-pajamas .expression-screaming').show();
                                }, 1000)
                                setTimeout(function(){
                                    $('.scene2 .maggie-pajamas .expression-sleeping').hide();

                                    gsap.to('.scene2 .maggie-pajamas, .scene2 .clock', .1, {
                                        x: -800
                                    })
                                    game.sfx.play('whee');
                                }, 2000)
                            }
                        })
                    }, 1000)
                }, 2000)

                /* Alarm clock magnetically flies onto Maggie, shocking
                   her out of sleep and waking her up */
                
            }
        }
    ]
}