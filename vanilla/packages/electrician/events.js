mp.events.add('playerDeath', (player) => {
    player.spawn(player.position);
    player.health = 100;
});