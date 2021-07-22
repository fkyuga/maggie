game.pages.lab = {

/* Items -- array of item objs */
items: [
    {
        id: 'boot',
        name: 'Boot',
        src: 'img/items/boot@2x.png',
        magnetic: false
    },
    {
        id: 'clock',
        name: 'Alarm Clock',
        src: 'img/items/clock@2x.png',
        magnetic: true
    },
    {
        id: 'coin_2p',
        name: 'Two Pence Coin',
        src: 'img/items/coin_2p@2x.png',
        magnetic: false
    },
    {
        id: 'coin_10p',
        name: 'Ten Pence Coin',
        src: 'img/items/coin_10p@2x.png',
        magnetic: true
    },
    {
        id: 'cola',
        name: 'Cola Can',
        src: 'img/items/cola@2x.png',
        magnetic: false
    },
    {
        id: 'glass',
        name: 'Glass of Water',
        src: 'img/items/glass@2x.png',
        magnetic: false
    },
    {
        id: 'key',
        name: 'House Key',
        src: 'img/items/key@2x.png',
        magnetic: true
    },
    {
        id: 'paperclip',
        name: 'Paperclip',
        src: 'img/items/paperclip@2x.png',
        magnetic: true
    },
    {
        id: 'scissors',
        name: 'Scissors',
        src: 'img/items/scissors@2x.png',
        magnetic: true
    }
],

/* This obj will contain references to frequently accessed elements. */
refs: {},

helpers: {

    getMatrix: (element) => {
        /* from https://stackoverflow.com/questions/7982053/get-translate3d-values-of-a-div */
        const values = element.style.transform.split(/\w+\(|\);?/);
        const transform = values[1].split(/,\s?/g).map(e => parseInt(e.replace('px', '')))
    
        return {
          x: transform[0],
          y: transform[1],
          z: transform[2]
        };
    },

    resetDropZones: function(){
        /* Returns all drop zones to initial state. */
        game.pages.lab.refs.BOX_MAGNETIC.classList.remove('hint')
        game.pages.lab.refs.BOX_NOT_MAGNETIC.classList.remove('hint')
        $('.game-page-lab .maggie-drop-zone').hide();
    },
    
    detectDropZone: function(draggableEl){
        /* Detects what element in [refs] object that [draggableEl] was dropped on.
           This is used in onDrag and onDragEnd. */

        /* Get the current position of the draggable element. */
        let { x, y } = draggableEl.getBoundingClientRect();

        /* Get elements underneath the draggable element. */
        let els = document.elementsFromPoint(x, y);

        /* Now, filter refs and return only the element that draggableEl
           obscures */
           
        return Object.keys( game.pages.lab.refs ).filter( k => {
            return els.includes( game.pages.lab.refs[k] );
        } )[0]
    },

    checkGameCompletion: function(){
        /* If all items have been moved to the correct box, play the end-game sequence.
           We can determine if the game is complete by checking of all item images are hidden. */
           if($('.item img:hidden').length == game.pages.lab.items.length){
               /* Game is complete! Show congratulations message w/ # of moves, throw down the confetti, and play the sound effect. */
               confetti({
                    particleCount: 300,
                    angle: 90,
                    spread: 180,
                    scalar: 2,
                    resize: true
                })
               game.sfx.play('applause');
           }
    },

    resetMaggieEyes: function(){
        let { EYE_L, EYE_R } = game.pages.lab.refs;

        TweenLite.to([EYE_L, EYE_R], 0.2, {
            rotate: 0
        });
    },

    itemAbsoluteXY: function(el, dx, dy){
        /* because of quirks of how position: absolute works with transform: translate, we can't just animate the item to its new pos by specifying the
           destination x/y. we have to do some maths -- subtracting the offsets of other elements.

           this function... does that */
        
        let { x, y } = game.pages.lab.helpers.getMatrix(el);
        let { left, top } = $(el).position();

        // transformX - position.left
        let newX = x - left;
        let newY = y - top - $('.item-bar').position().top - $('.item-bar ul').position().top;

        return { x: newX + dx, y: newY + dy}
    },

    enableItems: () => {
        $('.item-bar__item').removeClass('disabled');
        for ( let item of game.pages.lab.items ) {
            if(item._draggableInstance){
                item._draggableInstance.map(i => i.enable());
            }
        }
    },

    disableItems: (except) => {
        /* This function is used during gameplay.
           Once the user has dragged an item to Maggie to see if it's magnetic, we want to disable dragging of all other items except that one to avoid
           confusion.

           This function, then:
                -> adds class 'disabled' to all item elements (except those that have an ID == [except])
                -> disables all Draggable instances (except those for items that have ID == [except])
        */

        // first let's re-enable everything TODO

        for ( let item of game.pages.lab.items ) {
            if(item.id == except) continue; /* do nothing */
            $(`.item-bar__item#${item.id}`).addClass('disabled');
            item._draggableInstance.map(i => i.disable());
        }
    }

},

handlers: {

    maggieEyesFollowPointer: function(){
        /* Makes Maggie's eyes follow the mouse pointer (or the touch pos)
           Adapted from https://stackoverflow.com/questions/15653801/rotating-object-to-face-mouse-pointer-on-mousemove. */

        let { EYE_L, EYE_R } = game.pages.lab.refs;
        
        let eyeBoundingRect = EYE_L.getBoundingClientRect();
        let eyeCenter = {
            x: eyeBoundingRect.left + eyeBoundingRect.width  / 2,
            y: eyeBoundingRect.top  + eyeBoundingRect.height / 2
        };

        document.addEventListener('touchmove', e => {
            let { clientX, clientY } = e.touches[0];
            let rotate = Math.atan2(clientX - eyeCenter.x, - (clientY - eyeCenter.y) )*(180 / Math.PI) + 90;    
            
            TweenLite.to([EYE_L, EYE_R], .2, { rotate })
        })

        document.addEventListener('mousemove', e => {
            let { clientX, clientY } = e;
            let rotate = Math.atan2(clientX - eyeCenter.x, - (clientY - eyeCenter.y) )*(180 / Math.PI) + 90;    
            
            TweenLite.to([EYE_L, EYE_R], .2, { rotate })
        })
    }

},

onload: ()=>{
    /* Reset/initialise moves counter. */
    game.pages.lab.moves = 0;
    game.pages.lab.maggieHasMagnet = false;

    /* Shuffle the items array to randomise their order. */
    game.pages.lab.items = game.pages.lab.items
        .map(a => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)

    /* Store references to elements of interest */
    game.pages.lab.refs.BOX_MAGNETIC     = document.querySelector('.box--magnetic')
    game.pages.lab.refs.BOX_NOT_MAGNETIC = document.querySelector('.box--not-magnetic')
    game.pages.lab.refs.MAGGIE           = document.querySelector('.maggie-drop-zone');

    game.pages.lab.refs.EYE_L = document.querySelector('.game-page-lab .character-maggie-face-eye-l')
    game.pages.lab.refs.EYE_R = document.querySelector('.game-page-lab .character-maggie-face-eye-r')

    /* Initialize handlers */
    game.pages.lab.handlers.maggieEyesFollowPointer();
    game.pages.lab.helpers.resetDropZones();
    
    /* Populate the items bar */
    for ( let item of game.pages.lab.items ) {
        /* For each item -- clone the template, add img and other
           attributes, and add it to the item bar ul. */

        let itemNode = $($('#item-bar__item-template').html());
            $(itemNode).find('img').attr('src', item.src);
            $(itemNode).attr('id', item.id);
            $(itemNode).attr('data-item-name', item.name);

        $('.item-bar__items').append(itemNode);

        /* Enable Draggable */
        /* Assign the instance to the items object */
        item._draggableInstance = Draggable.create(`#${item.id} .item`, {
            onPress: function(){
                /* Stash the element's initial position in
                   case we need to return it there later. */
                   if(!this.initialX){
                    this.initialX = this.x;
                    this.initialY = this.y;
                }
            },
            onDragStart: function(){
                $(`#${item.id} .item`).addClass('item--dragging');                
                
                /* Change Maggie's drop zone image to represent this item. */
                /** (not if Maggie already has something attached to her, though) */
                if(!game.pages.lab.maggieHasMagnet){
                    $('.game-page-lab .maggie-drop-zone').show();
                    $('.game-page-lab .maggie-drop-zone img')
                        .removeClass()
                        .addClass(`item-${item.id}`)
                        .attr('src', `img/items/${item.id}--hint@2x.png`)
                        .css({
                            top: 269 - $('.game-page-lab .maggie-drop-zone img').height()/2,
                            right: 354 - $('.game-page-lab .maggie-drop-zone img').width()/2
                        });
                }
                
            },
            onDrag: function(e){
                /* This event fires any time the draggable object is moved.
                   We use this to create a hint when the object is dragged
                   over an area of interest -- Maggie, or the boxes. */

                let dropZone = game.pages.lab.helpers.detectDropZone(e.target);

                if(dropZone == "BOX_MAGNETIC" || dropZone == "BOX_NOT_MAGNETIC"){
                    game.pages.lab.refs[dropZone].classList.add('hint');
                } else {
                    game.pages.lab.refs['BOX_MAGNETIC'].classList.remove('hint');
                    game.pages.lab.refs['BOX_NOT_MAGNETIC'].classList.remove('hint');
                }

                if(dropZone == "MAGGIE"){
                    game.pages.lab.refs['MAGGIE'].classList.add('hint');
                } else {
                    game.pages.lab.refs['MAGGIE'].classList.remove('hint');
                }

            },
            onDragEnd: function(e){
                /* The item will now zehave differently based on the
                   "drop zone" it landed on:

                     -> If it landed near Maggie, evaluate whether or not
                        the item is magnetic and perform a different
                        animation based on that.

                     -> If it landed near either box, evaluate whether or not
                        the answer was correct.
                    
                     -> Otherwise, return it to the initial position. 
                */

                let dropZone = game.pages.lab.helpers.detectDropZone(e.target);

                let itemName = e.target.parentElement.id;
                let item = game.pages.lab.items.filter(candidate => candidate.id == itemName)[0];
                $(`#${item.id} .item`).removeClass('item--dragging');

                console.log(dropZone);

                switch(dropZone){
                    case "BOX_MAGNETIC":
                    case "BOX_NOT_MAGNETIC":
                        /* Boxes logic
                           Check if the item being dragged belongs in the box
                           the player dragged it over.

                           If it does, play success sequence.
                           If it doesn't, return it to the stashed position and
                           ask the player to guess again.
                        */

                        /* Update moves counter. */
                        let isBoxMagnetic = dropZone == "BOX_MAGNETIC"
                        if(item.magnetic == isBoxMagnetic){
                            /* correct! hide the item */
                            TweenLite.to(this.target, .2, {
                                opacity: 0,
                                onComplete: ()=>{
                                    $(this.target).hide();

                                    /* Check if game is completed */
                                    game.pages.lab.helpers.checkGameCompletion();
                                }
                            })
                            game.sfx.play('correct')

                            /* re-enable movement */
                            game.pages.lab.helpers.enableItems()
                            game.pages.lab.maggieHasMagnet = false;

                            /* maggie happy face and sound */
                            $('.game-page-lab .character-expression')
                                .removeClass('active');
                            $('.game-page-lab .character-maggie-expression-happy')
                                .addClass('active');

                            setTimeout(function(){
                                $('.game-page-lab .character-expression')
                                .removeClass('active');
                                $('.game-page-lab .character-maggie-expression-neutral')
                                .addClass('active');
                            }, 1000);
                            
                        } else {
                            /* incorrect - fling back to original position */
                            game.sfx.play('incorrect');
                            TweenLite.to(this.target, .34, {
                                x: this.initialX,
                                y: this.initialY
                            })

                            /* maggie sad face and sound :( */
                            $('.game-page-lab .character-maggie-face-mouth')
                                .removeClass('character-maggie-face-mouth-smile')
                                .addClass('character-maggie-face-mouth-frown');
                            
                            let { EYE_L, EYE_R } = game.pages.lab.refs;

                            TweenLite.to([EYE_L, EYE_R], 0.3, {
                                rotate: 270
                            });
                        
                            setTimeout(function(){
                                $('.game-page-lab .character-maggie-face-mouth')
                                    .removeClass('character-maggie-face-mouth-frown')
                                    .addClass('character-maggie-face-mouth-smile');
                                game.pages.lab.helpers.resetMaggieEyes();
                            }, 1000)
                            
                        }

                        
                        break;

                    case "MAGGIE":
                        /* Dropped on Maggie!

                            If the item is magnetic, move its x-position to directly
                            next to Maggie, play a sound, and change Maggie's expression.

                            If the item isn't magnetic, move it's y-position to onto the desk,
                            play a sound, and move Maggie's eyes to follow it. */
                    

                        if(item.magnetic){
                            /* Click onto Maggie */
                            TweenLite.to(this.target, .3, {
                                ...game.pages.lab.helpers.itemAbsoluteXY(this.target, 560, 260),
                                rotate: 359
                            })

                            game.sfx.play('magnet');

                            /* Change maggie's expression to surprised */
                            $('.game-page-lab .character-expression')
                                .removeClass('active');
                            $('.game-page-lab .character-maggie-expression-surprised')
                                .addClass('active');

                            /* Store in var */
                            game.pages.lab.maggieHasMagnet = true;

                            /* Disable all other items */
                            game.pages.lab.helpers.disableItems(itemName)
                        }

                        break;

                    default:
                        /* Return to initial position with an anim. */
                        TweenLite.to(this.target, .34, {
                            x: this.initialX,
                            y: this.initialY
                        });
                        game.pages.lab.helpers.resetMaggieEyes();
                        break;
                }

                /* Restore states of drop zones. */
                game.pages.lab.helpers.resetDropZones();

                if(['BOX_MAGNETIC', 'BOX_NOT_MAGNETIC', 'MAGGIE'].includes(dropZone)){
                    /** Increment + update moves counter **/
                    $('.game-page-lab .moves-counter').text( game.pages.lab.moves+=1 );
                }

            }
        });
    }
}

}