import { EventStream } from "./observable";
import UpdateBarrier from "./internal/updatebarrier";
import { Desc } from "./describe";
import { endEvent, Event, toEvent } from "./event";
import { nop } from "./helpers";
import { EventSink } from "./types";

/**
 Creates an EventStream that delivers the given
 single value for the first subscriber. The stream will end immediately
 after this value. You can also send an [`Bacon.Error`](#bacon-error) event instead of a
 value: `Bacon.once(new Bacon.Error("fail"))`.

 @param   value   the value or event to emit
 @typeparam V Type of stream elements
 */
export default function once<V>(value: V | Event<V>): EventStream<V> {
  const s = new EventStream<V>(new Desc("Bacon", "once", [value]), function(sink: EventSink<V>) {
    UpdateBarrier.soonButNotYet(s, function() {
      sink(toEvent(value));
      sink(endEvent());  
    })
    return nop
  });
  return s
}