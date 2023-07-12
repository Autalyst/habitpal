import { Validator } from "./validator";

export abstract class DAO<T> {
    constructor(
        protected validator: Validator<T>
    ) { }

    new(): T {
        return {} as T;
    }

    abstract findOne(condition): T
    abstract findMany(condition): T[]

    abstract create(record: T): T
    abstract createMany(records: T[]): T[]

    abstract delete(record: T)
    abstract deleteMany(records: T[])
}