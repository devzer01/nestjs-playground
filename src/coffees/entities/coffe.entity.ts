import {Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Flavor} from "./flavor.entity";

@Index(['brand', 'name'])
@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Index()
    brand: string;

    @Column({ default: 0})
    recommendations: number;

    @JoinTable()
    @ManyToMany(type => Flavor, (flavor) => flavor.coffees, {cascade: true} )
    flavors: Flavor[];
}