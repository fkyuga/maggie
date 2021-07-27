game.pages.story = {
    onload: function(){
        game.pages.story.scenes[1].animate();
    },

    scenes: [
        {
            /* Scene 0 - Magnets are in everything! */
            animate: () => {
                let tl = gsap.timeline({ onComplete: () => {
                    /* After completion, move to the next scene. */
                    tl.to({}, 2, {}); /* 2 second delay */
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

                           let instance = Draggable.create('.scene1 .character-haroon', {
                               type: 'x',
                               bounds: '.scene1 .drag-progress',
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

                                   let progress = perc * 550;

                                    console.log(progress);

                                   if(perc >= 0.65){
                                       /* Complete the interaction if the user is at 65% (magnets would attract at that point) */
                                       /* Destroy the Draggable */
                                       let completeTl = gsap.timeline();
                                       instance[0].kill();
                                       game.sfx.play('magnet');
                                       gsap.to('.scene1 .character-haroon', .15, { x: "-415px" })
                                       gsap.to('.drag-progress', .15, { '--progress': "550px" })
                                       gsap.to('.drag-progress', .25, { opacity: 0, y: -24 });
                                   
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
                                        gsap.to('.drag-progress', .25, { '--progress': 0 })
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
                tl.timeScale(10);
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
                haroonWave.timeScale(10);
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
                    game.sfx.play('alarm');
                    setTimeout(function(){
                        /* Wake maggie up (stop her sleeping anim) */
                        $('.scene5 .maggie-pajamas').addClass('awake');
                        $('.scene5 .sleepbubbles').hide();
                        $('.scene5 .maggie-pajamas .expression-sleeping').hide();
                        $('.scene5 .maggie-pajamas .expression-shocked').show();

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