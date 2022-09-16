import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogRequest, LogRequestDocument } from "./schemas/request.schema"
import { LogRequestDto } from "./dto/LogRequest.dto"

@Injectable()
export class CatsService {
    constructor(@InjectModel(LogRequest.name) private catModel: Model<LogRequestDocument>) {}

    async create(createCatDto: LogRequestDto): Promise<LogRequest> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }

    async findAll(): Promise<LogRequest[]> {
        return this.catModel.find().exec();
    }
}
