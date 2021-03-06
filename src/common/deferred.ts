export interface IDeferred<T> {
    resolve(result?: T): void;
    reject(err?: any): void;
    then(value: T): Promise<T>
    catch(err: any): Promise<T>
}

export class Deferred<T> implements IDeferred<T> {
    promise: Promise<T>;

    resolve = (result?: T) => { };
    reject = (err?: any) => { };
    then = (value: T) => { throw new Error("Not implemented yet"); };
    catch = (err: any) => { throw new Error("Not implemented yet"); };

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        this.then = this.promise.then.bind(this.promise);
        this.catch = this.promise.catch.bind(this.promise);
    }
}