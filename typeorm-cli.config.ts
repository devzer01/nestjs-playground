import {DataSource} from "typeorm";
import {CoffeeRefactor1661084668231} from "./src/migrations/1661084668231-CoffeeRefactor";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: [],
    migrations: [CoffeeRefactor1661084668231],
});