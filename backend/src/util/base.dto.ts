export abstract class BaseDto {
    id: number
    createdAt: Date
    updatedAt: Date

    constructor(baseEntity: BaseDto) {
        this.id = baseEntity.id;
        this.createdAt = baseEntity.createdAt;
        this.updatedAt = baseEntity.updatedAt;
    }
}