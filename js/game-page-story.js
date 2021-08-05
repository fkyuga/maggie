/* I was pretty happy with how i laid out the rest of the code.
   This file, however, is a disaster.
   Please read at your own discretion. */

game.pages.story = {
    onload: function(){
        // Help is unavailable in story mode. 
        $('.btn-help').hide();
        game.pages.story.scenes[0].animate();
    },

    scenes: [
        {
            /* Scene 0 - Magnets are in everything! */
            animate: () => {
                game.bgm.play('what-is-love', 1000, .1);
                setTimeout(function(){
                    game.sfx.play('SPEECH_MAGNETS_INTRO', () => {
                        /* After narration is complete, move to next page
                        i know, i know. callback hell. i shoulda used async/await.
                        */
                        setTimeout(function(){
                            game.pages.story.scenes[1].animate();
                        }, 2000)
                    }, 'speech');
                /* Start displaying the items in time with the narration. */
                    tl.to('.scene0 .items .card', .5, { opacity: 1, y: 0 }, '+=3');
                    tl.to('.scene0 .items .compass', .5, { opacity: 1, y: 0 }, '+=.5');
                    tl.to('.scene0 .items .phone', .5, { opacity: 1, y: 0 }, '+=1');

                    /* Animate the compass needle in time with the compass appearing on the display. */
                    tl.to('.scene0 .items .compass-needle', 1, {
                        rotate: 359
                    }, '-=2')
                }, 1500)

                $('.scene0').addClass('scene--active')
                let tl = gsap.timeline()

                /* Set initial state of elements */
                tl.to('.scene0 .text', .0000001, { opacity: 0 })
                tl.to('.scene0 .items *', .0000001, { opacity: 0, y: 64});
                tl.to('.scene0 .items .compass-needle', .0000001, { opacity: 1, y: 0});
            
                /* Fade in the text */
                tl.to('.scene0 .text', .5, { opacity: 1 });

                /* Time whoosh SFX to when the elements appear */
                setTimeout(()=>{
                    game.sfx.play('whoosh')
                }, 4500);

                setTimeout(()=>{
                    game.sfx.play('whoosh')
                }, 5500);
                
                setTimeout(()=>{
                    game.sfx.play('whoosh')
                }, 7000);

            }
        },

        { 
            /* Introducing magnet poles & attraction */
            animate: () => {
                const onComplete = () => {
                    /* Part 2 of this scene - demonstrate magnetic attraction using drag and drop */
                    game.sfx.play('SPEECH_MAGNETS_INTRO_ATTRACT', () => {
                        game.sfx.play('SPEECH_MAGNETS_INTRO_TRY_IT', () => {}, 'speech');
                        /* Enable draggable here. */


                        onComplete2();

                    }, 'speech');
                    let tl2 = gsap.timeline();
                    const onComplete2 = () => {
                        /* this code is a -disaster- */
                        /* anyway, this code makes Haroon draggable so the player can drag him to Jessie.
                           we lock him to the x-axis, and constrain his movement to the path we display on screen. */
                        /* i would use inertia here, but it is a paid plugin :( */

                        $('.scene1 .drag-prompt').removeClass('hidden');

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
                    tl2.to('.scene1 .text1', .25, { y: 0, opacity: 1});
                }

                let tl = gsap.timeline();
                /* Play speech. */
                setTimeout(function(){
                    game.sfx.play('SPEECH_MAGNETS_POLES', () => {}, 'speech');
                }, 1000);
                setTimeout(function(){
                    game.sfx.play('SPEECH_MAGNETS_INTRO_NORTH', () => {
                        game.sfx.play('CHARACTER_JESSIE_HELLO')
                    }, 'speech');
                }, 3000);
                setTimeout(function(){
                    game.sfx.play('SPEECH_MAGNETS_INTRO_SOUTH', () => {
                        game.sfx.play('CHARACTER_HAROON_HELLO')
                    }, 'speech');
                }, 4500);
                

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

                setTimeout(function(){
                    game.sfx.play('SPEECH_MAGNETS_INTRO_REPEL', () => {
                        $('.scene2 .drag-prompt').removeClass('hidden');

                        /* this code makes lil draggable.
                            basically the same as scene1. a less time-constrained me would abstract this away into a new function... but -yeah- */
                            gsap.to('.scene2 .para1', .5, { opacity: 1, y: 0 })
                            game.sfx.play('SPEECH_MAGNETS_INTRO_GO_AHEAD', () => {}, 'speech');
    
                            let instance_scene2 = Draggable.create('.scene2 .character-lil-full', {
                                type: 'x',
                                bounds: {minX: 0, maxX: -495},
                                onDrag: function(e){
                                    /* Calculate the percentage of the interaction that has been completed. */
                                    // To do this we need the -relative- position of the draggable element to the game stage.
                                    // *sigh* have i over engineered this?
                                    $('.scene2 .drag-prompt').addClass('hidden');

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
                                        $('.scene2 .drag-prompt').addClass('hidden');

                                        let completeTl = gsap.timeline();
                                        instance_scene2[0].kill();
                                        game.sfx.play('whee');
                                        gsap.to('.scene2 .character-lil-full', .15, { x: "1000px" })
                                        gsap.to('.scene2 .character-jessie', .15, { x: "-415px" })
                                        gsap.to('.scene2 .drag-progress', .15, { '--progress2': "550px" })
                                        gsap.to('.scene2 .drag-progress', .25, { opacity: 0, y: -24 });
                                
                                        setTimeout(function(){
                                            /* Show well done! */
                                            let tl = gsap.timeline();
                                            tl.to('.scene2 .text1', .0000001, { opacity: 0, y: 64});
                                            tl.to('.scene2 .text1', .0000001, { opacity: 0, y: 64});
                                            tl.to('.scene2 #beginStory', .0000001, { opacity: 0, y: 64});
                                            tl.to('.scene2 .text0', .25, { opacity: 0, y: -64});
                                            $('.scene2 .text1').removeClass('inactive').addClass('active');
                                            tl.to('.scene2 .text1', .25, { opacity: 1, y: 0}, '+=.5')

                                            setTimeout(function(){
                                                game.sfx.play('SPEECH_MAGNETS_INTRO_STORY_TIME', () => {
                                                    gsap.to('.scene2 #beginStory', .5, { opacity: 1, y: 0 });
                                                }, 'speech');
                                            }, 1500);
    
                                            /* Move to Scene 3 on button press*/
                                            $('.scene2 #beginStory').off().one('click', function () {
                                                let transitionTimeline = gsap.timeline({onComplete: () => {
                                                    game.pages.story.scenes[3].animate();
                                                }});
                                                /* fade to black */
                                                $('.scene-interstitial p').html('');

                                                transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 });
                                                transitionTimeline.to('.scene2', 1, { opacity: 0 }, '-=1')
                                                transitionTimeline.to({}, 3, {}); /* wait 3s */
                                                game.bgm.stop();
                                            })
                                        }, 1250)
                                    }
    
                                    $('.scene2 .drag-progress')[0].style.setProperty('--progress2', `${progress}px`)
                                },
                                onDragEnd: function(){
                                    /* If percentage is less than 65% (complete), return to initial pos */
                                    

                                    if(this.perc < 0.65){
                                        $('.scene2 .drag-prompt').removeClass('hidden');
                                        gsap.to('.scene2 .character-lil-full', .25, {x:0})
                                        gsap.to('.scene2 .drag-progress', .25, { '--progress2': 0 })
                                    }
                                }
                            })
                    }, 'speech');
                }, 1000);

                $('.scene1').addClass('scene--active')
                $('.scene2').addClass('scene--active')
                
                tl.to('.scene2 .para1', .000001, { opacity: 0, y: 64});
                tl.to('.scene1, .scene1 .character-jessie, .scene1 .character-haroon', .000001, { y: 0, opacity: 1})
                tl.to('.scene2', .000001, { y: 128, opacity: 0});

                /* Hide scene0 and slide in scene1 */
                tl.to('.scene1, .scene1 .character-jessie, .scene1 .character-haroon', .5, { y: -128, opacity: 0 });
                tl.to('.scene2, .scene2 .drag-progress', .5, { y: 0, opacity: 1});
            }
        },

        {
            /* Scene 3 - Story time! */
            animate: () => {
                $('.scene0, .scene1, .scene2').removeClass('scene--active');
                gsap.to('.scene3', .000001, { opacity: 0 });
                gsap.to('.scene-interstitial', 1, { opacity: 0})
                gsap.to('.scene3', 1, { opacity: 1});
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
                game.sfx.play('CHARACTER_MAGGIE_SNORING', () => {}, 'sfx', .5);
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
                game.sfx.play('CHARACTER_MAGGIE_SNORING', () => {}, 'sfx', 1);
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
                        
                        $('[data-sfx-name="CHARACTER_MAGGIE_SNORING"]').prop('volume', 0);

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
                                    game.sfx.play('CHARACTER_MAGGIE_SCREAM');
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
                    game.speech.display(SPEECH_SCHOOL, () => {
                        game.speech.display(SPEECH_SNOW_DAY, () => {
                            game.pages.story.scenes[7].animate()
                        });
                    });
                }, 500);
                
                transitionTimeline.to('.scene6', .000001, { opacity: 0 })
                $('.scene6').addClass('scene--active');

                transitionTimeline.to('.scene5', 1, { opacity: 0 });
                transitionTimeline.to('.scene6', 1, { opacity: 1 }, '-=1')


                let animationTimeline = gsap.timeline();
                animationTimeline.to('.magnetfield-academy-front', 5, { y: -100 })
                animationTimeline.to('.maggie-back', 5, { y: 100 }, '-=5')
            }
        },

        {
            /* Scene 7: Flashback to snow day */
            animate: () => {
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
                    
                    game.speech.display(SPEECH_AFTER_FLASHBACK_GUIDANCE, () => {
                    $('.scene8 .drag-prompt').removeClass('hidden')
                    /** ENABLE DRAGGABILITY (it's our fave code block again) **/
                    let instance = Draggable.create('.scene8 .character-maggie', {
                        type: 'x',
                        bounds: '.scene8 .drag-progress',
                        onDrag: function(e){
                            /* Calculate the percentage of the interaction that has been completed. */
                            // To do this we need the -relative- position of the draggable element to the game stage.
                            // *sigh* have i over engineered this?
                            $('.scene8 .drag-prompt').addClass('hidden')

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

                                setTimeout(function(){
                                    game.speech.display(SPEECH_MAGGIE_STRENGTH_INTERSTITIAL, () => {
                                        gsap.to('.scene-interstitial p', .5, { opacity: 0 });
                                        setTimeout(function(){
                                            game.sfx.play('schoolsout', () => {
                                                game.pages.story.scenes[9].animate();
                                            });
                                        }, 1500);
                                    });
                                }, 2000)

                                let transitionTimeline = gsap.timeline();
                                    transitionTimeline.to('.scene-interstitial p', .000001, { opacity: 0 });
                                    transitionTimeline.to('.scene8', 1, { opacity: 0 });
                                    transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 }, '-=1');
                                    transitionTimeline.to({}, 1, {}); /* wait 1s */
                                    transitionTimeline.to('.scene-interstitial p', .5, { opacity: 1 });
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
                                $('.scene8 .drag-prompt').removeClass('hidden')
                                gsap.to('.scene8 .character-maggie', .25, {x:0})
                                gsap.to('.scene8 .drag-progress', .25, { '--progressScene8': 0 })
                            }
                        }
                    })
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
                $('.scene8').removeClass('scene--active');
                $('.scene9').addClass('scene--active');
                game.bgm.play('sunny');

                setTimeout(function(){
                    game.speech.display(SPEECH_AFTER_SCHOOL, () => {
                        game.speech.display(SPEECH_AFTER_SCHOOL_GUIDANCE, () => {
                            /* draggability time... -yay- */
                            gsap.to('.scene9 .drag-progress', .5, { opacity: 1 });
                            $('.scene9 .drag-prompt').removeClass('hidden');

                            let instance = Draggable.create('.scene9 .character-maggie', {
                                type: 'x',

                                //bounds: '.scene9 .drag-progress',

                                onDrag: function(e){
                                    /* Calculate the percentage of the interaction that has been completed. */
                                    // To do this we need the -relative- position of the draggable element to the game stage.
                                    // *sigh* have i over engineered this?
                                    $('.scene9 .drag-prompt').addClass('hidden')
        
                                    let draggableRect = e.target.getBoundingClientRect();
                                    let stageRect = document.querySelector('.game-page-story').getBoundingClientRect();
        
                                    let x = draggableRect.left - stageRect.left;
        
                                    let xMax   = 550;
                                    let xMin   = 170;
        
                                    let perc = (x + xMin / xMax - xMin) / (xMax - xMin); /* i don't know how this works, but it does */
                                    /* invert percentage */
                                        perc = Math.abs( 1 - perc );
                                    this.perc = perc;
        
                                    let progress = perc * 471;
        
                                    console.log(progress);
        
                                    if(perc >= 0.65){
                                        /* Destroy the Draggable */
                                        instance[0].kill();
        
                                        /* hide speech bubble */
                                        game.speech.hideBubble();
                                        
                                        /* Repel Rosie and Maggie */
                                        gsap.to('.scene9 .character-rosie', .15, { x: '-415px' });
                                        gsap.to('.scene9 .character-maggie', .15, { x: 0 });
                                        game.sfx.play('whee');

                                        setTimeout(function(){
                                            game.speech.display(SPEECH_OH_NO, () => {
                                                $('.scene9 .character-maggie-expression-pre-crying').removeClass('active');
                                                $('.scene9 .character-maggie-expression-crying').addClass('active');
                                                game.sfx.play('CHARACTER_MAGGIE_CRYING')
                                                setTimeout(function(){
                                                    gsap.to('.scene9 .character-maggie', 1, { x: -750 })
                                                    let maggieWalkingTimeline = gsap.timeline({yoyo: true, repeat: 10});
                                                    maggieWalkingTimeline.timeScale(3);
                                                    maggieWalkingTimeline.to('.scene9 .character-maggie-leg-l', .35, { y: -10, ease: Linear.easeNone })
                                                    maggieWalkingTimeline.to('.scene9 .character-maggie-leg-r', .35, { y: -10, ease: Linear.easeNone }, '-=.175')
                                                    $('[data-sfx-name="CHARACTER_MAGGIE_CRYING"]').animate({ volume: 0 }, 3000)
                                                    setTimeout(function(){
                                                        
                                                        game.pages.story.scenes[10].animate();
                                                        
                                                    }, 2000)
                                                }, 2000);                            
                                            })
                                            $('.scene9 .character-maggie .character-expression').removeClass('active');
                                            $('.scene9 .character-maggie-expression-pre-crying').addClass('active');
                                        }, 250);

                                        /* Hide the drag stuff */
                                        $('.scene9 .drag-prompt').addClass('hidden')
                                        gsap.to('.scene9 .drag-progress', .5, { opacity: 0 });   
                                    }
        
                                    $('.scene9 .drag-progress')[0].style.setProperty('--progressScene9', `${progress}px`)
                                },
                                onDragStart: function(){
                                    /* change maggie's expression and rotation */
                                    $('.scene9 .character-maggie-expression-frown').removeClass('active');
                                    $('.scene9 .character-maggie-expression-surprised').addClass('active');
                                    gsap.to('.scene9 .character-maggie', .1, { rotate: -20 });

                                    /* change rosie's expression */
                                    $('.scene9 .character-rosie-expression-neutral').removeClass('active');
                                    $('.scene9 .character-rosie-expression-surprised').addClass('active');
                                    
                                },
                                onDragEnd: function(){

                                    $('.scene9 .character-maggie-expression-frown').addClass('active');
                                    $('.scene9 .character-maggie-expression-surprised').removeClass('active');
                                    gsap.to('.scene9 .character-maggie', .1, { rotate: 0 });
        
                                    /* If percentage is less than 65% (complete), return to initial pos */
                                    if(this.perc < 0.65){
                                        $('.scene9 .character-rosie-expression-neutral').addClass('active');
                                        $('.scene9 .character-rosie-expression-surprised').removeClass('active');
                                        $('.scene9 .drag-prompt').removeClass('hidden')
                                        gsap.to('.scene9 .character-maggie', .25, {x:-50})
                                        gsap.to('.scene9 .drag-progress', .25, { '--progressScene9': 0 })
                                    }
                                }
                            })
                        });
                    })
                }, 500)

                gsap.to('.scene9', .00001, { opacity: 0 });
                gsap.to('.scene-interstitial', 1, {opacity: 0});
                gsap.to('.scene9', 1, {opacity: 1});

                gsap.to('.scene9 .character-maggie', 1, { x: -50,ease:Linear.easeNone })
            }
        },

        {
            /* Scene 10 - Maggie has run home from school in tears. */
            animate: () => {
                let onComplete = () => {
                    /* This function runs after we transition into the scene. */
                    let maggieTimeline = gsap.timeline({
                        onComplete: () => {
                            /* Show the speech bubble for this scene, then move on to scene 11. */
                            game.speech.display(SPEECH_POOR_MAGGIE, () => {
                                game.pages.story.scenes[11].animate()
                            });
                        }
                    });

                    /* Open the door */
                    game.sfx.play('CHARACTER_MAGGIE_CRYING', () => {}, 'sfx', .5);
                    game.sfx.play('door-open');
                    $('.scene10 .door-closed').removeClass('active').addClass('inactive');
                    $('.scene10 .door-open, .scene10 .door-light').addClass('active').removeClass('inactive');
                
                    /* Delay 1s */
                    maggieTimeline.to({}, 1, {});

                    /* Maggie runs in, crying */
                    maggieTimeline.to('.scene10 .character-maggie', 1, { x: 452, ease: Linear.easeNone });

                    /* SFX for jump */
                    setTimeout(function(){
                        game.sfx.play('jump');
                    }, 2000)
                

                    /* And then jumps face-first onto her bed */
                    maggieTimeline.to('.scene10 .character-maggie', .5, {
                        x: 600,
                        y: -200,
                        rotate: 220,
                        ease: Linear.easeNone
                    });

                    maggieTimeline.to('.scene10 .character-maggie', .5, {
                        x: 800,
                        y: 20,
                        rotate: 260,
                        ease: Linear.easeNone
                    });     

                    /* SFX for landing on bed */
                    setTimeout(function(){
                        game.sfx.play('land_bed');
                    }, 3000)

                }

                let transitionTimeline = gsap.timeline({onComplete});

                $('.scene10').addClass('scene--active');
                gsap.to('.scene10', .000001, { opacity: 0 })

                /* fade to black */
                $('.scene-interstitial p').html('');


                transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 });
                transitionTimeline.to('.scene9', 1, { opacity: 0 }, '-=1')
                transitionTimeline.to({}, 1, {});
                transitionTimeline.to('.scene-interstitial', 1, { opacity: 0})
                transitionTimeline.to('.scene10', 1, { opacity: 1}, "-=1")
                transitionTimeline.to({}, 1, {});
            }
        },

        {
            /* Scene 11: Close up of Maggie crying in bed. The user has to tuck her
               in to make her sleep. */
            animate: () => {

                $('.scene10').removeClass('scene--active');
                $('.scene11').addClass('scene--active');
                
                game.speech.display(SPEECH_POOR_MAGGIE_2, () => {
                /* Draggable Time! */
                
                $('.drag-prompt').removeClass('hidden')
                gsap.to('.drag-progress', .5, {
                    opacity: 1
                });

                let instance = Draggable.create('.scene11 .blanket-closeup', {
                    type: 'y',


                    onDrag: function(e){
                        /* Calculate the percentage of the interaction that has been completed. */
                        // To do this we need the -relative- position of the draggable element to the game stage.
                        // *sigh* have i over engineered this?
                        $('.scene11 .drag-prompt').addClass('hidden')

                        let draggableRect = e.target.getBoundingClientRect();
                        let stageRect = document.querySelector('.game-page-story').getBoundingClientRect();

                        let y = draggableRect.top - stageRect.top;

                        let yMax   = 631;
                        let yMin   = 360;

                        let perc = (y + yMin / yMax - yMin) / (yMax - yMin); /* i don't know how this works, but it does */
                        /* invert percentage */
                            perc = Math.abs( 1 - perc );
                        this.perc = perc;

                        let progress = perc * 296;

                        console.log(progress);

                        if(perc >= 0.8){
                            /* Destroy the Draggable */
                            instance[0].kill();

                            /* Move blanket */
                            gsap.to('.scene11 .blanket-closeup', .5, {
                                y: -260
                            })

                            /* Hide the drag stuff */
                            $('.scene11 .drag-prompt').addClass('hidden')

                            game.sfx.play('blanket');

                            setTimeout(function(){
                                /* Change facial expression to sleep */
                                gsap.to(".scene11 .character-maggie-expression-crying", .25, {
                                    opacity: 0,
                                    onComplete: (e) => {
                                        $(".scene11 .character-maggie-expression-crying").removeClass('active');
                                        $('.scene11 .character-maggie-expression-sleeping').css({
                                            opacity: 0
                                        }).addClass('active');
                                        gsap.to('.scene11 .character-maggie-expression-sleeping', .25, {
                                            opacity: 1,
                                            onComplete: () => {
                                                // After 1.5s, fade to black
                                                setTimeout(function(){
                                                    $('.scene-interstitial p').html('');
                                                    let transitionTimeline = gsap.timeline();
                                                    transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 });
                                                    transitionTimeline.to('.scene11', 1, { opacity: 0 }, '-=1')
                                                    transitionTimeline.to({}, 1, {});

                                                    /* Then animate to dream sequence (scene 12) */
                                                    game.pages.story.scenes[12].animate();
                                                }, 2500)
                                            }
                                        })
                                    }
                                })
                            }, 500)
                        }
                    },
                    onDragStart: function(){
                        
                    },
                    onDragEnd: function(){
                        /* If percentage is less than 80% (complete), return to initial pos */
                        if(this.perc < 0.8){
                            $('.scene11 .drag-prompt').removeClass('hidden');
                            gsap.to('.scene11 .blanket-closeup', .25, { y: 0 });
                        }
                    }
                })

                });

            }
        },

        {
            /* Scene 12 (dream sequence!) */
            animate: () => {

                /* First, show interstitial scene so the player isn't completely confused as to what is going on */
                $('.scene-interstitial p').html('That night, Maggie had a very strange dream...');
                let transitionTimeline = gsap.timeline();
                transitionTimeline.to('.scene-interstitial', .00000000001, { opacity: 1 });
                transitionTimeline.to('.scene-interstitial p', .00000000001, { opacity: 1 });
                transitionTimeline.to('.scene11', 1, { opacity: 0 }, '-=1')
                transitionTimeline.to({}, 1, {});

                game.sfx.play('dreamstart', () => {
                    setTimeout(function(){
                        gsap.to('.scene-interstitial', 2, { opacity: 0 })
                        game.pages.story.scenes[12].animateDream()
                    }, 2000)
                })
            },

            animateDream: () => {
                $('.scene12').addClass('scene--active');
                game.bgm.play('dream');

                const fadeOut = (callback = () => {}) => {
                    /* Fade out the text. */
                    gsap.to('.scene12 .text', .5, { opacity: 0, onComplete: callback })
                }

                const fadeIn = (callback = () => {}) => {
                    /* Fade in the text. */
                    gsap.to('.scene12 .text', .5, { opacity: 1, onComplete: callback });
                }                

                const display = (speech, callback) => {
                    fadeOut(()=>{
                        game.speech.display(speech, callback);
                        fadeIn();
                    })
                }

                /* Animate the background! */
                let anim = gsap.to('.scene12', { '--x': 1024, '--y': 768, duration: 60, yoyo: true, repeat: 20 })
                
                window.fadeOut = fadeOut;

                /** now i REALLY wish i had used async/await. this is going to be disgusting. */
                setTimeout(()=>{
                
                    display(SPEECH_DREAM_0, () => {
                        display(SPEECH_DREAM_1, () => {
                            display(SPEECH_DREAM_2, () => {
                                display(SPEECH_DREAM_3, () => {
                                    display(SPEECH_DREAM_4, () => {
                                        display(SPEECH_DREAM_5, () => {
                                            display(SPEECH_DREAM_6, () => {
                                                display(SPEECH_DREAM_7, () => {
                                                    display(SPEECH_DREAM_8, () => {
                                                        /* for this speech, we want it to appear at the bottom. wait 500ms and do that */
                                                        $('.character-harry-dream').addClass('reveal').one('animationend', () => {
                                                            gsap.to('.character-harry-dream', 1, {
                                                                opacity: 0,
                                                                onComplete: () => {
                                                                    $('.character-harry-dream').removeClass('reveal').hide();
                                                                }
                                                            })
                                                        })
                                                        setTimeout(()=>{
                                                            $('.dream-text').addClass('bottom');
                                                        }, 500)
                                                        display(SPEECH_DREAM_9, () => {
                                                            display(SPEECH_DREAM_10, () => {    
                                                                /* move it to the center again */
                                                                setTimeout(()=>{
                                                                    $('.dream-text').removeClass('bottom');
                                                                }, 500);
                    
                                                                display(SPEECH_DREAM_11, () => {
                                                                    display(SPEECH_DREAM_12, () => {
                                                                        setTimeout(function(){
                                                                            gsap.to('.scene-interstitial', 2, { opacity: 1 })
                                                                            $('.scene-interstitial p').text('')
                                                                            game.bgm.stop()
                                                                            game.sfx.play('dreamend')
                                                                            /* xition to next scene! */
                                                                            setTimeout(()=>{
                                                                                game.pages.story.scenes[13].animate();
                                                                            }, 3676)
                                                                        }, 2000);
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                    
                }, 3000)
            }
        },

        {
            animate: () => {
                /* Scene 13: Maggie has just woken up from her dream.
                   The alarm clock has rung again. This time, however, she is already awake
                   and is holding the alarm clock in her hand. */
                $('.scene12').removeClass('scene--active');
                $('.scene13').addClass('scene--active');
                $('.scene-interstitial').css({opacity: 0});
                game.speech.display(SPEECH_WAKE_UP, () => {
                    game.sfx.play('whee');
                    gsap.to('.scene13 .character-maggie, .scene13 .item.clock', .5, { x: -1600 });

                    
                    game.speech.display(SPEECH_MAGGIE_EXCITED_SCHOOL, () => {
                        /* To scene 14 - Maggie storming into school confidently, everyone looking at her
                           like -wow she's changed- or whatever */
                        
                        game.pages.story.scenes[14].animate();
                    });
                });
            }
        },

        {
            animate: () => {
                /* Scene 14: Schoolyard. Maggie storms into school confidently! */
                game.bgm.play('sunny');
                $('.scene14').addClass('scene--active');
                $('.scene14').css({opacity: 0});

                let transition = gsap.timeline({ onComplete: game.pages.story.scenes[14].afterTransition })
                transition.to('.scene13', .5, { opacity: 0});
                transition.to('.scene14', .5, { opacity: 1}, '-=1');
            },
            afterTransition: () => {

                /* Okay, there's a lot of moving parts in this scene.
                   -> Jessie and Haroon (attached) are walking towards the -left-, and both of their feet should be movin.
                   -> Lil is standing behind the tree. She's not doing much / anything.
                   -> Maggie runs into school confidently.
                    okay that's not that much
                */

                let jessieHaroonWalkingTimeline = gsap.timeline({yoyo: true, repeat: 20});
                    jessieHaroonWalkingTimeline.to('.scene14 .character-jessie .character-maggie-leg-l, .scene14 .character-haroon .character-maggie-leg-l', .35, { y: -10, ease: Linear.easeNone });
                    jessieHaroonWalkingTimeline.to('.scene14 .character-jessie .character-maggie-leg-r, .scene14 .character-haroon .character-maggie-leg-r', .35, { y: -10, ease: Linear.easeNone }, '-=.175');
                gsap.to('.scene14 .character-jessie, .scene14 .character-haroon', 10, { x: -800, ease: Linear.easeNone });
                
                // make clouds move
                gsap.to('.scene14 .cloud0', 10, { x: -50 })
                gsap.to('.scene14 .cloud1', 10, { x: -70 })

                // make maggie storm into school!
                game.speech.display(SPEECH_MAGGIE_SCHOOL_CONFIDENT, () => {
                    game.pages.story.scenes[14].out();
                });
                let maggieRunningTimeline = gsap.timeline({yoyo: true, repeat: 20});
                    maggieRunningTimeline.to('.scene14 .character-maggie .character-maggie-leg-l', .15, { y: -10, ease: Linear.easeNone });
                    maggieRunningTimeline.to('.scene14 .character-maggie .character-maggie-leg-r', .15, { y: -10, ease: Linear.easeNone });
                
                let maggieMoveTimeline = gsap.timeline();
                maggieMoveTimeline.to({}, 1, {});
                maggieMoveTimeline.to('.scene14 .character-maggie', 1.5, { x: 760, ease: Linear.easeNone })
                maggieMoveTimeline.to('.scene14 .character-maggie', .5, { opacity: 0, scale: 0 })
                setTimeout(function(){
                    game.sfx.play('door');
                }, 2500);
            },
            out: () => {
                game.bgm.stop();
                let transitionTimeline = gsap.timeline();
                /* fade to black */
                $('.scene-interstitial p').html('');

                transitionTimeline.to('.scene-interstitial', 1, { opacity: 1, onComplete: () => {
                    gsap.to('.scene-interstitial p', .00001, { opacity: 0})
                    setTimeout(function(){
                        game.speech.display(SPEECH_MAGGIE_BEST_DAY_OF_SCHOOL, () => {
                            setTimeout(function(){
                                gsap.to('.scene-interstitial p', 1, { opacity: 0 });
                                game.sfx.play('schoolsout', () => {
                                    /* animate to scene 15 - Maggie back outside, sees Harry for the first time */
                                    game.pages.story.scenes[15].animate();
                                });
                            }, 1000)
                        });
                        gsap.to('.scene-interstitial p', 1, { opacity: 1})
                    }, 1500);
                } });
                transitionTimeline.to('.scene14', 1, { opacity: 0 }, '-=1')
            }
        },

        /* Scene 15: Maggie, after school, standing outside. Harry is listening to music and reading a book under a tree. */
        {
            animate: () => {
                $('.scene14').removeClass('scene--active');
                $('.scene15').addClass('scene--active').css({opacity: 0});

                gsap.to('.scene-interstitial', 1, { opacity: 0});
                gsap.to('.scene15', 1, { opacity: 1});

                game.bgm.play('sunny');

                gsap.to('.scene15 .character-maggie', 1, { x: -50, ease: Linear.easeNone, onComplete: () => {
                    /* Change Maggie's expression to surprised */
                    $('.scene15 .character-maggie-expression-smile').removeClass('active');
                    $('.scene15 .character-maggie-expression-surprised').addClass('active');
                     
                    /* Change Maggie's expression to blush after 2.5s of speech (when i say - could it be?) */
                    setTimeout(function(){
                        $('.scene15 .character-maggie-expression-surprised').removeClass('active');
                        $('.scene15 .character-maggie-expression-blush').addClass('active');
                    }, 2500);

                    game.speech.display(SPEECH_AFTER_SCHOOL_HARRY, () => {
                        game.speech.display(SPEECH_AFTER_SCHOOL_HARRY_GUIDANCE, () => {
                            /* Make harry draggable.
                               Yep, that means that mess of spaghetti code is getting copied and pasted again.
                               This is actually the last time i think i need to do this... :( kinda missing this project already */
                                gsap.to('.scene15 .drag-progress', .5, { opacity: 1 });
                                $('.scene15 .drag-prompt').removeClass('hidden');
    
                                let instance = Draggable.create('.scene15 .character-maggie', {
                                    type: 'x',
    
                                    //bounds: '.scene15 .drag-progress',
    
                                    onDrag: function(e){
                                        /* Calculate the percentage of the interaction that has been completed. */
                                        // To do this we need the -relative- position of the draggable element to the game stage.
                                        // *sigh* have i over engineered this?
                                        $('.scene15 .drag-prompt').addClass('hidden')
            

                                        let draggableRect = e.target.getBoundingClientRect();
                                        let stageRect = document.querySelector('.game-page-story').getBoundingClientRect();
            
                                        let x = draggableRect.left - stageRect.left;
            
                                        let xMax   = 550;
                                        let xMin   = 130;
            
                                        let perc = (x + xMin / xMax - xMin) / (xMax - xMin); /* i don't know how this works, but it does */
                                        /* invert percentage */
                                            perc = 1 - perc;
                                            if(perc < 0){
                                                perc = 0;
                                            }
                                        this.perc = perc;
            
                                        let progress = perc * 471;
                        
                                        console.log(perc);

                                        if(perc >= 0.5){
                                            /* Destroy the Draggable */
                                            instance[0].kill();
            
                                            /* hide speech bubble */
                                            game.speech.hideBubble();
                                            
                                            /* Harry and Maggie attract! */
                                            game.sfx.play('magnet');
                                            gsap.to('.scene15 .character-maggie', { x: -433 } )
                                            $('.scene15 .character-harry-expression-blush').removeClass('active');
                                            $('.scene15 .character-harry-expression-blush-down').addClass('active');
                                            $('.scene15 .character-maggie-expression-blush').removeClass('active');
                                            $('.scene15 .character-maggie-expression-blush-up').addClass('active');
                                            $('.scene15 .character-harry-arms-reading').removeClass('active').addClass('inactive');
                                            $('.scene15 .character-harry-arm-l-reading').removeClass('inactive').addClass('active');

                                            /* Hide the drag stuff */
                                            $('.scene15 .drag-prompt').addClass('hidden')
                                            gsap.to('.scene15 .drag-progress', .5, { opacity: 0 });   
                                        
                                            game.speech.display(SPEECH_MAGGIE_HARRY_CLICK, () => {
                                                game.sfx.play('CHARACTER_MAGGIE_HELLO', () => {
                                                    game.sfx.play('CHARACTER_HARRY_HEY', () => {
                                                        /* fade to black */
                                                        $('.scene-interstitial p').html('');

                                                        gsap.to('.scene-interstitial', 1, { opacity: 1 });
                                                        gsap.to('.scene15', 1, { opacity: 0 })
                                                        setTimeout(function(){
                                                            game.bgm.play('valse-gymnopedie-by-kevin-macleod-from-filmmusic-io', 1000, .4);
                                                            game.speech.display(SPEECH_MAGGIE_HARRY_EPILOGUE, () => {
                                                                /* to scene 16! woooot! we're so close to finshing this! */
                                                                game.pages.story.scenes[16].animate();
                                                            });
                                                        }, 1500);
                                                    }, 'sfx', .6)
                                                })
                                            });
                                        }
            
                                        $('.scene15 .drag-progress')[0].style.setProperty('--progressScene15', `${progress}px`)
                                    },
                                    onDragStart: function(){

                                        game.sfx.play('CHARACTER_MAGGIE_SURPRISED');
                                        setTimeout(function(){
                                            game.sfx.play('CHARACTER_HARRY_SURPRISED', () => {}, 'sfx', .4);
                                        }, 250);

                                        /* change maggie's expression and rotation */
                                        $('.scene15 .character-maggie-expression-blush').removeClass('active');
                                        $('.scene15 .character-maggie-expression-surprised-blush').addClass('active');
                                        gsap.to('.scene15 .character-maggie', .1, {});

                                        /* change harry's expression */
                                        $('.scene15 .character-harry-expression-reading').removeClass('active');
                                        $('.scene15 .character-harry-expression-blush').addClass('active');
                                    },
                                    onDragEnd: function(){
    
                                        $('.scene15 .character-maggie-expression-blush').addClass('active');
                                        $('.scene15 .character-maggie-expression-surprised-blush').removeClass('active');
            
                                        gsap.to('.scene15 .character-maggie', .1, { rotate: 0 });
            
                                        /* If percentage is less than 65% (complete), return to initial pos */
                                        if(this.perc < 0.5){
                                                
                                            /* change harry's expression back*/
                                            $('.scene15 .character-harry-expression-reading').addClass('active');
                                            $('.scene15 .character-harry-expression-blush').removeClass('active');

                                            $('.scene15 .drag-prompt').removeClass('hidden')
                                            gsap.to('.scene15 .character-maggie', .25, {x:-50})
                                            gsap.to('.scene15 .drag-progress', .25, { '--progressScene15': 0 })
                                        }
                                    }
                                })
                        });
                    })
                } });

            }
        },

        /* Scene 16: Maggie and Harry - first date, in the city, walking attached to each other, then disappear into the cafe. */
        {
            animate: () => {
                $('.scene15').removeClass('scene--active');
                $('.scene16').css({opacity: 0}).addClass('scene--active');
                gsap.to('.scene-interstitial', 1, { opacity: 0 });
                gsap.to('.scene16', 1, { opacity: 1, onComplete: game.pages.story.scenes[16].afterTransition });
            
                gsap.to('.scene16 .character-harry, .scene16 .character-maggie', 20, { x: -600, ease: Linear.easeNone })
                gsap.to('.scene16 .city', 8, { x: 44, ease: Linear.easeNone })
            },

            afterTransition: () => {
                setTimeout(function(){
                    game.speech.display(SPEECH_MAGGIE_HARRY_DATE_1, () => {
                        setTimeout(function(){
                            /* Fade to black */

                            $('.scene-interstitial p').html('');

                            let transitionTimeline = gsap.timeline({onComplete: game.pages.story.scenes[17].animate });
                            transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 });
                            transitionTimeline.to('.scene16', 1, { opacity: 0 }, '-=1')
                            transitionTimeline.to({}, .5, {});
                        }, 500)
                    });
                }, 500)
            }
        },

        /* Scene 17 : Maggie and Harry at the park */
        {
            animate: () => {
                gsap.to('.scene17', .0000001, { opacity: 0 });
                $('.scene17').addClass('scene--active');
                game.sfx.play('CHARACTER_MAGGIE_WHEE_1', () => {
                    game.sfx.play('CHARACTER_HARRY_WHEE_1', () => {
                        game.sfx.play('CHARACTER_MAGGIE_WHEE_2', () => {
                            game.sfx.play('CHARACTER_HARRY_WHEE_2', () => {
                            
                            }, 'sfx', .3)
                        }, 'sfx', .5);
                    }, 'sfx', .3)
                }, 'sfx', .5)
                gsap.to('.scene17', 1, { opacity: 1 });
                gsap.to('.scene-interstitial', 0, { opacity: 0, onComplete: () => {
                    game.pages.story.scenes[17].afterTransition();
                }})
                gsap.to('.park', 30, { x: -800 })
                gsap.to('.fence', 30, { x: 150 })
                setTimeout(function(){
                    gsap.to('.lil-billy-slide', 3, { x: 240, y: 180 })
                }, 1500);
            },

            afterTransition: () => {
                game.speech.display( SPEECH_MAGGIE_HARRY_DATE_2, () => {
                    setTimeout(function(){
                        /* Fade to black */
                        $('.scene-interstitial p').html('');

                        let transitionTimeline = gsap.timeline({onComplete: game.pages.story.scenes[18].animate });
                        transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 });
                        transitionTimeline.to('.scene17', 1, { opacity: 0 }, '-=1')
                        transitionTimeline.to({}, .5, {});
                    }, 2500)
                } )   
            }
        },

        /* Scene 18: Maggie and Harry in Maggie's room. */
        {

            animate: () => {
                gsap.to('.scene18', .0000001, { opacity: 0});
                $('.scene18').addClass('scene--active');
                gsap.to('.scene18', 1, { opacity: 1});
                gsap.to('.scene17, .scene-interstitial', 1, { opacity: 0, onComplete: () => {
                    $('.scene17').removeClass('scene--active');
                    game.pages.story.scenes[18].afterTransition()
                }})
                gsap.to('.scene18 .character-harry, .scene18 .character-maggie', 3, { x: 100, ease: Linear.easeNone })
            },

            afterTransition: () => {
                game.speech.display(SPEECH_MAGGIE_HARRY_DATE_3, () => {

                    gsap.to('.scene18 .character-harry-arm-l', .25, { rotate: 118 } )
                    $('.scene18 .character-harry-expression-blush-down').css({
                        'transform':        'scaleX(-1)',
                        'background-image': 'url(img/characters/harry/expression-harry-blush.png)' 
                    });

                    game.sfx.play('CHARACTER_HARRY_LAUGHING', () => {}, 'sfx', 1);

                    game.speech.display(SPEECH_MAGGIE_HARRY_DATE_3a, () => {
                        $('.scene18 .character-harry-expression-blush-down').css({
                            'transform':        'scaleX(1)',
                            'background-image': 'url(img/characters/harry/expression-harry-blush-down.png)' 
                        });
    
                        setTimeout(()=>{
                            game.pages.story.scenes[19].animate();
                        }, 2000);
                    })
                })    
            }

        },

        /* Scene 19: Maggie and Harry sat together on a hill, overlooking a bridge */
        {
            animate: () => {
                gsap.to('.scene19 .hill', .0000001, { top: 420, scale: 1.2 });
                gsap.to('.scene19 .hill', 6, { top: 450, scale: 1 });

                gsap.to('.scene19 .ocean', .0000001, { top: 300, scale: 1.05 });
                gsap.to('.scene19 .ocean', 6, { top: 247, scale: 1 });

                gsap.to('.scene19 .bridge', .0000001, { top: 300, left: 269, scale: 1.1 });
                gsap.to('.scene19 .bridge', 6, { top: 258, left: 269, scale: 1 });

                

                $('.scene19').addClass('scene--active').css({opacity: 0});
                gsap.to('.scene18', 1, { opacity: 0, onComplete: () => {$('.scene18').removeClass('scene--active')}});
                gsap.to('.scene19', 1, { opacity: 1, onComplete: game.pages.story.scenes[19].afterTransition });
            },

            afterTransition: () => {
                /* Hill animation */
                game.speech.display(SPEECH_MAGGIE_HARRY_BRIDGE_1, () => {
                    game.speech.display(SPEECH_MAGGIE_HARRY_BRIDGE_2, () => {
                        setTimeout(function(){
                            /* fade to black */
                            gsap.to('.scene-interstitial p', .0000001, { opacity: 0 })
                            $('.scene-interstitial p').text('The End');

                            let transitionTimeline = gsap.timeline({onComplete: game.pages.story.scenes[19].afterInterstitialTransition });
                            transitionTimeline.to('.scene-interstitial', 1, { opacity: 1 });
                            transitionTimeline.to('.scene19', 1, { opacity: 0 }, '-=1')
                            transitionTimeline.to({}, .75, {});
                            transitionTimeline.to('.scene-interstitial p', { opacity: 1 })    
                        }, 2000);
                    });
                });
            },

            afterInterstitialTransition: () => {
                game.sfx.play('SPEECH_THE_END', () => {
                    /* End of game!! */
                    game.bgm.stop();
                    gsap.to('.scene-interstitial p', 2, { opacity: 0, onComplete: () => {
                        game.modals.storyFinished();
                    } });

                }, 'speech');
            }
        }
    ]
}