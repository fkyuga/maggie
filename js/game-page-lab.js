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

    resetDropZones: function(){
        /* Returns all drop zones to initial state. */
        game.pages.lab.refs.BOX_MAGNETIC.classList.remove('hint')
        game.pages.lab.refs.BOX_NOT_MAGNETIC.classList.remove('hint')
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
    }

},

onload: ()=>{
    /* Reset/initialise moves counter. */
    game.pages.lab.moves = 0;

    /* Shuffle the items array to randomise their order. */
    game.pages.lab.items = game.pages.lab.items
        .map(a => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)

    /* Store references to elements of interest */
    game.pages.lab.refs.BOX_MAGNETIC = document.querySelector('.box--magnetic')
    game.pages.lab.refs.BOX_NOT_MAGNETIC = document.querySelector('.box--not-magnetic')

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
        Draggable.create(`#${item.id} .item`, {
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
            },
            onDragEnd: function(e){
                $(`#${item.id} .item`).removeClass('item--dragging');

                /* Restore states of drop zones. */
                game.pages.lab.helpers.resetDropZones();

                /* The item will now behave differently based on the
                   "drop zone" it landed on:

                     -> If it landed near Maggie, evaluate whether or not
                        the item is magnetic and perform a different
                        animation based on that.

                     -> If it landed near either box, evaluate whether or not
                        the answer was correct.
                    
                     -> Otherwise, return it to the initial position. */

                let dropZone = game.pages.lab.helpers.detectDropZone(e.target);
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
                        game.pages.lab.moves += 1;
                        console.log(`${game.pages.lab.moves} moves`)
                        let isBoxMagnetic = dropZone == "BOX_MAGNETIC"
                        let itemName = e.target.parentElement.id;
                        let item = game.pages.lab.items.filter(candidate => candidate.id == itemName)[0];

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
                        } else {
                            /* incorrect - fling back to original position */
                            game.sfx.play('incorrect');
                            TweenLite.to(this.target, .34, {
                                x: this.initialX,
                                y: this.initialY
                            })
                        }

                        
                        break;

                    default:
                        /* Return to initial position with an anim. */
                        TweenLite.to(this.target, .34, {
                            x: this.initialX,
                            y: this.initialY
                        });
                        break;
                }

            }
        });
    }
}

}