import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TopPageDocument = HydratedDocument<TopPage>

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class HhData {
  @Prop()
  count: number

  @Prop([String])
  titles: string[]

  @Prop()
  updatedAt: Date
}

class TopPageAdvantages {
  @Prop()
  title: string

  @Prop()
  description: string
}

@Schema({ timestamps: true })
export class TopPage {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory

  @Prop()
  secondCategory: string

  @Prop({ unique: true })
  alias: string

  @Prop()
  title: string

  @Prop()
  category: string

  @Prop({ type: () => HhData })
  hh?: HhData

  @Prop({ type: () => [TopPageAdvantages] })
  advantages: TopPageAdvantages[]

  @Prop()
  seoText: string

  @Prop()
  tagsTitle: string

  @Prop([String])
  tags: string[]
}

const TopPageSchema = SchemaFactory.createForClass(TopPage)

TopPageSchema.index({ '$**': 'text' })

export { TopPageSchema }
