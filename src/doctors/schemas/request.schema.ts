import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogRequestDocument = LogRequest & Document;

@Schema()
export class LogRequest {
    @Prop()
    name: string;

    @Prop()
    age: number;

    @Prop()
    breed: string;
}

export const RequestSchema = SchemaFactory.createForClass(LogRequest);