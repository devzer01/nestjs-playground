import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { Doctor } from "./entities/doctor.entity";

@EventSubscriber()
export class DoctorSubscriber implements EntitySubscriberInterface<Doctor> {
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Doctor;
    }

    beforeInsert(event: InsertEvent<Doctor>) {
        console.log(`BEFORE USER INSERTED: `, event.entity);
    }
}