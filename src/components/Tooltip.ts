let lastTarget: EventTarget | null = null;

window.addEventListener('pointermove', e => {

    if(e.target !== lastTarget) {
        // remove old tooltip
        lastTarget = null;

        if(e.target && e.target.classList.contains('badge')) {
            // console.log('badge', e.target);
            
            // create tooltip for element and fix it in viewport position
            lastTarget = e.target;
        }

        if(e.target && e.target.classList.contains('emote')) {
            // console.log('emote', e.target);
            
            // create tooltip for element and fix it in viewport position
            lastTarget = e.target;
        }
    }

    
})