import { Desc } from "./describe";
import { EventSink, EventStreamDelay, Sink, Subscribe, Unsub, VoidSink } from "./types";
import { StateF } from "./withstatemachine";
import { Equals } from "./skipduplicates";
import { Accumulator } from "./scan";
import { SpawnerOrObservable } from "./flatmap_";
import { EventSpawner } from "./flatmapevent";
import PropertyDispatcher from "./internal/propertydispatcher";
import Dispatcher from "./internal/dispatcher";
import { Option } from "./optional";
import { Transformer } from "./transform";
import { PredicateOrProperty } from "./predicate";
import { GroupLimiter } from "./groupby";
import { Differ } from "./diff";
/**
Observable is the base class for [EventsStream](EventStream.html) and Property
 @typeparam V   Type of the elements/values in the stream/property
 */
export declare abstract class Observable<V> {
    desc: Desc;
    id: number;
    initialDesc: Desc;
    _name?: string;
    _isObservable: boolean;
    constructor(desc: Desc);
    awaiting(other: Observable<any>): Property<boolean>;
    bufferingThrottle(minimumInterval: number): this;
    combine<V2, R>(right: Observable<V2>, f: (V: any, V2: any) => R): Property<R>;
    abstract concat(right: Observable<V>): Observable<V>;
    debounce(minimumInterval: number): this;
    debounceImmediate(minimumInterval: number): this;
    decode(cases: any): Property<any>;
    delay(delayMs: number): this;
    /** @hidden */
    abstract delayChanges(desc: Desc, f: EventStreamDelay<V>): this;
    deps(): any[];
    diff<V2>(start: V, f: Differ<V, V2>): Property<V2>;
    doAction(f: (V: any) => any): this;
    doEnd(f: Function): this;
    doError(f: Function): this;
    doLog(...args: any[]): this;
    endAsValue(): Observable<{}>;
    endOnError(predicate?: (any: any) => boolean): this;
    errors(): this;
    filter(f: ((V: any) => boolean) | boolean | Property<boolean>): this;
    first(): this;
    firstToPromise(PromiseCtr: any): Promise<V>;
    abstract flatMap<V2>(f: SpawnerOrObservable<V, V2>): Observable<V2>;
    abstract flatMapConcat<V2>(f: SpawnerOrObservable<V, V2>): Observable<V2>;
    abstract flatMapError(f: (any: any) => Observable<V>): Observable<V>;
    abstract flatMapEvent<V2>(f: EventSpawner<V, V2>): Observable<V2>;
    abstract flatMapFirst<V2>(f: SpawnerOrObservable<V, V2>): Observable<V2>;
    abstract flatMapLatest<V2>(f: SpawnerOrObservable<V, V2>): Observable<V2>;
    abstract flatMapWithConcurrencyLimit<V2>(limit: number, f: SpawnerOrObservable<V, V2>): Observable<V2>;
    flatScan<V2>(seed: V2, f: (V2: any, V: any) => Observable<V2>): Property<V2>;
    fold<V2>(seed: V2, f: Accumulator<V, V2>): Property<V2>;
    forEach(f?: Sink<V>): Unsub;
    groupBy(keyF: (T: any) => string, limitF?: GroupLimiter<V>): Observable<Observable<V>>;
    holdWhen(valve: Property<boolean>): EventStream<V>;
    inspect(): string;
    internalDeps(): any[];
    last(): this;
    log(...args: any[]): this;
    abstract map<V2>(f: ((V: any) => V2) | Property<V2> | V2): Observable<V2>;
    mapEnd(f: (() => V) | V): this;
    mapError(f: ((any: any) => V) | V): this;
    name(name: string): this;
    abstract not(): Observable<boolean>;
    onEnd(f?: VoidSink): Unsub;
    onError(f?: Sink<any>): Unsub;
    onValue(f?: Sink<V>): Unsub;
    onValues(f: any): Unsub;
    abstract sampledBy<V2, R>(sampler: Observable<V2>, f: (V: any, V2: any) => R): Observable<R>;
    scan<V2>(seed: V2, f: Accumulator<V, V2>): Property<V2>;
    skip(count: number): this;
    skipDuplicates(isEqual?: Equals<V>): this;
    skipErrors(): this;
    skipUntil(starter: Observable<any>): this;
    skipWhile<V>(f: PredicateOrProperty<V>): this;
    slidingWindow(maxValues: number, minValues?: number): Property<V[]>;
    abstract startWith(seed: V): Observable<V>;
    subscribe(sink?: EventSink<V>): Unsub;
    abstract subscribeInternal(sink: EventSink<V>): Unsub;
    take(count: number): this;
    takeUntil(stopper: Observable<any>): this;
    takeWhile<V>(f: PredicateOrProperty<V>): this;
    throttle(minimumInterval: number): this;
    abstract toEventStream(): EventStream<V>;
    toPromise(PromiseCtr: any): Promise<V>;
    abstract toProperty(): Property<V>;
    toString(): string;
    abstract transform<V2>(transformer: Transformer<V, V2>, desc?: Desc): Observable<V2>;
    withDesc(desc?: Desc): this;
    withDescription(context: any, method: any, ...args: any[]): this;
    abstract withStateMachine<State, Out>(initState: State, f: StateF<V, State, Out>): Observable<Out>;
    zip<V2, Out>(other: Observable<V2>, f: (V: any, V2: any) => Out): EventStream<Out>;
}
/** @hidden */
export interface ObservableConstructor {
    (description: Desc, subscribe: Subscribe<any>): Observable<any>;
}
export declare class Property<V> extends Observable<V> {
    dispatcher: PropertyDispatcher<V, Property<V>>;
    _isProperty: boolean;
    constructor(desc: Desc, subscribe: Subscribe<V>, handler?: EventSink<V>);
    and(other: Property<any>): Property<boolean>;
    /**
     * creates a stream of changes to the Property. The stream *does not* include
     an event for the current value of the Property at the time this method was called.
     */
    changes(): EventStream<V>;
    concat(right: Observable<V>): Property<V>;
    /** @hidden */
    delayChanges(desc: Desc, f: EventStreamDelay<V>): this;
    flatMap<V2>(f: SpawnerOrObservable<V, V2>): Property<V2>;
    flatMapConcat<V2>(f: SpawnerOrObservable<V, V2>): Property<V2>;
    flatMapError(f: (any: any) => Observable<V>): EventStream<V>;
    flatMapEvent<V2>(f: EventSpawner<V, V2>): EventStream<V2>;
    flatMapFirst<V2>(f: SpawnerOrObservable<V, V2>): Property<V2>;
    flatMapLatest<V2>(f: SpawnerOrObservable<V, V2>): Property<V2>;
    flatMapWithConcurrencyLimit<V2>(limit: number, f: SpawnerOrObservable<V, V2>): Property<V2>;
    map<V2>(f: ((V: any) => V2) | Property<V2>): Property<V2>;
    not(): Property<boolean>;
    or(other: Property<any>): Property<boolean>;
    sample(interval: number): EventStream<V>;
    sampledBy<V2, R>(sampler: Observable<V2>, f?: (V: any, V2: any) => R): Observable<R>;
    startWith(seed: V): Property<V>;
    subscribeInternal(sink?: EventSink<V>): Unsub;
    /**
     Creates an EventStream based on this Property. The stream contains also an event for the current
     value of this Property at the time this method was called.
     */
    toEventStream(options?: EventStreamOptions): EventStream<V>;
    toProperty(): Property<V>;
    transform<V2>(transformer: Transformer<V, V2>, desc?: Desc): Property<V2>;
    withStateMachine<State, Out>(initState: State, f: StateF<V, State, Out>): Property<Out>;
}
/** @hidden */
export declare function isProperty<V>(x: any): x is Property<V>;
/** @hidden */
export declare const allowSync: {
    forceAsync: boolean;
};
/** @hidden */
export interface EventStreamOptions {
    forceAsync: boolean;
}
/**
 * EventStream represents a stream of events. It is an Observable object, meaning
 that you can listen to events in the stream using, for instance, the [`onValue`](#stream-onvalue) method
 with a callback. Like this:
 */
