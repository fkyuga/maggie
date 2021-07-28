/* I was pretty happy with how i laid out the rest of the code.
   This file, however, is a disaster.
   Please read at your own caution. */

game.pages.story = {
    onload: function(){
        game.pages.story.scenes[1].animate();
    },

    scenes: [
        {
            /* Scene 0 - Magnets are in everything! */
            animate: () => {
                game.bgm.play('what-is-love');
                $('.scene0').addClass('scene--active')
                let tl = gsap.timeline()

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

                setTimeout(()=>{
                    game.sfx.play('whoosh')
                }, 1500);

                setTimeout(()=>{
                    game.sfx.play('whoosh')
                }, 3000);

                setTimeout(()=>{
                    game.sfx.play('whoosh', () => {
                        // TODO DO THIS ON SPEECH INSTEAD!
                        game.pages.story.scenes[1].animate();
                    })
                }, 4500);

                

                /* Animate the compass needle in time with the compass appearing on the display. */
                tl.to('.scene0 .items .compass-needle', 1, {
                    rotate: 359
                }, '-=2')
            }
        },

        { 
            /* Introducing magnet poles & attraction */
            animate: () => {
                const onComplete = () => {
                    /* Part 2 of this scene - demonstrate magnetic attraction using drag and drop */
                    let tl2 = gsap.timeline();
                    const onComplete2 = () => {
                        /* this code is a -disaster- */
                        /* anyway, this code makes Haroon draggable so the player can drag him to Jessie.
                           we lock him to the x-axis, and constrain his movement to the path we display on screen. */
                        /* i would use inertia here, but it is a paid plugin :( */

                           /* After 1.5s of inactivity, assume the user needs guidance - show the drag prompt. */
                           setTimeout(function(){
                            $('.scene1 .drag-prompt').removeClass('hidden');
                           }, 1500)

                           let instance = Draggable.create('.scene1 .character-haroon', {
                               type: 'x',
                               bounds: '.scene1 .drag-progress',
                               onDrag: function(e){
                                   /* Calculate the percentage of the interaction that has been completed. */
                                   // To do this we need the -relative- position of the draggable element to the game stage.
                                   // *sigh* have i over engineered this?

                                   $('.scene1 .drag-prompt').addClass('hidden');

                                   let draggableRect = e.target.getBoundingClientRect();
                                   let stageRect = document.querySelector('.game-page-story').getBoundingClientRect();

                                   let x = draggableRect.left - stageRect.left;

                                   let xMax   = 700;
                                   let xMin   = 191;

                                   let perc = (x + xMin / xMax - xMin) / (xMax - xMin); /* i don't know how this works, but it does */
                                   /* invert percentage */
                                       perc = Math.abs( 1 - perc );
                                   this.perc = perc;

                                   let progress = perc * 550;

                                    console.log(progress);

                                   if(perc >= 0.65){
                                       /* Complete the interaction if the user is at 65% (magnets would attract at that point) */
                                       /* Destroy the Draggable */
                                       let completeTl = gsap.timeline();
                                       instance[0].kill();
                                       game.sfx.play('magnet');
                                       gsap.to('.scene1 .character-haroon', .15, { x: "-415px" })
                                       gsap.to('.scene1 .drag-progress', .15, { '--progress': "550px" })
                                       gsap.to('.scene1 .drag-progress', .25, { opacity: 0, y: -24 });
                                   
                                       gsap.to('.scene1 .text1', .25, { opacity: 0, y: -64})
                                       
                                       setTimeout(function(){
                                            gsap.to('.scene1', { y: -128, opacity: 0});
                                            /* Move to Scene 2 */
                                            game.pages.story.scenes[2].animate();
                                       }, 1250)
                                    }

                                   $('.scene1 .drag-progress')[0].style.setProperty('--progress', `${progress}px`)
                               },
                               onDragEnd: function(){
                                   /* If percentage is less than 65% (complete), return to initial pos */
                                   if(this.perc < 0.65){
                                        gsap.to('.scene1 .character-haroon', .25, {x:0})
                                        gsap.to('.scene1 .drag-progress', .25, { '--progress': 0 })
                                        $('.scene1 .drag-prompt').removeClass('hidden');
                                   }
                               }
                           })
                    }
                    setTimeout(function(){
                        /* oh god */

                        $('.scene1 .text1').removeClass('inactive').addClass('active');
                        $('.scene1 .text0').removeClass('active').addClass('inactive');
                    }, 250)
                    tl2.to('.scene1 .text0', .25, { y: -64, opacity: 0 });
                    tl2.to('.scene1 .text1', .0000001, { opacity: 0, y: 64 });
                    tl2.to('.scene1 .text1', .25, { y: 0, opacity: 1, onComplete2});
                }

                let tl = gsap.timeline();
                
                /* Set initial state */

                $('.scene0').addClass('scene--active')
                $('.scene1').addClass('scene--active')
                tl.to('.scene0 .items, .scene0 .text', .000001, { y: 0, opacity: 1})
                tl.to('.scene1', .000001, { y: 128, opacity: 0});
                tl.to('.scene1 .character-jessie', .000001, { y: 64, opacity: 0})
                tl.to('.scene1 .character-haroon', .000001, { y: 64, opacity: 0})

                /* Hide scene0 and slide in scene1 */
                tl.to('.scene0 .items, .scene0 .text', .5, { y: -128, opacity: 0 });
                tl.to('.scene1', .5, { y: 0, opacity: 1 });

                /* Slide in Jessie */
                tl.to('.scene1 .character-jessie', .5, { y:0, opacity: 1 }, '+=1.5')
                
                /* Make her wave */
                let jessieWave = gsap.timeline({yoyo: true})
                jessieWave.to('.scene1 .character-jessie-arm-r', .25, { rotate: 55, yoyo: true, repeat: 10 }, '+=1.5')
            
                /* Slide in Haroon */
                tl.to('.scene1 .character-haroon', .5, { y: 0, opacity: 1}, '+=1.5');

                /* Make him wave */
                let haroonWave = gsap.timeline({yoyo: true, onComplete})
                
                haroonWave.to('.scene1 .character-haroon-arm-l', .5, { rotate: -16, yoyo: true, repeat: 5 }, '+=3')
                haroonWave.to({}, 1, {});
            }
        },

        {
            /* Scene 2: Introducing repulsion */
            animate: () => { 
                let tl = gsap.timeline();
                //1tl.timeScale(10);
                /* Set initial state */

                $('.scene1').addClass('scene--active')
                $('.scene2').addClass('scene--active')
                tl.to('.scene1, .scene1 .character-jessie, .scene1 .character-haroon', .000001, { y: 0, opacity: 1})
                tl.to('.scene2', .000001, { y: 128, opacity: 0});

                /* Hide scene0 and slide in scene1 */
                tl.to('.scene1, .scene1 .character-jessie, .scene1 .character-haroon', .5, { y: -128, opacity: 0 });
                tl.to('.scene2, .scene2 .drag-progress', .5, { y: 0, opacity: 1, onComplete: () => {
                
                    /* this code makes lil draggable.
                        basically the same as scene1. a less time-constrained me would abstract this away into a new function... but -yeah- */

                        let instance_scene2 = Draggable.create('.scene2 .character-lil-full', {
                            type: 'x',
                            bounds: {minX: 0, maxX: -495},
                            onDrag: function(e){
                                /* Calculate the percentage of the interaction that has been completed. */
                                // To do this we need the -relative- position of the draggable element to the game stage.
                                // *sigh* have i over engineered this?

                                let draggableRect = e.target.getBoundingClientRect();
                                let stageRect = document.querySelector('.game-page-story').getBoundingClientRect();

                                let x = draggableRect.left - stageRect.left;

                                let xMax   = 700;
                                let xMin   = 191;

                                let perc = (x + xMin / xMax - xMin) / (xMax - xMin); /* i don't know how this works, but it does */
                                /* invert percentage */
                                    perc = Math.abs( 1 - perc );
                                this.perc = perc;

                                let progress = (perc * 550) / 0.65;

                                if(perc >= 0.65){
                                    /* Complete the interaction if the user is at 65% (magnets would attract at that point) */
                                    /* Destroy the Draggable */
                                    let completeTl = gsap.timeline();
                                    instance_scene2[0].kill();
                                    game.sfx.play('repel');
                                    gsap.to('.scene2 .character-lil-full', .15, { x: "1000px" })
                                    gsap.to('.scene2 .character-jessie', .15, { x: "-415px" })
                                    gsap.to('.scene2 .drag-progress', .15, { '--progress2': "550px" })
                                    gsap.to('.scene2 .drag-progress', .25, { opacity: 0, y: -24 });
                            
                                    setTimeout(function(){
                                        /* Show well done! */
                                        let tl = gsap.timeline();
                                        tl.to('.scene2 .text1', .0000001, { opacity: 0, y: 64});
                                        tl.to('.scene2 .text1', .0000001, { opacity: 0, y: 64});
                                        tl.to('.scene2 .text0', .25, { opacity: 0, y: -64});
                                        $('.scene2 .text1').removeClass('inactive').addClass('active');
                                        tl.to('.scene2 .text1', .25, { opacity: 1, y: 0}, '+=.5')

                                        /* Move to Scene 3 on button press*/
                                        $('.scene2 button').off().on('click', function () {
                                            game.pages.story.scenes[3].animate();
                                        })
                                    }, 1250)
                                }

                                $('.scene2 .drag-progress')[0].style.setProperty('--progress2', `${progress}px`)
                            },
                            onDragEnd: function(){
                                /* If percentage is less than 65% (complete), return to initial pos */
                                if(this.perc < 0.65){
                                    gsap.to('.scene1 .character-haroon', .25, {x:0})
                                    gsap.to('.drag-progress', .25, { '--progress': 0 })
                                }
                            }
                        })
                }
                
                });
            }
        },

        {
            /* Scene 3 - Story time! */
            animate: () => {
                $('.scene').removeClass('scene--active');
                $('.scene3').addClass('scene--active');
                
                game.bgm.play('morning');
                game.speech.display(SPEECH_MORNING);

                let tl = gsap.timeline({ onComplete: () => {
                    /* After completion, display Maggie's room */
                    let tl2 = gsap.timeline({ onComplete: () => {
                        /* After transitioning to Maggie's room, run scene 1's
                           animations. */
                        game.pages.story.scenes[4].animate();
                    } });

                    $('.scene4').addClass('scene--active');
                    tl2.to('.scene4', .000001, { opacity: 0, scale: 6 })
                    tl2.to('.scene3', 2, { scale: 0.5, opacity: .5 });
                    tl2.to('.scene4', 2, { scale: 1, opacity: 1}, '-=2')
                } });
                tl.to('.city', 7, { x: 37, ease:Linear.easeNone } );
                tl.to('.car', 3, { x: 2000 }, '-=5')
            }
        },

        {
            /* Scene 4 -- Maggie's room, Maggie asleep in bed. */
            animate: () => {
                game.speech.display(SPEECH_MAGGIE_INTRO);
                /* Wait for speech to complete. */
                setTimeout(function(){
                    /* Switch to scene 2. */
                    game.pages.story.scenes[5].animate();
                }, 5000);
            }
        },

        {
            /* Scene 5 -- Maggie in bed closeup. */
            animate: () => {
                game.speech.display(SPEECH_MAGGIE_SLEEPING);
                $('.scene').removeClass('scene--active');
                $('.scene5').addClass('scene--active');

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
                    game.speech.hideBubble();
                    game.sfx.play('alarm');
                    setTimeout(function(){
                        /* Wake maggie up (stop her sleeping anim) */
                        $('.scene5 .maggie-pajamas').addClass('awake');
                        $('.scene5 .sleepbubbles').hide();
                        $('.scene5 .maggie-pajamas .expression-sleeping').hide();
                        $('.scene5 .maggie-pajamas .expression-shocked').show();
                        game.bgm.stop(0);
                        game.sfx.play('magnet')
                        gsap.to('.scene5 .clock', .2, {
                            left: 562,
                            rotate: 359,
                            onComplete: function(){
                                setTimeout(function(){
                                    $('.scene5 .maggie-pajamas .expression-shocked').hide();
                                    $('.scene5 .maggie-pajamas .expression-screaming').show();
                                }, 1000)
                                setTimeout(function(){
                                    $('.scene5 .maggie-pajamas .expression-sleeping').hide();

                                    gsap.to('.scene5 .maggie-pajamas, .scene5 .clock', .1, {
                                        x: -800
                                    })
                                    game.sfx.play('whee');
                                    game.speech.display(SPEECH_MAGGIE_LATE);
                                    setTimeout(function(){
                                        game.speech.hideBubble();
                                        game.pages.story.scenes[6].animate();
                                    }, 3000);
                                }, 2000)
                            }
                        })
                    }, 1000)
                }, 2000)

                /* Alarm clock magnetically flies onto Maggie, shocking
                   her out of sleep and waking her up */
                
            }
        },

        {
            /* Scene 6: Foreboding image of school */
            animate: () => {
                let transitionTimeline = gsap.timeline();

                setTimeout(function(){
                    game.speech.display(SPEECH_SCHOOL);
                    game.sfx.play('organ');
                }, 500);
                
                transitionTimeline.to('.scene6', .000001, { opacity: 0 })
                $('.scene6').addClass('scene--active');

                transitionTimeline.to('.scene5', 1, { opacity: 0 });
                transitionTimeline.to('.scene6', 1, { opacity: 1 }, '-=1')


                let animationTimeline = gsap.timeline({onComplete: ()=>{
                    /* Once done, wait 2 seconds and move on to the flashback scene */
                    setTimeout(()=>{
                        game.pages.story.scenes[7].animate()
                    }, 2000)
                }});
                animationTimeline.to('.magnetfield-academy-front', 5, { y: -100 })
                animationTimeline.to('.maggie-back', 5, { y: 100 }, '-=5')
            }
        },

        {
            /* Scene 7: Flashback to snow day */
            animate: () => {
                game.speech.display(SPEECH_SNOW_DAY);
                game.sfx.play('flashback');
                let transitionTimeline = gsap.timeline();
                transitionTimeline.to('.scene7', .00000001, { opacity: 0 });
                $('.scene7').addClass('scene--active')
                transitionTimeline.to('.scene6', 0.1, { opacity: 0 });
                transitionTimeline.to('.scene7', 2, { opacity: 1 }, '+=.5')
                setTimeout(function(){
                    game.sfx.play('snow');
                    game.bgm.play('windy');
                }, 1000)

                let maggieWalkingTimeline = gsap.timeline({yoyo: true, repeat: 10});
                maggieWalkingTimeline.to('.character-maggie-leg-l', .35, { y: -10, ease: Linear.easeNone })
                maggieWalkingTimeline.to('.character-maggie-leg-r', .35, { y: -10, ease: Linear.easeNone }, '-=.175')


                let animationTimeline = gsap.timeline({ onComplete: () => {
                    game.speech.hideBubble();
                    maggieWalkingTimeline.pause();

                    /* Once Maggie has approached the school, get Tomas to throw the snowball. */
                    let snowballTimeline = gsap.timeline();
                    snowballTimeline.to({}, .5, {}) /* sleep 500ms to allow for dialogue */
                    snowballTimeline.to('.scene7 .snowball', .5, { opacity: 1 });
                    snowballTimeline.to('.scene7 .character-tomas-arm-l', .3, { rotate: 135})

                    snowballTimeline.to('.scene7 .snowball', .4, {
                        motionPath: {
                            type: 'cubic',
                            path:[{x:0, y:0}, {x:20, y:0}, {x:30, y:50}, {x:120, y:155}]
                          },
                        onComplete: ()=>{
                            game.sfx.play('repel')
                        }
                    })

                    snowballTimeline.to('.scene7 .snowball', .4, {
                        motionPath: {
                            type: 'cubic',
                            path:[{x:120, y:155}, {x: 50 , y: 130}, {x: 70, y: 120}, {x: 0, y: 110}]
                          },
                        onComplete: () => {
                            game.sfx.play('snowball_impact');
                            $('.scene7 .character-jessie-expression-focussed')
                                .removeClass('active')
                                .addClass('inactive');

                            $('.scene7 .character-jessie-expression-surprised')
                                .addClass('active')
                                .removeClass('inactive');

                            $('.scene7 .character-jessie-arms').removeClass('animating');
                        
                            $('.scene7 .character-maggie-face-mouth-smile')
                                .removeClass('active')
                                .addClass('inactive');

                            $('.scene7 .character-maggie-face-mouth-scream')
                                .addClass('active')
                                .removeClass('inactive');

                            setTimeout(function(){
                                let exitTimeline = gsap.timeline({onComplete: () => {
                                    setTimeout(function(){
                                        game.pages.story.scenes[8].animate();
                                    }, 1000);
                                }});
                                exitTimeline.to('.scene7 .character-maggie-body', .0000001, {
                                    scaleX: -1
                                })
                                exitTimeline.to('.scene7 .character-maggie', .0000001, {
                                    scaleX: -.4,
                                    x: 128
                                });

                                setTimeout(function(){
                                    game.sfx.play('whee');
                                }, 250)

                                exitTimeline.to('.scene7 .character-maggie', .3, {
                                    x: -800
                                }, '+=.25');
                            }, 1000);
                        }
                    })
                }});
                animationTimeline.to({}, .5, {}); /* sleep 500ms */
                animationTimeline.to('.scene7 .character-maggie', 3, { x: 200, ease: Linear.easeNone })


            }
        },

        {
            /* Scene 8: Encourage Maggie to go into school */
            animate: () => {
                game.sfx.play('flashback');
                game.bgm.play('sunny');
                gsap.to('.scene8 .character-maggie', .00001, { scaleY: .4, scaleX: -.4 });
                let transitionTimeline = gsap.timeline({onComplete: () => {
                game.speech.display(SPEECH_AFTER_FLASHBACK, () => {
                    
                    game.speech.display(SPEECH_AFTER_FLASHBACK_GUIDANCE)

                    /** ENABLE DRAGGABILITY (it's our fave code block again) **/
                    let instance = Draggable.create('.scene8 .character-maggie', {
                        type: 'x',
                        bounds: '.scene8 .drag-progress',
                        onDrag: function(e){
                            /* Calculate the percentage of the interaction that has been completed. */
                            // To do this we need the -relative- position of the draggable element to the game stage.
                            // *sigh* have i over engineered this?


                            let draggableRect = e.target.getBoundingClientRect();
                            let stageRect = document.querySelector('.game-page-story').getBoundingClientRect();

                            let x = draggableRect.left - stageRect.left;

                            let xMax   = 220;
                            let xMin   = 600;

                            let perc = (x + xMin / xMax - xMin) / (xMax - xMin); /* i don't know how this works, but it does */
                            /* invert percentage */
                                perc = Math.abs( 1 - perc );
                            this.perc = perc;

                            let progress = perc * 471;

                             console.log(progress);

                            if(perc >= 0.8){
                                /* Destroy the Draggable */
                                instance[0].kill();

                                /* hide speech bubble */
                                game.speech.hideBubble();

                                /* Play door sound */
                                game.sfx.play('door');
                                
                                /* Fade out BGM */
                                game.bgm.stop();

                                /* And fade to black */

                                $('.scene-interstitial p').html("<p>Maggie, with all her strength, worked as hard as she could at school today...</p>");

                                let transitionTimeline = gsap.timeline({onComplete: () => {
                                    /* after we show the interstitial message, play the school bell and move on to next scene! */
                                    game.sfx.play('schoolsout', () => {
                                        game.pages.story.scenes[9].animate();
                                    });
                                }});
                                    transitionTimeline.to('.scene-interstitial p', .000001, { opacity: 0 });
                                    transitionTimeline.to('.scene8', 1, { opacity: 0 });
                                    transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 }, '-=1');
                                    transitionTimeline.to({}, 1, {}); /* wait 1s */
                                    transitionTimeline.to('.scene-interstitial p', .5, { opacity: 1 });
                                    transitionTimeline.to({}, 3, {}); /* wait 3s */
                                    transitionTimeline.to('.scene-interstitial p', .5, { opacity: 0 });
                            }

                            $('.scene8 .drag-progress')[0].style.setProperty('--progressScene8', `${progress}px`)
                        },
                        onDragStart: function(){
                            /* change maggie's expression and rotation */
                            $('.scene8 .character-maggie-expression-frown').removeClass('active');
                            $('.scene8 .character-maggie-expression-surprised').addClass('active');
                            
                            gsap.to('.scene8 .character-maggie', .1, { rotate: 20, scaleY: .4, scaleX: -.4 });
                        },
                        onDragEnd: function(){
                            $('.scene8 .character-maggie-expression-frown').addClass('active');
                            $('.scene8 .character-maggie-expression-surprised').removeClass('active');
                            gsap.to('.scene8 .character-maggie', .1, { rotate: 0 });

                            /* If percentage is less than 80% (complete), return to initial pos */
                            if(this.perc < 0.8){
                                 gsap.to('.scene8 .character-maggie', .25, {x:0})
                                 gsap.to('.scene8 .drag-progress', .25, { '--progressScene8': 0 })
                            }
                        }
                    })


                })
                }});
                transitionTimeline.to('.scene8', .00000001, { opacity: 0 });
                $('.scene8').addClass('scene--active')
                transitionTimeline.to('.scene7', 0.1, { opacity: 0 });
                transitionTimeline.to('.scene8', 2, { opacity: 1 }, '+=.5')
            }
        },

        {
            /* Scene 9: Maggie sees somebody she's never met before outside school! */
            animate: () => {
                let transitionTimeline = () => {

                }
            }
        }
    ]
}