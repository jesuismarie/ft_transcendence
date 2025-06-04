export interface Equatable<T> {
    equals(value: T, value2: T): boolean;
}