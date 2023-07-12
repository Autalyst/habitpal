export interface Validator<T> {
    validate(records: T[])
}