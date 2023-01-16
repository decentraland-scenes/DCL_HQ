import utils from '../node_modules/decentraland-ecs-utils/index'
// import { MarketData } from './serverHandler'
// import { invisibleMaterial } from './museumItems'

/////// GET DATA FROM SERVER

export let awsServer = 'https://genesis-plaza.s3.us-east-2.amazonaws.com/'

export type WearableData = {
  activeOrder: { id: string }
  id: string
  name: string
  owner: { address: string }
  contractAddress: string
  tokenId: string
  image: string
  searchOrderPrice: number
  searchOrderStatus: string
  wearable: {
    bodyShapes: string[]
    category: string
    collection: string
    description: string
    name: string
    rarity: string
    representationId: string
  }
}

export type ParcelData = {
  id: string
  name: string
  searchOrderPrice: number
  parcel: { x: number; y: number; tokenId: string }
  owner: { address: string }
}

export type CoinData = {
  MANAETH: number
  ETHUSDT: number
  BTCUSDT: number
  MANAUSD: number
}

export type WearableDataMini = {
  name: string
  price: number
  image: string
  rarity: string
}

export type MarketData = {
  coins: CoinData | null
  landSalesYesterday: number
  landSalesWeek: number
  landSalesMonth: number
  cheapestLandYesterday: number
  cheapestLandWeek: number
  cheapestLandMonth: number
  expensiveLandYesterday: number
  expensiveLandWeek: number
  expensiveLandMonth: number
  expensiveEstateYesterday: number
  expensiveEstateWeek: number
  expensiveEstateMonth: number
  totalMANALandAndEstateYesterday: number
  totalMANALandAndEstateWeek: number
  totalMANALandAndEstateMonth: number
  cheapestLandNow: ParcelData | null
  wearableSalesYesterday: number
  wearableSalesWeek: number
  wearableSalesMonth: number
  expensiveWearableYesterday: number
  expensiveWearableWeek: number
  expensiveWearableMonth: number
  expensiveWearableNameYesterday: string
  expensiveWearableNameWeek: string
  expensiveWearableNameMonth: string
  uncommonWearableMonthSales: number
  uncommonWearableMonthMANA: number
  uncommonWearableMonthExpensive: WearableDataMini | null
  rareWearableMonthSales: number
  rareWearableMonthMANA: number
  rareWearableMonthExpensive: WearableDataMini | null
  epicWearableMonthSales: number
  epicWearableMonthMANA: number
  epicWearableMonthExpensive: WearableDataMini | null
  legendaryWearableMonthSales: number
  legendaryWearableMonthMANA: number
  legendaryWearableMonthExpensive: WearableDataMini | null
  mythicWearableMonthSales: number
  mythicWearableMonthMANA: number
  mythicWearableMonthExpensive: WearableDataMini | null
  totalMANAWearablesYesterday: number
  totalMANAWearablesWeek: number
  totalMANAWearablesMonth: number
  cheapRareNow: WearableData | null
  cheapEpicNow: WearableData | null
  cheapLegendaryNow: WearableData | null
  cheapMythicNow: WearableData | null
}

let marketData: MarketData | null = null

export async function updateMarketData() {
  let newMarketData = await getMarketData()
  if (newMarketData == marketData) {
    return
  } else {
    marketData = newMarketData
  }
  log('MARKET DATA: ', marketData)
  updateTradeCentrer(marketData)
}

export async function getMarketData(): Promise<MarketData> {
  try {
    let url = awsServer + 'market/marketData.json'
    let response = await fetch(url).then()
    let json = await response.json()
    return json
  } catch {
    log('error fetching from AWS server')
  }
}

////// POSITION ALL PANELS

let leftPannel = new Entity()
leftPannel.addComponent(
  new Transform({
    position: new Vector3(43.35, 3, 33.4),
    rotation: Quaternion.Euler(0, 90, 0),
  })
)
engine.addEntity(leftPannel)

let rightPannel = new Entity()
rightPannel.addComponent(
  new Transform({
    position: new Vector3(4.65, 3, 33.4),
    rotation: Quaternion.Euler(0, 270, 0),
  })
)
engine.addEntity(rightPannel)

let milldeLPannel = new Entity()
milldeLPannel.addComponent(
  new Transform({
    position: new Vector3(34, 5, 20.2),
    rotation: Quaternion.Euler(0, -29 + 180, 0),
  })
)
engine.addEntity(milldeLPannel)

let milldeRPannel = new Entity()
milldeRPannel.addComponent(
  new Transform({
    position: new Vector3(14, 5, 20.2),
    rotation: Quaternion.Euler(0, 29 + 180, 0),
  })
)
engine.addEntity(milldeRPannel)

////// UPDATE BOARDS

export enum StockDataTypes {
  BIGTITLE = 'bigtitle',
  BIGVALUE = 'bigvalue',
  TITLE = 'title',
  LABEL = 'label',
  VALUE = 'value',
  UNIT = 'unit',
  TINYVALUE = 'tinyvalue',
  TINYTITLE = 'tinytitle',
}

let SFFont = new Font(Fonts.SanFrancisco)

export class StockData extends Entity {
  constructor(
    type: StockDataTypes,
    text: string,
    transform: TransformConstructorArgs,
    parent: Entity
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new Transform(transform))
    this.setParent(parent)

    let shape = new TextShape(text)

    shape.font = SFFont
    shape.width = 10

