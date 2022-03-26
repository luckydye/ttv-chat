const Ease = {
    linear: (t: number) => t,
    easeInQuad: (t: number) => t * t,
    easeOutQuad: (t: number) => t * (2 - t),
    easeInOutQuad: (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => (--t) * t * t + 1,
    easeInOutCubic: (t: number) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
}

let scrollToSpeed = 10;  // keep text movement above 100ms/line for readability
let currentAnimation: number = -1;

export default class AnimatedScroll {

    static scrollTo(target: number, root: HTMLElement) {
        clearTimeout(currentAnimation);

        const start = root.scrollTop;
        const dist = target - start;

        let current = start;

        let elapsed = 0;
        let lastTick = Date.now();

        const loop = () => {
            const currentTick = Date.now();
            const deltaTime = (currentTick - lastTick) / (1000 / scrollToSpeed);

            elapsed += deltaTime;
            current = start + (Ease.easeOutCubic(elapsed) * dist);

            lastTick = currentTick;

            root.scrollTo(0, current);

            if(elapsed < 0.85 && Math.abs(target - current) > 3) {
                currentAnimation = setTimeout(loop, 1000 / 60);
            } else {
                root.scrollTo(0, target);
            }
        }
        
        loop();

        return () => {
            clearTimeout(currentAnimation)
        }
    }

}

