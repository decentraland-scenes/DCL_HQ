import utils from '../node_modules/decentraland-ecs-utils/index'

export class VideoScreen extends Entity {
  texture: VideoTexture
  constructor(
    screenPos: TransformConstructorArgs,
    triggerPos: TransformConstructorArgs,
    triggerScale: Vector3,
    streamURL: string
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new PlaneShape())
    this.addComponent(new Transform(screenPos))

    this.addComponent(new Animator())

    this.texture = new VideoTexture(new VideoClip(streamURL))
    this.texture.playing = false
    const mat = new Material()
    mat.albedoTexture = this.texture
    mat.specularIntensity = 0
    mat.roughness = 1
    mat.metallic = 0

    this.addComponent(mat)

    const triggerEntity = new Entity()
    triggerEntity.addComponent(new Transform(triggerPos))

    let triggerBox = new utils.TriggerBoxShape(triggerScale, Vector3.Zero())

    triggerEntity.addComponent(
      new utils.TriggerComponent(
        triggerBox, //shape
        {
          onCameraEnter: () => {
            this.activate()
          },
          
          onCameraExit: () => {
            this.deactivate()
          }, 
        }
      )
    )
    engine.addEntity(triggerEntity)
  }

  public activate(): void {
    this.texture.playing = true
  }
  public deactivate(): void {
    this.texture.playing = false
  }
}

export function addScreens() {
  const upstairs = new VideoScreen(
    {
      position: new Vector3(24, 17.1, 17.8),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(10 * 2, 5.6 * 2, 10 * 2),
    },
    { position: new Vector3(24, 12, 33) },
    new Vector3(40, 8, 32),
    'https://video.dcl.guru/live/dclfoundation/index.m3u8'
  )
  upstairs.texture.loop = true

  const lobby = new VideoScreen(
    {
      position: new Vector3(24, 4.8, 18.3),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(10 * 1.2, 5.6 * 1.2, 10 * 1.2),
    },
    { position: new Vector3(24, 2, 32) },
    new Vector3(20, 4, 20),
    'https://video.dcl.guru/live/dclfoundation/index.m3u8' //'https://theuniverse.club/live/genesisplaza/index.m3u8'
  )
  lobby.texture.loop = true

  const screenOffice1 = new VideoScreen(
    {
      position: new Vector3(24.4, 3.75, 10.45),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(10 * 0.75, 5.6 * 0.75, 10 * 0.75),
    },
    { position: new Vector3(30, 2, 9) },
    new Vector3(8, 4, 8),
    'https://theuniverse.club/live/genesisplaza/index.m3u8'
  )

  const screenOffice2 = new VideoScreen(
    {
      position: new Vector3(23.7, 3.75, 10.45),
      rotation: Quaternion.Euler(0, 270, 0),
      scale: new Vector3(10 * 0.75, 5.6 * 0.75, 10 * 0.75),
    },
    { position: new Vector3(20, 2, 9) },
    new Vector3(8, 4, 8),
    'https://theuniverse.club/live/genesisplaza/index.m3u8'
  )
}