    switch (type) {
      case StockDataTypes.BIGTITLE:
        shape.fontSize = 6
        shape.color = Color3.White()
        shape.vTextAlign = 'center'
        break
      case StockDataTypes.BIGVALUE:
        shape.fontSize = 3
        shape.color = Color3.Green()
        shape.vTextAlign = 'center'
        break

      case StockDataTypes.TITLE:
        shape.fontSize = 3
        shape.color = Color3.White()
        shape.vTextAlign = 'center'
        shape.width = 10
        break
      case StockDataTypes.TINYTITLE:
        shape.fontSize = 2
        shape.color = Color3.White()
        shape.vTextAlign = 'center'
        shape.width = 10
        break
      case StockDataTypes.LABEL:
        shape.fontSize = 3
        shape.color = Color3.White()
        shape.vTextAlign = 'left'
        break
      case StockDataTypes.VALUE:
        shape.fontSize = 3
        shape.color = Color3.Green()
        shape.vTextAlign = 'right'
        break
      case StockDataTypes.TINYVALUE:
        shape.fontSize = 2
        shape.color = Color3.Green()
        shape.vTextAlign = 'right'
        break

      case StockDataTypes.UNIT:
        shape.fontSize = 2
        shape.color = Color3.White()
        shape.vTextAlign = 'right'
        break
    }

    this.addComponent(shape)
  }
}

export class WearablePreview extends Entity {
  constructor(
    image: string,
    transform: TransformConstructorArgs,
    parent: Entity
  ) {
    super()
    engine.addEntity(this)

    this.setParent(parent)

    this.addComponent(new Transform(transform))

    this.getComponent(Transform).scale = new Vector3(1.5, 1.5, 1)

    this.getComponent(Transform).rotation = Quaternion.Euler(180, 0, 0)

    let wearableImage = new Texture(image)
    let wearableMaterial = new Material()
    wearableMaterial.roughness = 1
    wearableMaterial.albedoTexture = wearableImage

    this.addComponent(new PlaneShape())
    this.addComponent(wearableMaterial)
  }
}

// To convert values in weis
export function toMana(longNum: number) {
  let shortNum = longNum / 1000000000000000000
  let squaredNum = shortNum * Math.pow(10, 4)
  return Math.round(squaredNum) / Math.pow(10, 4)
}

