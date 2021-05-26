document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50;
    let startPoint = 50
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let leftTimerId
    let rightTimerId
    
    let isJumping = false
    let isGoingLeft = false
    let isGoingRight = false



    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodlerBottomSpace = platforms[0].bottom + 15
        doodler.style.left = doodlerLeftSpace + "px"
        doodler.style.bottom = doodlerBottomSpace + "px"
    }

    class Platform {
        constructor(newPlatbottom) {
            this.bottom = newPlatbottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
        }
    }
    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {

            let platformGap = 600 / platformCount;
            let platformBottom = 50 + i * platformGap

            let platform = new Platform(platformBottom)
            platform.visual.style.bottom = platform.bottom + "px"
            platform.visual.style.left = platform.left + "px"
            grid.appendChild(platform.visual)
            platform.visual.classList.add("platform")

            platforms.push(platform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 0) {
            platforms.forEach(platform => {
                platform.bottom -= 1
                let visual = platform.visual
                visual.style.bottom = platform.bottom + "px"
                if (platform.bottom < 2)
                    visual.style.display = "none"
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + "px"
            if (startPoint > 550) {
                gameOver()
            }
            else if (doodlerBottomSpace > startPoint + 180) {
                fall()
            }
        }, 30);
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 10
            doodler.style.bottom = doodlerBottomSpace + "px"
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            else {
                platforms.forEach(platform => {
                    if (
                        (doodlerBottomSpace >= platform.bottom) &&
                        (doodlerBottomSpace <= platform.bottom + 15) &&
                        (doodlerLeftSpace + 50 >= platform.left) &&
                        (doodlerLeftSpace + 60 <= platform.left + 125) &&
                        (!isJumping)
                    ) {
                        console.log("landed on ", platform)
                        startPoint = doodlerBottomSpace
                        jump()
                    }
                })
            }
        }, 30);
    }

    function gameOver() {
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        document.removeEventListener("keyup", control)
        console.log("game over")
        isGameOver = true

      //  doodler.style.display = "None"
    }

    function control(e) {
        if (e.key == "ArrowLeft") {
            MoveLeft()
        }
        if (e.key == "ArrowRight") {
            MoveRight()
        }
        if (e.key == "ArrowUp") {
            MoveStraight()
        }
    }

    function MoveStraight() {
        isGoingLeft = false
        isGoingRight = false

        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function MoveLeft() {
        isGoingLeft = true
        isGoingRight = false

        clearInterval(rightTimerId)
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace > 5) {
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + "px"
            }
            else {
                MoveRight()
            }
        }, 30);
    }

    function MoveRight() {
        isGoingRight = true
        isGoingLeft = false

        clearInterval(leftTimerId)
        rightTimerId = setInterval(() => {
            if (doodlerLeftSpace < 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + "px"
            }
            else {
                MoveLeft()
            }
        }, 30);
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30);
            jump()

            document.addEventListener("keyup", control)
        }
    }

    start()
})