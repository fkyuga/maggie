game.pages.lab = {

/* Items -- array of item objs */
items: [
    {
        id: 'boot',
        name: 'Boot',
        src: 'img/items/boot@2x.png'
    },
    {
        id: 'clock',
        name: 'Alarm Clock',
        src: 'img/items/clock@2x.png'
    },
    {
        id: 'coin_2p',
        name: 'Two Pence Coin',
        src: 'img/items/coin_2p@2x.png'
    },
    {
        id: 'coin_10p',
        name: 'Ten Pence Coin',
        src: 'img/items/coin_10p@2x.png'
    },
    {
        id: 'cola',
        name: 'Cola Can',
        src: 'img/items/cola@2x.png'
    },
    {
        id: 'glass',
        name: 'Glass of Water',
        src: 'img/items/glass@2x.png'
    },
    {
        id: 'key',
        name: 'House Key',
        src: 'img/items/key@2x.png'
    },
    {
        id: 'paperclip',
        name: 'Paperclip',
        src: 'img/items/paperclip@2x.png'
    },
    {
        id: 'scissors',
        name: 'Scissors',
        src: 'img/items/scissors@2x.png'
    }
],

onload: ()=>{
    /* Shuffle the items array to randomise their order. */

    game.pages.lab.items = game.pages.lab.items
        .map(a => ({sort: Math.random(), value: a}))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)

    /* Populate the items bar */
    for ( let item of game.pages.lab.items ) {
        /* For each item -- clone the template, add img and other
           attributes, and add it to the item bar ul. */

        let itemNode = $($('#item-bar__item-template').html());
            $(itemNode).find('img').attr('src', item.src);
            $(itemNode).attr('id', item.id);
            $(itemNode).attr('data-item-name', item.name);


        $('.item-bar__items').append(itemNode);
    }
}

}