export function updateTradeCentrer(data: MarketData) {
  //// LOWER FLOOR

  //3
  let lowerPanel3itle = new StockData(
    StockDataTypes.BIGTITLE,
    'MANA Price',
    {
      position: new Vector3(0, 3, 0),
    },
    leftPannel
  )

  let lowerPanel3Value = new StockData(
    StockDataTypes.BIGVALUE,
    data.coins.MANAETH.toString().slice(0, 10) + ' ETH',
    {
      position: new Vector3(0, 2.4, 0),
    },
    leftPannel
  )

  //   //4
  //   let lowerPanel4itle = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     'MANA Price',
  //     {
  //       position: new Vector3(0, 0.4, 0),
  //     },
  //     leftPannel
  //   )

  let lowerPanel4Value = new StockData(
    StockDataTypes.BIGVALUE,
    data.coins.MANAUSD.toString().slice(0, 8) + ' USD',
    {
      position: new Vector3(0, 2, 0),
    },
    leftPannel
  )

  //1
  let lowerPanel1Title = new StockData(
    StockDataTypes.BIGTITLE,
    'BTC Price',
    {
      position: new Vector3(0, 1.3, 0),
    },
    leftPannel
  )

  let lowerPanel1Value = new StockData(
    StockDataTypes.BIGVALUE,
    data.coins.BTCUSDT.toString() + ' USD',
    {
      position: new Vector3(0, 0.7, 0),
    },
    leftPannel
  )

  //2
  let lowerPanel2Title = new StockData(
    StockDataTypes.BIGTITLE,
    'ETH Price',
    {
      position: new Vector3(0, -0.3, 0),
    },
    leftPannel
  )

  let lowerPanel2Value = new StockData(
    StockDataTypes.BIGVALUE,
    data.coins.ETHUSDT.toString() + ' USD',
    {
      position: new Vector3(0, -0.9, 0),
    },
    leftPannel
  )

  //5
  let lowerPanel5itle = new StockData(
    StockDataTypes.TITLE,
    'DCL token transactions',
    {
      position: new Vector3(0, 2.6, 0),
    },
    rightPannel
  )
  let lowerPanel5itle2 = new StockData(
    StockDataTypes.TITLE,
    'last 7 days',
    {
      position: new Vector3(0, 2.2, 0),
    },
    rightPannel
  )

  let totalTokenSalesWeek = data.landSalesWeek + data.wearableSalesWeek

  let lowerPanel5Value = new StockData(
    StockDataTypes.BIGVALUE,
    totalTokenSalesWeek.toString() + ' tokens',
    {
      position: new Vector3(0, 1.8, 0),
    },
    rightPannel
  )

  //6
  let lowerPanel6itle = new StockData(
    StockDataTypes.TITLE,
    'DCL token transactions',
    {
      position: new Vector3(0, 0.5, 0),
    },
    rightPannel
  )
  let lowerPanel6itle2 = new StockData(
    StockDataTypes.TITLE,
    'last 7 days',
    {
      position: new Vector3(0, 0.15, 0),
    },
    rightPannel
  )

  let totalTokenManaWeek =
    (data.totalMANALandAndEstateWeek + data.totalMANAWearablesWeek) *
    data.coins.MANAUSD
  let roundedTotalTokenManaWeek = Math.floor(totalTokenManaWeek * 100) / 100

  let lowerPanel6Value = new StockData(
    StockDataTypes.BIGVALUE,
    roundedTotalTokenManaWeek.toString() + ' USD',
    {
      position: new Vector3(0, -0.3, 0),
    },
    rightPannel
  )

  ///// MID FLOOR (LAND)

  //   //1

  //   let midPanel1Title = new StockData(
  //     StockDataTypes.TITLE,
  //     'Parcel + Estate sales',
  //     {
  //       position: new Vector3(0, 1.5, 0),
  //     },
  //     milldeLPannel
  //   )

  //   let midPanel1Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-0.7, 0.9, 0),
  //     },
  //     milldeLPannel
  //   )
  //   let midPanel1Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-0.7, 0.4, 0),
  //     },
  //     milldeLPannel
  //   )
  //   let midPanel1Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-0.7, -0.1, 0),
  //     },
  //     milldeLPannel
  //   )

  //   let midPanel1Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.landSalesYesterday.toString(),
  //     {
  //       position: new Vector3(0.7, 0.9, 0),
  //     },
  //     milldeLPannel
  //   )

  //   let midPanel1Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.landSalesWeek.toString(),
  //     {
  //       position: new Vector3(0.7, 0.4, 0),
  //     },
  //     milldeLPannel
  //   )

  //   let midPanel1Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.landSalesMonth.toString(),
  //     {
  //       position: new Vector3(0.7, -0.1, 0),
  //     },
  //     milldeLPannel
  //   )

  //   //2

  //   let midPanel2Title = new StockData(
  //     StockDataTypes.TITLE,
  //     'Cheapest Parcel Sold',
  //     {
  //       position: new Vector3(0, 1.5, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-1, 0.9, 0),
  //     },
  //     midShiftPanel2
  //   )
  //   let midPanel2Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-1, 0.4, 0),
  //     },
  //     midShiftPanel2
  //   )
  //   let midPanel2Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-1, -0.1, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.cheapestLandYesterday.toString(),
  //     {
  //       position: new Vector3(0.7, 0.9, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.cheapestLandWeek.toString(),
  //     {
  //       position: new Vector3(0.7, 0.4, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.cheapestLandMonth.toString(),
  //     {
  //       position: new Vector3(0.7, -0.1, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Unit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.9, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.4, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   let midPanel2Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, -0.1, 0),
  //     },
  //     midShiftPanel2
  //   )

  //   //3

  //   let midPanel3Title = new StockData(
  //     StockDataTypes.TITLE,
  //     'Most Expensive Single Parcel',
  //     {
  //       position: new Vector3(0, 1.5, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-1, 0.9, 0),
  //     },
  //     midShiftPanel3
  //   )
  //   let midPanel3Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-1, 0.4, 0),
  //     },
  //     midShiftPanel3
  //   )
  //   let midPanel3Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-1, -0.1, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveLandYesterday.toString(),
  //     {
  //       position: new Vector3(0.7, 0.9, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveLandWeek.toString(),
  //     {
  //       position: new Vector3(0.7, 0.4, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveLandMonth.toString(),
  //     {
  //       position: new Vector3(0.7, -0.1, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Unit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.9, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.4, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   let midPanel3Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, -0.1, 0),
  //     },
  //     midShiftPanel3
  //   )

  //   //4

  //   let midPanel4Title = new StockData(
  //     StockDataTypes.TITLE,
  //     'Most Expensive Estate',
  //     {
  //       position: new Vector3(0, 1.5, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-1, 0.9, 0),
  //     },
  //     midShiftPanel4
  //   )
  //   let midPanel4Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-1, 0.4, 0),
  //     },
  //     midShiftPanel4
  //   )
  //   let midPanel4Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-1, -0.1, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveEstateYesterday.toString(),
  //     {
  //       position: new Vector3(0.7, 0.9, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveEstateWeek.toString(),
  //     {
  //       position: new Vector3(0.7, 0.4, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveEstateMonth.toString(),
  //     {
  //       position: new Vector3(0.7, -0.1, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Unit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.9, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.4, 0),
  //     },
  //     midShiftPanel4
  //   )

  //   let midPanel4Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, -0.1, 0),
  //     },
  //     midShiftPanel4
  //   )
  //   //5

  let midPanel5Title = new StockData(
    StockDataTypes.TITLE,
    'LAND Transactions',
    {
      position: new Vector3(0, 2.4, 0),
    },
    milldeLPannel
  )

  let midPanel5Unit1 = new StockData(
    StockDataTypes.TITLE,
    'in MANA',
    {
      position: new Vector3(0, 1.9, 0),
    },
    milldeLPannel
  )

  let midPanel5Label1 = new StockData(
    StockDataTypes.LABEL,
    'Yesterday',
    {
      position: new Vector3(-1.1, 1.2, 0),
    },
    milldeLPannel
  )
  let midPanel5Label2 = new StockData(
    StockDataTypes.LABEL,
    '7 days',
    {
      position: new Vector3(-1.1, 0, 0),
    },
    milldeLPannel
  )
  let midPanel5Label3 = new StockData(
    StockDataTypes.LABEL,
    '30 days',
    {
      position: new Vector3(-1.1, -1.2, 0),
    },
    milldeLPannel
  )

  let midPanel5Value1 = new StockData(
    StockDataTypes.VALUE,
    Math.floor(data.totalMANALandAndEstateYesterday).toString(),
    {
      position: new Vector3(0.7, 1.2, 0),
    },
    milldeLPannel
  )

  let midPanel5Value2 = new StockData(
    StockDataTypes.VALUE,
    Math.floor(data.totalMANALandAndEstateWeek).toString(),
    {
      position: new Vector3(0.7, 0, 0),
    },
    milldeLPannel
  )

  let midPanel5Value3 = new StockData(
    StockDataTypes.VALUE,
    Math.floor(data.totalMANALandAndEstateMonth).toString(),
    {
      position: new Vector3(0.7, -1.2, 0),
    },
    milldeLPannel
  )

  //   let midPanel5Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0.4, 0),
  //     },
  //     milldeLPannel
  //   )

  //   let midPanel5Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, -0.1, 0),
  //     },
  //     milldeLPannel
  //   )

  //   //6
  //   // link to parcel on market
  //   let linkToParcel = new Entity()
  //   linkToParcel.setParent(midShiftPanel6)
  //   linkToParcel.addComponent(new PlaneShape())
  //   linkToParcel.addComponent(
  //     new Transform({
  //       position: new Vector3(0, 0.5, -0.25),
  //       scale: new Vector3(3, 3, 3),
  //     })
  //   )
  //   linkToParcel.addComponent(invisibleMaterial)
  //   linkToParcel.addComponent(
  //     new OnPointerDown(
  //       (e) => {
  //         let url =
  //           'https://market.decentraland.org/contracts/0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d/tokens/' +
  //           data.cheapestLandNow.parcel.tokenId
  //         openExternalURL(url)
  //       },
  //       {
  //         button: ActionButton.PRIMARY,
  //         hoverText: 'Open in Market',
  //       }
  //     )
  //   )
  //   engine.addEntity(linkToParcel)

  //   let midPane6Title = new StockData(
  //     StockDataTypes.TITLE,
  //     'Cheapest Parcel On Sale',
  //     {
  //       position: new Vector3(0, 1.6, 0),
  //     },
  //     midShiftPanel6
  //   )

  //   let midPane6Title2 = new StockData(
  //     StockDataTypes.TITLE,
  //     'now in the market',
  //     {
  //       position: new Vector3(0, 1.3, 0),
  //     },
  //     midShiftPanel6
  //   )

  //   let midPane6Title3 = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     data.cheapestLandNow.parcel.x.toString() +
  //       ', ' +
  //       data.cheapestLandNow.parcel.y.toString(),
  //     {
  //       position: new Vector3(0, 0.8, 0),
  //     },
  //     midShiftPanel6
  //   )

  //   let cheapParcelPrice = toMana(
  //     data.cheapestLandNow.searchOrderPrice
  //   ).toString()

  //   let midPane6Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     cheapParcelPrice,
  //     {
  //       position: new Vector3(-0.65, 0, 0),
  //     },
  //     midShiftPanel6
  //   )

  //   let midPane6VUnit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0.65, 0, 0),
  //     },
  //     midShiftPanel6
  //   )

  //   let midPane6VLabel1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'owner:',
  //     {
  //       position: new Vector3(-1, -0.4, 0),
  //     },
  //     midShiftPanel6
  //   )

  //   let shortenedOwner =
  //     data.cheapestLandNow.owner.address.slice(0, 5) +
  //     '...' +
  //     data.cheapestLandNow.owner.address.slice(
  //       data.cheapestLandNow.owner.address.length - 4
  //     )

  //   let midPane6Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     shortenedOwner,
  //     {
  //       position: new Vector3(0.5, -0.4, 0),
  //     },
  //     midShiftPanel6
  //   )

  //TODO

  ///// TOP FLOOR (WEARABLES)
  //1

  //   let topPanel1Title = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     'Wearable Sales',
  //     {
  //       position: new Vector3(0, 0.9, 0),
  //     },
  //     milldeRPannel
  //   )

  //   let topPanel1Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-0.7, 0, 0),
  //     },
  //     milldeRPannel
  //   )
  //   let topPanel1Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-0.7, -0.5, 0),
  //     },
  //     milldeRPannel
  //   )
  //   let topPanel1Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-0.7, -1, 0),
  //     },
  //     milldeRPannel
  //   )

  //   let topPanel1Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.wearableSalesYesterday.toString(),
  //     {
  //       position: new Vector3(0.7, 0, 0),
  //     },
  //     milldeRPannel
  //   )

  //   let topPanel1Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.wearableSalesWeek.toString(),
  //     {
  //       position: new Vector3(0.7, -0.5, 0),
  //     },
  //     milldeRPannel
  //   )

  //   let topPanel1Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.wearableSalesMonth.toString(),
  //     {
  //       position: new Vector3(0.7, -1, 0),
  //     },
  //     milldeRPannel
  //   )

  //2

  //   let topPanel2Title = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     'Most Expensive Wearable',
  //     {
  //       position: new Vector3(0.2, 0.9, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-1, 0, 0),
  //     },
  //     topShiftPanel2
  //   )
  //   let topPanel2Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-1, -0.5, 0),
  //     },
  //     topShiftPanel2
  //   )
  //   let topPanel2Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-1, -1, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveWearableYesterday.toString(),
  //     {
  //       position: new Vector3(0.7, 0, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveWearableWeek.toString(),
  //     {
  //       position: new Vector3(0.7, -0.5, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveWearableMonth.toString(),
  //     {
  //       position: new Vector3(0.7, -1, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Unit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, 0, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, -0.5, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   let topPanel2Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.7, -1, 0),
  //     },
  //     topShiftPanel2
  //   )

  //   //3

  //   let topPanel3Title = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     'Most Expensive Wearable',
  //     {
  //       position: new Vector3(0.2, 0.9, 0),
  //     },
  //     topShiftPanel3
  //   )

  //   let topPanel3Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-1.8, 0, 0),
  //     },
  //     topShiftPanel3
  //   )
  //   let topPanel3Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-1.8, -0.5, 0),
  //     },
  //     topShiftPanel3
  //   )
  //   let topPanel3Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-1.8, -1, 0),
  //     },
  //     topShiftPanel3
  //   )

  //   let topPanel3Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveWearableNameYesterday,
  //     {
  //       position: new Vector3(1.2, 0, 0),
  //     },
  //     topShiftPanel3
  //   )

  //   let topPanel3Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveWearableNameWeek,
  //     {
  //       position: new Vector3(1.2, -0.5, 0),
  //     },
  //     topShiftPanel3
  //   )

  //   let topPanel3Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.expensiveWearableNameMonth,
  //     {
  //       position: new Vector3(1.2, -1, 0),
  //     },
  //     topShiftPanel3
  //   )

  //   //4

  //   let topPanel4Title = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     'Wearable Transactions',
  //     {
  //       position: new Vector3(0, 0.9, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Yesterday',
  //     {
  //       position: new Vector3(-1.3, 0, 0),
  //     },
  //     topShiftPanel4
  //   )
  //   let topPanel4Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     '7 days',
  //     {
  //       position: new Vector3(-1.3, -0.5, 0),
  //     },
  //     topShiftPanel4
  //   )
  //   let topPanel4Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     '30 days',
  //     {
  //       position: new Vector3(-1.3, -1, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     Math.floor(data.totalMANAWearablesYesterday).toString(),
  //     {
  //       position: new Vector3(0.7, 0, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     Math.floor(data.totalMANAWearablesWeek).toString(),
  //     {
  //       position: new Vector3(0.7, -0.5, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     Math.floor(data.totalMANAWearablesMonth).toString(),
  //     {
  //       position: new Vector3(0.7, -1, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Unit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(2.2, 0, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(2.2, -0.5, 0),
  //     },
  //     topShiftPanel4
  //   )

  //   let topPanel4Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(2.2, -1, 0),
  //     },
  //     topShiftPanel4
  //   )
  //   //5

  let topPanel5Title = new StockData(
    StockDataTypes.TITLE,
    'Wearable Transactions',
    {
      position: new Vector3(0.2, 2.4, 0),
    },
    milldeRPannel
  )

  let topPanel5Title2 = new StockData(
    StockDataTypes.TITLE,
    'last 30 days',
    {
      position: new Vector3(0.2, 2, 0),
    },
    milldeRPannel
  )

  let topPanel5Label1 = new StockData(
    StockDataTypes.LABEL,
    'Uncommon',
    {
      position: new Vector3(-0.6, 1, 0),
    },
    milldeRPannel
  )
  let topPanel5Label2 = new StockData(
    StockDataTypes.LABEL,
    'Rare',
    {
      position: new Vector3(-0.6, 0.3, 0),
    },
    milldeRPannel
  )
  let topPanel5Label3 = new StockData(
    StockDataTypes.LABEL,
    'Epic',
    {
      position: new Vector3(-0.6, -0.4, 0),
    },
    milldeRPannel
  )

  let topPanel5Label4 = new StockData(
    StockDataTypes.LABEL,
    'Legendary',
    {
      position: new Vector3(-0.6, -1.1, 0),
    },
    milldeRPannel
  )

  let topPanel5Label5 = new StockData(
    StockDataTypes.LABEL,
    'Mythic',
    {
      position: new Vector3(-0.6, -1.8, 0),
    },
    milldeRPannel
  )

  let topPanel5Value1 = new StockData(
    StockDataTypes.VALUE,
    data.uncommonWearableMonthSales.toString(),
    {
      position: new Vector3(1.3, 1, 0),
    },
    milldeRPannel
  )

  let topPanel5Value2 = new StockData(
    StockDataTypes.VALUE,
    data.rareWearableMonthSales.toString(),
    {
      position: new Vector3(1.3, 0.3, 0),
    },
    milldeRPannel
  )

  let topPanel5Value3 = new StockData(
    StockDataTypes.VALUE,
    data.epicWearableMonthSales.toString(),
    {
      position: new Vector3(1.3, -0.4, 0),
    },
    milldeRPannel
  )

  let topPanel5Value4 = new StockData(
    StockDataTypes.VALUE,
    data.legendaryWearableMonthSales.toString(),
    {
      position: new Vector3(1.3, -1.1, 0),
    },
    milldeRPannel
  )

  let topPanel5Value5 = new StockData(
    StockDataTypes.VALUE,
    data.mythicWearableMonthSales.toString(),
    {
      position: new Vector3(1.3, -1.8, 0),
    },
    milldeRPannel
  )

  //   //6

  //   let topPanel6Title = new StockData(
  //     StockDataTypes.BIGTITLE,
  //     'Average Price',
  //     {
  //       position: new Vector3(0, 1.05, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Title2 = new StockData(
  //     StockDataTypes.TITLE,
  //     'last 30 days',
  //     {
  //       position: new Vector3(0, 0.6, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Label1 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Uncommon',
  //     {
  //       position: new Vector3(-1.3, 0.2, 0),
  //     },
  //     topShiftPanel6
  //   )
  //   let topPanel6Label2 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Rare',
  //     {
  //       position: new Vector3(-1.3, -0.3, 0),
  //     },
  //     topShiftPanel6
  //   )
  //   let topPanel6Label3 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Epic',
  //     {
  //       position: new Vector3(-1.3, -0.8, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Label4 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Legendary',
  //     {
  //       position: new Vector3(-1.3, -1.3, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Label5 = new StockData(
  //     StockDataTypes.LABEL,
  //     'Mythic',
  //     {
  //       position: new Vector3(-1.3, -1.8, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let avUncommonPrice =
  //     Math.floor(
  //       (data.uncommonWearableMonthMANA / data.uncommonWearableMonthSales) * 100
  //     ) / 100

  //   let topPanel6Value1 = new StockData(
  //     StockDataTypes.VALUE,
  //     avUncommonPrice.toString(),
  //     {
  //       position: new Vector3(0.7, 0.2, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let avRarePrice =
  //     Math.floor(
  //       (data.rareWearableMonthMANA / data.rareWearableMonthSales) * 100
  //     ) / 100

  //   let topPanel6Value2 = new StockData(
  //     StockDataTypes.VALUE,
  //     avRarePrice.toString(),
  //     {
  //       position: new Vector3(0.7, -0.3, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let avEpicPrice =
  //     Math.floor(
  //       (data.epicWearableMonthMANA / data.epicWearableMonthSales) * 100
  //     ) / 100

  //   let topPanel6Value3 = new StockData(
  //     StockDataTypes.VALUE,
  //     avEpicPrice.toString(),
  //     {
  //       position: new Vector3(0.7, -0.8, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let avLegendaryPrice =
  //     Math.floor(
  //       (data.legendaryWearableMonthMANA / data.legendaryWearableMonthSales) * 100
  //     ) / 100

  //   let topPanel6Value4 = new StockData(
  //     StockDataTypes.VALUE,
  //     avLegendaryPrice.toString(),
  //     {
  //       position: new Vector3(0.7, -1.3, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let avMythicPrice =
  //     Math.floor(
  //       (data.mythicWearableMonthMANA / data.mythicWearableMonthSales) * 100
  //     ) / 100

  //   let topPanel6Value5 = new StockData(
  //     StockDataTypes.VALUE,
  //     avMythicPrice.toString(),
  //     {
  //       position: new Vector3(0.7, -1.8, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Unit1 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.8, 0.2, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Unit2 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.8, -0.3, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Unit3 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.8, -0.8, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Unit4 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.8, -1.3, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   let topPanel6Unit5 = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(1.8, -1.8, 0),
  //     },
  //     topShiftPanel6
  //   )

  //   /////// FLAT SCREENS

  //   // cheap Rare

  //   let cheapRareTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Cheapest Rare Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.2),
  //     },
  //     rareBoard1
  //   )

  //   let cheapRareTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'now in the market',
  //     {
  //       position: new Vector3(0, 3.6, -0.2),
  //     },
  //     rareBoard1
  //   )

  //   let cheapRareTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.cheapRareNow.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.2),
  //     },
  //     rareBoard1
  //   )
  //   cheapRareTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#3AD682'
  //   )

  //   let cheapRarePreview = new WearablePreview(
  //     data.cheapRareNow.image,
  //     {
  //       position: new Vector3(0, 1.5, -0.2),
  //     },
  //     rareBoard1
  //   )

  //   let cheapRareValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     toMana(data.cheapRareNow.searchOrderPrice).toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.2),
  //     },
  //     rareBoard1
  //   )
  //   cheapRareValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#3AD682'
  //   )

  //   let cheapRareUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.2),
  //     },
  //     rareBoard1
  //   )

  //   let cheapRareLabel = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'owner:',
  //     {
  //       position: new Vector3(-0.6, -0.4, -0.2),
  //     },
  //     rareBoard1
  //   )

  //   let shortenedRareOwner =
  //     data.cheapRareNow.owner.address.slice(0, 5) +
  //     '...' +
  //     data.cheapRareNow.owner.address.slice(
  //       data.cheapRareNow.owner.address.length - 4
  //     )

  //   let cheapRareValue = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     shortenedRareOwner,
  //     {
  //       position: new Vector3(0.5, -0.4, -0.2),
  //     },
  //     rareBoard1
  //   )
  //   cheapRareValue.getComponent(TextShape).color = Color3.FromHexString('#3AD682')

  //   cheapRarePreview.addComponent(
  //     new OnPointerDown(
  //       (e) => {
  //         let url =
  //           'https://market.decentraland.org/contracts/' +
  //           data.cheapRareNow.contractAddress +
  //           '/tokens/' +
  //           data.cheapRareNow.tokenId
  //         openExternalURL(url)
  //       },
  //       {
  //         button: ActionButton.PRIMARY,
  //         hoverText: 'Open in Market',
  //       }
  //     )
  //   )

  //   /// expensive rare

  //   let expensiveRareTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Priciest Rare Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.2),
  //     },
  //     rareBoard2
  //   )

  //   let expensiveRareTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'sold in last 30 days',
  //     {
  //       position: new Vector3(0, 3.6, -0.2),
  //     },
  //     rareBoard2
  //   )

  //   let expensiveRareTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.rareWearableMonthExpensive.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.2),
  //     },
  //     rareBoard2
  //   )
  //   expensiveRareTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#3AD682'
  //   )

  //   let expensiveRarePreview = new WearablePreview(
  //     data.rareWearableMonthExpensive.image,
  //     {
  //       position: new Vector3(0, 1.5, -0.2),
  //     },
  //     rareBoard2
  //   )

  //   let expensiveRareValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.rareWearableMonthExpensive.price.toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.2),
  //     },
  //     rareBoard2
  //   )
  //   expensiveRareValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#3AD682'
  //   )

  //   let expensiveRareUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.2),
  //     },
  //     rareBoard2
  //   )

  //   // cheap epic

  //   let cheapEpicTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Cheapest Epic Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.05),
  //     },
  //     epicBoard1
  //   )

  //   let cheapEpicTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'now in the market',
  //     {
  //       position: new Vector3(0, 3.6, -0.05),
  //     },
  //     epicBoard1
  //   )

  //   let cheapEpicTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.cheapEpicNow.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.05),
  //     },
  //     epicBoard1
  //   )
  //   cheapEpicTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#6297F2'
  //   )

  //   let cheapEpicPreview = new WearablePreview(
  //     data.cheapEpicNow.image,
  //     {
  //       position: new Vector3(0, 1.5, 0),
  //     },
  //     epicBoard1
  //   )

  //   let cheapEpicValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     toMana(data.cheapEpicNow.searchOrderPrice).toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.05),
  //     },
  //     epicBoard1
  //   )
  //   cheapEpicValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#6297F2'
  //   )

  //   let cheapEpicUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.05),
  //     },
  //     epicBoard1
  //   )

  //   let cheapEpicLabel = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'owner:',
  //     {
  //       position: new Vector3(-0.6, -0.4, -0.05),
  //     },
  //     epicBoard1
  //   )

  //   let shortenedepicOwner =
  //     data.cheapEpicNow.owner.address.slice(0, 5) +
  //     '...' +
  //     data.cheapEpicNow.owner.address.slice(
  //       data.cheapEpicNow.owner.address.length - 4
  //     )

  //   let cheapEpicValue = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     shortenedepicOwner,
  //     {
  //       position: new Vector3(0.5, -0.4, -0.1),
  //     },
  //     epicBoard1
  //   )
  //   cheapEpicValue.getComponent(TextShape).color = Color3.FromHexString('#6297F2')

  //   cheapEpicPreview.addComponent(
  //     new OnPointerDown(
  //       (e) => {
  //         let url =
  //           'https://market.decentraland.org/contracts/' +
  //           data.cheapEpicNow.contractAddress +
  //           '/tokens/' +
  //           data.cheapEpicNow.tokenId
  //         openExternalURL(url)
  //       },
  //       {
  //         button: ActionButton.PRIMARY,
  //         hoverText: 'Open in Market',
  //       }
  //     )
  //   )

  //   /// expensive epic

  //   let expensiveEpicTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Priciest Epic Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.2),
  //     },
  //     epicBoard2
  //   )

  //   let expensiveEpicTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'sold in last 30 days',
  //     {
  //       position: new Vector3(0, 3.6, -0.2),
  //     },
  //     epicBoard2
  //   )

  //   let expensiveEpicTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.epicWearableMonthExpensive.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.2),
  //     },
  //     epicBoard2
  //   )
  //   expensiveEpicTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#6297F2'
  //   )

  //   let expensiveEpicPreview = new WearablePreview(
  //     data.epicWearableMonthExpensive.image,
  //     {
  //       position: new Vector3(0, 1.5, -0.2),
  //     },
  //     epicBoard2
  //   )

  //   let expensiveEpicValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.epicWearableMonthExpensive.price.toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.2),
  //     },
  //     epicBoard2
  //   )
  //   expensiveEpicValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#6297F2'
  //   )

  //   let expensiveEpicUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.2),
  //     },
  //     epicBoard2
  //   )

  //   // cheap legendary

  //   let cheapLegendaryTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Cheapest Legendary Wearable',
  //     {
  //       position: new Vector3(-0.2, 3.8, 0),
  //     },
  //     legendaryBoard1
  //   )

  //   let cheapLegendaryTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'now in the market',
  //     {
  //       position: new Vector3(-0.2, 3.6, 0),
  //     },
  //     legendaryBoard1
  //   )

  //   let cheapLegendaryTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.cheapLegendaryNow.name,
  //     {
  //       position: new Vector3(-0.2, 2.9, 0),
  //     },
  //     legendaryBoard1
  //   )
  //   cheapLegendaryTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#9E55E2'
  //   )

  //   let cheapLegendaryPreview = new WearablePreview(
  //     data.cheapLegendaryNow.image,
  //     {
  //       position: new Vector3(-0.2, 1.5, 0),
  //     },
  //     legendaryBoard1
  //   )

  //   let cheapLegendaryValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     toMana(data.cheapLegendaryNow.searchOrderPrice).toString(),
  //     {
  //       position: new Vector3(-0.2, 0.4, 0),
  //     },
  //     legendaryBoard1
  //   )
  //   cheapLegendaryValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#9E55E2'
  //   )

  //   let cheapLegendaryUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(-0.2, 0.1, 0),
  //     },
  //     legendaryBoard1
  //   )

  //   let cheapLegendaryLabel = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'owner:',
  //     {
  //       position: new Vector3(-0.8, -0.4, 0),
  //     },
  //     legendaryBoard1
  //   )

  //   let shortenedLegendaryOwner =
  //     data.cheapLegendaryNow.owner.address.slice(0, 5) +
  //     '...' +
  //     data.cheapLegendaryNow.owner.address.slice(
  //       data.cheapLegendaryNow.owner.address.length - 4
  //     )

  //   let cheapLegendaryValue = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     shortenedLegendaryOwner,
  //     {
  //       position: new Vector3(0.3, -0.4, 0),
  //     },
  //     legendaryBoard1
  //   )
  //   cheapLegendaryValue.getComponent(TextShape).color = Color3.FromHexString(
  //     '#9E55E2'
  //   )

  //   cheapLegendaryPreview.addComponent(
  //     new OnPointerDown(
  //       (e) => {
  //         let url =
  //           'https://market.decentraland.org/contracts/' +
  //           data.cheapLegendaryNow.contractAddress +
  //           '/tokens/' +
  //           data.cheapLegendaryNow.tokenId
  //         openExternalURL(url)
  //       },
  //       {
  //         button: ActionButton.PRIMARY,
  //         hoverText: 'Open in Market',
  //       }
  //     )
  //   )

  //   /// expensive legendary

  //   let expensiveLegendaryTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Priciest Legendary Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.2),
  //     },
  //     legendaryBoard2
  //   )

  //   let expensiveLegendaryTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'sold in last 30 days',
  //     {
  //       position: new Vector3(0, 3.6, -0.2),
  //     },
  //     legendaryBoard2
  //   )

  //   let expensiveLegendaryTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.legendaryWearableMonthExpensive.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.2),
  //     },
  //     legendaryBoard2
  //   )
  //   expensiveLegendaryTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#9E55E2'
  //   )

  //   let expensiveLegendaryPreview = new WearablePreview(
  //     data.legendaryWearableMonthExpensive.image,
  //     {
  //       position: new Vector3(0, 1.5, -0.2),
  //     },
  //     legendaryBoard2
  //   )

  //   let expensiveLegendaryValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.legendaryWearableMonthExpensive.price.toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.2),
  //     },
  //     legendaryBoard2
  //   )
  //   expensiveLegendaryValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#9E55E2'
  //   )

  //   let expensiveLegendaryUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.2),
  //     },
  //     legendaryBoard2
  //   )

  //   // cheap mythic

  //   let cheapMythicTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Cheapest Mythic Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.1),
  //     },
  //     mythicBoard1
  //   )

  //   let cheapMythicTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'now in the market',
  //     {
  //       position: new Vector3(0, 3.6, -0.1),
  //     },
  //     mythicBoard1
  //   )

  //   let cheapMythicTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.cheapMythicNow.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.1),
  //     },
  //     mythicBoard1
  //   )
  //   cheapMythicTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#E43EC6'
  //   )

  //   let cheapMythicPreview = new WearablePreview(
  //     data.cheapMythicNow.image,
  //     {
  //       position: new Vector3(0, 1.5, -0.1),
  //     },
  //     mythicBoard1
  //   )

  //   let cheapMythicValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     toMana(data.cheapMythicNow.searchOrderPrice).toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.1),
  //     },
  //     mythicBoard1
  //   )
  //   cheapMythicValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#E43EC6'
  //   )

  //   let cheapMythicUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.1),
  //     },
  //     mythicBoard1
  //   )

  //   let cheapMythicLabel = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'owner:',
  //     {
  //       position: new Vector3(-0.6, -0.4, -0.1),
  //     },
  //     mythicBoard1
  //   )
  //   cheapMythicLabel.getComponent(TextShape).color = Color3.FromHexString(
  //     '#E43EC6'
  //   )

  //   let shortenedMythicOwner =
  //     data.cheapMythicNow.owner.address.slice(0, 5) +
  //     '...' +
  //     data.cheapMythicNow.owner.address.slice(
  //       data.cheapMythicNow.owner.address.length - 4
  //     )

  //   let cheapMythicValue = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     shortenedMythicOwner,
  //     {
  //       position: new Vector3(0.5, -0.4, -0.1),
  //     },
  //     mythicBoard1
  //   )
  //   cheapMythicValue.getComponent(TextShape).color = Color3.FromHexString(
  //     '#E43EC6'
  //   )

  //   cheapMythicPreview.addComponent(
  //     new OnPointerDown(
  //       (e) => {
  //         let url =
  //           'https://market.decentraland.org/contracts/' +
  //           data.cheapMythicNow.contractAddress +
  //           '/tokens/' +
  //           data.cheapMythicNow.tokenId
  //         openExternalURL(url)
  //       },
  //       {
  //         button: ActionButton.PRIMARY,
  //         hoverText: 'Open in Market',
  //       }
  //     )
  //   )

  //   /// expensive mythic

  //   let expensiveMythicTitle = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'Priciest Mythic Wearable',
  //     {
  //       position: new Vector3(0, 3.8, -0.2),
  //     },
  //     mythicBoard2
  //   )

  //   let expensiveMythicTitle2 = new StockData(
  //     StockDataTypes.TINYTITLE,
  //     'sold in last 30 days',
  //     {
  //       position: new Vector3(0, 3.6, -0.2),
  //     },
  //     mythicBoard2
  //   )

  //   let expensiveMythicTitle3 = new StockData(
  //     StockDataTypes.TINYVALUE,
  //     data.mythicWearableMonthExpensive.name,
  //     {
  //       position: new Vector3(0, 2.9, -0.2),
  //     },
  //     mythicBoard2
  //   )
  //   expensiveMythicTitle3.getComponent(TextShape).color = Color3.FromHexString(
  //     '#E43EC6'
  //   )

  //   let expensiveMythicPreview = new WearablePreview(
  //     data.mythicWearableMonthExpensive.image,
  //     {
  //       position: new Vector3(0, 1.5, -0.2),
  //     },
  //     mythicBoard2
  //   )

  //   let expensiveMythicValue1 = new StockData(
  //     StockDataTypes.VALUE,
  //     data.mythicWearableMonthExpensive.price.toString(),
  //     {
  //       position: new Vector3(0, 0.4, -0.2),
  //     },
  //     mythicBoard2
  //   )
  //   expensiveMythicValue1.getComponent(TextShape).color = Color3.FromHexString(
  //     '#E43EC6'
  //   )

  //   let expensiveMythicUnit = new StockData(
  //     StockDataTypes.UNIT,
  //     'MANA',
  //     {
  //       position: new Vector3(0, 0.1, -0.2),
  //     },
  //     mythicBoard2
  //   )

  ////// ROOFTOP MUSIC

  //   const rooftopStation = 'https://edge.singsingmusic.net/MC2.mp3'

  //   const marketMusicStreamEnt = new Entity()
  //   engine.addEntity(marketMusicStreamEnt)

  //   let marketMusicStream = new AudioStream(rooftopStation)
  //   marketMusicStream.playing = false
  //   marketMusicStreamEnt.addComponent(marketMusicStream)

  //   const marketRoofTrigger = new Entity()
  //   marketRoofTrigger.addComponent(
  //     new Transform({ position: new Vector3(272, 29.7, 36) })
  //   )

  //   let marketRoofTriggerBox = new utils.TriggerBoxShape(
  //     new Vector3(60, 6, 69),
  //     Vector3.Zero()
  //   )
  //   marketRoofTrigger.addComponent(
  //     new utils.TriggerComponent(
  //       marketRoofTriggerBox, //shape
  //       0, //layer
  //       0, //triggeredByLayer
  //       null, //onTriggerEnter
  //       null, //onTriggerExit
  //       () => {
  //         marketMusicStream.playing = true
  //       },
  //       () => {
  //         marketMusicStream.playing = false
  //       }, //onCameraExit
  //       false
  //     )
  //   )
  //   engine.addEntity(marketRoofTrigger)
}
