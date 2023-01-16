import { addScreens } from './video'
import { updateMarketData } from './marketData'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

let builiding = new Entity()
builiding.addComponent(
  new Transform({
    position: new Vector3(24, 0, 24),
  })
)
builiding.addComponent(new GLTFShape('models/dcl_hq.glb'))
engine.addEntity(builiding)

let elevator1 = new Entity()
elevator1.addComponent(
  new Transform({
    position: new Vector3(24, 0, 24),
  })
)
elevator1.addComponent(new GLTFShape('models/left_lift.glb'))
engine.addEntity(elevator1)
// elevator1.addComponent(new Animator())
// let el1Up = new AnimationState('Left_Up', { looping: true, speed: 0.5 })
// elevator1.getComponent(Animator).addClip(el1Up)
// el1Up.playing = true

let elevator2 = new Entity()
elevator2.addComponent(
  new Transform({
    position: new Vector3(24, 0, 24),
  })
)
elevator2.addComponent(new GLTFShape('models/right_lift.glb'))
engine.addEntity(elevator2)
// elevator2.addComponent(new Animator())
// let el2Up = new AnimationState('Right_Up', { looping: true })
// elevator2.getComponent(Animator).addClip(el2Up)
// el2Up.playing = true

// twitter
let twitter = new Entity()
twitter.addComponent(
  new Transform({
    position: new Vector3(27.2, 1.3, 25.5),
    rotation: Quaternion.Euler(0, -23, 0),
  })
)
twitter.addComponent(new GLTFShape('models/twitter.glb'))
engine.addEntity(twitter)
twitter.addComponent(
  new OnPointerDown(
    function () {
      openExternalURL('https://twitter.com/decentraland')
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Follow Us!',
    }
  )
)
// discord

let discord = new Entity()
discord.addComponent(
  new Transform({
    position: new Vector3(20.1, 1.3, 25.1),
    rotation: Quaternion.Euler(0, 17, 0),
  })
)
discord.addComponent(new GLTFShape('models/discord.glb'))
engine.addEntity(discord)

discord.addComponent(
  new OnPointerDown(
    function () {
      openExternalURL('https://dcl.gg/discord')
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Join our community!',
    }
  )
)

// youtube

let youtube = new Entity()
youtube.addComponent(
  new Transform({
    position: new Vector3(32.6, 1.3, 24.8),
    rotation: Quaternion.Euler(0, -30, 0),
  })
)
youtube.addComponent(new GLTFShape('models/youtube.glb'))
engine.addEntity(youtube)

youtube.addComponent(
  new OnPointerDown(
    function () {
      openExternalURL(
        'https://www.youtube.com/playlist?list=PLAcRraQmr_GPi-8qgv17ewdGl50OHuOhH'
      )
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: 'Watch more tutorials!',
    }
  )
)

addScreens()

updateMarketData()