export declare class EventStream<V> extends Observable<V> {
    dispatcher: Dispatcher<V, EventStream<V>>;
    _isEventStream: boolean;
    constructor(desc: Desc, subscribe: Subscribe<V>, handler?: EventSink<V>, options?: EventStreamOptions);
    subscribeInternal(sink?: EventSink<V>): Unsub;
    toEventStream(): this;
    transform<V2>(transformer: Transformer<V, V2>, desc?: Desc): EventStream<V2>;
    withStateMachine<State, Out>(initState: State, f: StateF<V, State, Out>): EventStream<Out>;
    map<V2>(f: ((V: any) => V2) | Property<V2> | V2): EventStream<V2>;
    flatMap<V2>(f: SpawnerOrObservable<V, V2>): EventStream<V2>;
    flatMapConcat<V2>(f: SpawnerOrObservable<V, V2>): EventStream<V2>;
    flatMapFirst<V2>(f: SpawnerOrObservable<V, V2>): EventStream<V2>;
    flatMapLatest<V2>(f: SpawnerOrObservable<V, V2>): EventStream<V2>;
    flatMapWithConcurrencyLimit<V2>(limit: number, f: SpawnerOrObservable<V, V2>): EventStream<V2>;
    flatMapError(f: (any: any) => Observable<V>): EventStream<V>;
    flatMapEvent<V2>(f: EventSpawner<V, V2>): EventStream<V2>;
    sampledBy<V2, R>(sampler: Observable<V2>, f?: (V: any, V2: any) => R): Observable<R>;
    startWith(seed: V): EventStream<V>;
    toProperty(...initValue_: (V | Option<V>)[]): Property<V>;
    concat(right: Observable<V>, options?: EventStreamOptions): EventStream<V>;
    merge(other: EventStream<V>): EventStream<V>;
    not(): EventStream<boolean>;
    /** @hidden */
    delayChanges(desc: Desc, f: EventStreamDelay<V>): this;
    bufferWithTime(delay: number): EventStream<V>;
    bufferWithCount(count: number): EventStream<V>;
    bufferWithTimeOrCount(delay?: number, count?: number): EventStream<V>;
}
/** @hidden */
export declare function newEventStream<V>(description: Desc, subscribe: Subscribe<V>): EventStream<V>;
export default Observable;
