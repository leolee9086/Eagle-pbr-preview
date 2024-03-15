globalThis[Symbol.for('eventBusTarget')] = globalThis[Symbol.for('eventBusTarget')] || {}
export class EventBus {
    constructor(name) {
        if (globalThis[Symbol.for('eventBusTarget')][name]) {
            this.eventTarget = globalThis[Symbol.for('eventBusTarget')][name]

        } else {
            this.eventTarget =  document.appendChild(document.createComment(name));
            globalThis[Symbol.for('eventBusTarget')][name] = this.eventTarget
        }
    }
    on(type, listener) {
        if (type === "loaded-protyle") {
            console.warn("0.8.8 将移除 loaded-protyle, 请使用 loaded-protyle-static 进行替代");
        }
        this.eventTarget.addEventListener(type, listener);
    }
    once(type, listener) {
        this.eventTarget.addEventListener(type, listener, { once: true });
    }

    off(type, listener) {
        this.eventTarget.removeEventListener(type, listener);
    }

    emit(type, detail) {
        return this.eventTarget.dispatchEvent(new CustomEvent(type, { detail, cancelable: true }));
    }
}