
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, Object: Object_1, console: console_1$1 } = globals;

    // (246:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(246:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (239:0) {#if componentParams}
    function create_if_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(239:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, _loc => _loc.location);
    const querystring = derived(loc, _loc => _loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/lib/components/atoms/+large_round_button.svelte generated by Svelte v3.59.2 */

    const file$5 = "src/lib/components/atoms/+large_round_button.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "button--main cursor-pointer flex justify-center items-center no-select svelte-1u66sjr");
    			add_location(div, file$5, 4, 1, 28);
    			attr_dev(main, "class", "svelte-1u66sjr");
    			add_location(main, file$5, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Large_round_button', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Large_round_button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Large_round_button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Large_round_button",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/lib/components/organisms/+left_panel.svelte generated by Svelte v3.59.2 */

    const file$4 = "src/lib/components/organisms/+left_panel.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "left-panel flex flex-col items-center svelte-gue6yg");
    			add_location(div, file$4, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Left_panel', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Left_panel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Left_panel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Left_panel",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /**
    * (c) Iconify
    *
    * For the full copyright and license information, please view the license.txt
    * files at https://github.com/iconify/iconify
    *
    * Licensed under MIT.
    *
    * @license MIT
    * @version 1.0.8
    */
    const defaultIconDimensions = Object.freeze(
      {
        left: 0,
        top: 0,
        width: 16,
        height: 16
      }
    );
    const defaultIconTransformations = Object.freeze({
      rotate: 0,
      vFlip: false,
      hFlip: false
    });
    const defaultIconProps = Object.freeze({
      ...defaultIconDimensions,
      ...defaultIconTransformations
    });
    const defaultExtendedIconProps = Object.freeze({
      ...defaultIconProps,
      body: "",
      hidden: false
    });

    const defaultIconSizeCustomisations = Object.freeze({
      width: null,
      height: null
    });
    const defaultIconCustomisations = Object.freeze({
      // Dimensions
      ...defaultIconSizeCustomisations,
      // Transformations
      ...defaultIconTransformations
    });

    function rotateFromString(value, defaultValue = 0) {
      const units = value.replace(/^-?[0-9.]*/, "");
      function cleanup(value2) {
        while (value2 < 0) {
          value2 += 4;
        }
        return value2 % 4;
      }
      if (units === "") {
        const num = parseInt(value);
        return isNaN(num) ? 0 : cleanup(num);
      } else if (units !== value) {
        let split = 0;
        switch (units) {
          case "%":
            split = 25;
            break;
          case "deg":
            split = 90;
        }
        if (split) {
          let num = parseFloat(value.slice(0, value.length - units.length));
          if (isNaN(num)) {
            return 0;
          }
          num = num / split;
          return num % 1 === 0 ? cleanup(num) : 0;
        }
      }
      return defaultValue;
    }

    const separator = /[\s,]+/;
    function flipFromString(custom, flip) {
      flip.split(separator).forEach((str) => {
        const value = str.trim();
        switch (value) {
          case "horizontal":
            custom.hFlip = true;
            break;
          case "vertical":
            custom.vFlip = true;
            break;
        }
      });
    }

    const defaultCustomisations = {
        ...defaultIconCustomisations,
        preserveAspectRatio: '',
    };
    /**
     * Get customisations
     */
    function getCustomisations(node) {
        const customisations = {
            ...defaultCustomisations,
        };
        const attr = (key, def) => node.getAttribute(key) || def;
        // Dimensions
        customisations.width = attr('width', null);
        customisations.height = attr('height', null);
        // Rotation
        customisations.rotate = rotateFromString(attr('rotate', ''));
        // Flip
        flipFromString(customisations, attr('flip', ''));
        // SVG attributes
        customisations.preserveAspectRatio = attr('preserveAspectRatio', attr('preserveaspectratio', ''));
        return customisations;
    }
    /**
     * Check if customisations have been updated
     */
    function haveCustomisationsChanged(value1, value2) {
        for (const key in defaultCustomisations) {
            if (value1[key] !== value2[key]) {
                return true;
            }
        }
        return false;
    }

    const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
      const colonSeparated = value.split(":");
      if (value.slice(0, 1) === "@") {
        if (colonSeparated.length < 2 || colonSeparated.length > 3) {
          return null;
        }
        provider = colonSeparated.shift().slice(1);
      }
      if (colonSeparated.length > 3 || !colonSeparated.length) {
        return null;
      }
      if (colonSeparated.length > 1) {
        const name2 = colonSeparated.pop();
        const prefix = colonSeparated.pop();
        const result = {
          // Allow provider without '@': "provider:prefix:name"
          provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
          prefix,
          name: name2
        };
        return validate && !validateIconName(result) ? null : result;
      }
      const name = colonSeparated[0];
      const dashSeparated = name.split("-");
      if (dashSeparated.length > 1) {
        const result = {
          provider,
          prefix: dashSeparated.shift(),
          name: dashSeparated.join("-")
        };
        return validate && !validateIconName(result) ? null : result;
      }
      if (allowSimpleName && provider === "") {
        const result = {
          provider,
          prefix: "",
          name
        };
        return validate && !validateIconName(result, allowSimpleName) ? null : result;
      }
      return null;
    };
    const validateIconName = (icon, allowSimpleName) => {
      if (!icon) {
        return false;
      }
      return !!((icon.provider === "" || icon.provider.match(matchIconName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchIconName)) && icon.name.match(matchIconName));
    };

    function mergeIconTransformations(obj1, obj2) {
      const result = {};
      if (!obj1.hFlip !== !obj2.hFlip) {
        result.hFlip = true;
      }
      if (!obj1.vFlip !== !obj2.vFlip) {
        result.vFlip = true;
      }
      const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
      if (rotate) {
        result.rotate = rotate;
      }
      return result;
    }

    function mergeIconData(parent, child) {
      const result = mergeIconTransformations(parent, child);
      for (const key in defaultExtendedIconProps) {
        if (key in defaultIconTransformations) {
          if (key in parent && !(key in result)) {
            result[key] = defaultIconTransformations[key];
          }
        } else if (key in child) {
          result[key] = child[key];
        } else if (key in parent) {
          result[key] = parent[key];
        }
      }
      return result;
    }

    function getIconsTree(data, names) {
      const icons = data.icons;
      const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
      const resolved = /* @__PURE__ */ Object.create(null);
      function resolve(name) {
        if (icons[name]) {
          return resolved[name] = [];
        }
        if (!(name in resolved)) {
          resolved[name] = null;
          const parent = aliases[name] && aliases[name].parent;
          const value = parent && resolve(parent);
          if (value) {
            resolved[name] = [parent].concat(value);
          }
        }
        return resolved[name];
      }
      (names || Object.keys(icons).concat(Object.keys(aliases))).forEach(resolve);
      return resolved;
    }

    function internalGetIconData(data, name, tree) {
      const icons = data.icons;
      const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
      let currentProps = {};
      function parse(name2) {
        currentProps = mergeIconData(
          icons[name2] || aliases[name2],
          currentProps
        );
      }
      parse(name);
      tree.forEach(parse);
      return mergeIconData(data, currentProps);
    }

    function parseIconSet(data, callback) {
      const names = [];
      if (typeof data !== "object" || typeof data.icons !== "object") {
        return names;
      }
      if (data.not_found instanceof Array) {
        data.not_found.forEach((name) => {
          callback(name, null);
          names.push(name);
        });
      }
      const tree = getIconsTree(data);
      for (const name in tree) {
        const item = tree[name];
        if (item) {
          callback(name, internalGetIconData(data, name, item));
          names.push(name);
        }
      }
      return names;
    }

    const optionalPropertyDefaults = {
      provider: "",
      aliases: {},
      not_found: {},
      ...defaultIconDimensions
    };
    function checkOptionalProps(item, defaults) {
      for (const prop in defaults) {
        if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
          return false;
        }
      }
      return true;
    }
    function quicklyValidateIconSet(obj) {
      if (typeof obj !== "object" || obj === null) {
        return null;
      }
      const data = obj;
      if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
        return null;
      }
      if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
        return null;
      }
      const icons = data.icons;
      for (const name in icons) {
        const icon = icons[name];
        if (!name.match(matchIconName) || typeof icon.body !== "string" || !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )) {
          return null;
        }
      }
      const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
      for (const name in aliases) {
        const icon = aliases[name];
        const parent = icon.parent;
        if (!name.match(matchIconName) || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )) {
          return null;
        }
      }
      return data;
    }

    const dataStorage = /* @__PURE__ */ Object.create(null);
    function newStorage(provider, prefix) {
      return {
        provider,
        prefix,
        icons: /* @__PURE__ */ Object.create(null),
        missing: /* @__PURE__ */ new Set()
      };
    }
    function getStorage(provider, prefix) {
      const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
      return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
    }
    function addIconSet(storage, data) {
      if (!quicklyValidateIconSet(data)) {
        return [];
      }
      return parseIconSet(data, (name, icon) => {
        if (icon) {
          storage.icons[name] = icon;
        } else {
          storage.missing.add(name);
        }
      });
    }
    function addIconToStorage(storage, name, icon) {
      try {
        if (typeof icon.body === "string") {
          storage.icons[name] = { ...icon };
          return true;
        }
      } catch (err) {
      }
      return false;
    }
    function listIcons$1(provider, prefix) {
      let allIcons = [];
      const providers = typeof provider === "string" ? [provider] : Object.keys(dataStorage);
      providers.forEach((provider2) => {
        const prefixes = typeof provider2 === "string" && typeof prefix === "string" ? [prefix] : Object.keys(dataStorage[provider2] || {});
        prefixes.forEach((prefix2) => {
          const storage = getStorage(provider2, prefix2);
          allIcons = allIcons.concat(
            Object.keys(storage.icons).map(
              (name) => (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name
            )
          );
        });
      });
      return allIcons;
    }

    let simpleNames = false;
    function allowSimpleNames(allow) {
      if (typeof allow === "boolean") {
        simpleNames = allow;
      }
      return simpleNames;
    }
    function getIconData(name) {
      const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
      if (icon) {
        const storage = getStorage(icon.provider, icon.prefix);
        const iconName = icon.name;
        return storage.icons[iconName] || (storage.missing.has(iconName) ? null : void 0);
      }
    }
    function addIcon$1(name, data) {
      const icon = stringToIcon(name, true, simpleNames);
      if (!icon) {
        return false;
      }
      const storage = getStorage(icon.provider, icon.prefix);
      return addIconToStorage(storage, icon.name, data);
    }
    function addCollection$1(data, provider) {
      if (typeof data !== "object") {
        return false;
      }
      if (typeof provider !== "string") {
        provider = data.provider || "";
      }
      if (simpleNames && !provider && !data.prefix) {
        let added = false;
        if (quicklyValidateIconSet(data)) {
          data.prefix = "";
          parseIconSet(data, (name, icon) => {
            if (icon && addIcon$1(name, icon)) {
              added = true;
            }
          });
        }
        return added;
      }
      const prefix = data.prefix;
      if (!validateIconName({
        provider,
        prefix,
        name: "a"
      })) {
        return false;
      }
      const storage = getStorage(provider, prefix);
      return !!addIconSet(storage, data);
    }
    function iconExists$1(name) {
      return !!getIconData(name);
    }
    function getIcon$1(name) {
      const result = getIconData(name);
      return result ? {
        ...defaultIconProps,
        ...result
      } : null;
    }

    function sortIcons(icons) {
      const result = {
        loaded: [],
        missing: [],
        pending: []
      };
      const storage = /* @__PURE__ */ Object.create(null);
      icons.sort((a, b) => {
        if (a.provider !== b.provider) {
          return a.provider.localeCompare(b.provider);
        }
        if (a.prefix !== b.prefix) {
          return a.prefix.localeCompare(b.prefix);
        }
        return a.name.localeCompare(b.name);
      });
      let lastIcon = {
        provider: "",
        prefix: "",
        name: ""
      };
      icons.forEach((icon) => {
        if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
          return;
        }
        lastIcon = icon;
        const provider = icon.provider;
        const prefix = icon.prefix;
        const name = icon.name;
        const providerStorage = storage[provider] || (storage[provider] = /* @__PURE__ */ Object.create(null));
        const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
        let list;
        if (name in localStorage.icons) {
          list = result.loaded;
        } else if (prefix === "" || localStorage.missing.has(name)) {
          list = result.missing;
        } else {
          list = result.pending;
        }
        const item = {
          provider,
          prefix,
          name
        };
        list.push(item);
      });
      return result;
    }

    function removeCallback(storages, id) {
      storages.forEach((storage) => {
        const items = storage.loaderCallbacks;
        if (items) {
          storage.loaderCallbacks = items.filter((row) => row.id !== id);
        }
      });
    }
    function updateCallbacks(storage) {
      if (!storage.pendingCallbacksFlag) {
        storage.pendingCallbacksFlag = true;
        setTimeout(() => {
          storage.pendingCallbacksFlag = false;
          const items = storage.loaderCallbacks ? storage.loaderCallbacks.slice(0) : [];
          if (!items.length) {
            return;
          }
          let hasPending = false;
          const provider = storage.provider;
          const prefix = storage.prefix;
          items.forEach((item) => {
            const icons = item.icons;
            const oldLength = icons.pending.length;
            icons.pending = icons.pending.filter((icon) => {
              if (icon.prefix !== prefix) {
                return true;
              }
              const name = icon.name;
              if (storage.icons[name]) {
                icons.loaded.push({
                  provider,
                  prefix,
                  name
                });
              } else if (storage.missing.has(name)) {
                icons.missing.push({
                  provider,
                  prefix,
                  name
                });
              } else {
                hasPending = true;
                return true;
              }
              return false;
            });
            if (icons.pending.length !== oldLength) {
              if (!hasPending) {
                removeCallback([storage], item.id);
              }
              item.callback(
                icons.loaded.slice(0),
                icons.missing.slice(0),
                icons.pending.slice(0),
                item.abort
              );
            }
          });
        });
      }
    }
    let idCounter = 0;
    function storeCallback(callback, icons, pendingSources) {
      const id = idCounter++;
      const abort = removeCallback.bind(null, pendingSources, id);
      if (!icons.pending.length) {
        return abort;
      }
      const item = {
        id,
        icons,
        callback,
        abort
      };
      pendingSources.forEach((storage) => {
        (storage.loaderCallbacks || (storage.loaderCallbacks = [])).push(item);
      });
      return abort;
    }

    const storage = /* @__PURE__ */ Object.create(null);
    function setAPIModule(provider, item) {
      storage[provider] = item;
    }
    function getAPIModule(provider) {
      return storage[provider] || storage[""];
    }

    function listToIcons(list, validate = true, simpleNames = false) {
      const result = [];
      list.forEach((item) => {
        const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames) : item;
        if (icon) {
          result.push(icon);
        }
      });
      return result;
    }

    // src/config.ts
    var defaultConfig = {
      resources: [],
      index: 0,
      timeout: 2e3,
      rotate: 750,
      random: false,
      dataAfterTimeout: false
    };

    // src/query.ts
    function sendQuery(config, payload, query, done) {
      const resourcesCount = config.resources.length;
      const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
      let resources;
      if (config.random) {
        let list = config.resources.slice(0);
        resources = [];
        while (list.length > 1) {
          const nextIndex = Math.floor(Math.random() * list.length);
          resources.push(list[nextIndex]);
          list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
        }
        resources = resources.concat(list);
      } else {
        resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
      }
      const startTime = Date.now();
      let status = "pending";
      let queriesSent = 0;
      let lastError;
      let timer = null;
      let queue = [];
      let doneCallbacks = [];
      if (typeof done === "function") {
        doneCallbacks.push(done);
      }
      function resetTimer() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
      function abort() {
        if (status === "pending") {
          status = "aborted";
        }
        resetTimer();
        queue.forEach((item) => {
          if (item.status === "pending") {
            item.status = "aborted";
          }
        });
        queue = [];
      }
      function subscribe(callback, overwrite) {
        if (overwrite) {
          doneCallbacks = [];
        }
        if (typeof callback === "function") {
          doneCallbacks.push(callback);
        }
      }
      function getQueryStatus() {
        return {
          startTime,
          payload,
          status,
          queriesSent,
          queriesPending: queue.length,
          subscribe,
          abort
        };
      }
      function failQuery() {
        status = "failed";
        doneCallbacks.forEach((callback) => {
          callback(void 0, lastError);
        });
      }
      function clearQueue() {
        queue.forEach((item) => {
          if (item.status === "pending") {
            item.status = "aborted";
          }
        });
        queue = [];
      }
      function moduleResponse(item, response, data) {
        const isError = response !== "success";
        queue = queue.filter((queued) => queued !== item);
        switch (status) {
          case "pending":
            break;
          case "failed":
            if (isError || !config.dataAfterTimeout) {
              return;
            }
            break;
          default:
            return;
        }
        if (response === "abort") {
          lastError = data;
          failQuery();
          return;
        }
        if (isError) {
          lastError = data;
          if (!queue.length) {
            if (!resources.length) {
              failQuery();
            } else {
              execNext();
            }
          }
          return;
        }
        resetTimer();
        clearQueue();
        if (!config.random) {
          const index = config.resources.indexOf(item.resource);
          if (index !== -1 && index !== config.index) {
            config.index = index;
          }
        }
        status = "completed";
        doneCallbacks.forEach((callback) => {
          callback(data);
        });
      }
      function execNext() {
        if (status !== "pending") {
          return;
        }
        resetTimer();
        const resource = resources.shift();
        if (resource === void 0) {
          if (queue.length) {
            timer = setTimeout(() => {
              resetTimer();
              if (status === "pending") {
                clearQueue();
                failQuery();
              }
            }, config.timeout);
            return;
          }
          failQuery();
          return;
        }
        const item = {
          status: "pending",
          resource,
          callback: (status2, data) => {
            moduleResponse(item, status2, data);
          }
        };
        queue.push(item);
        queriesSent++;
        timer = setTimeout(execNext, config.rotate);
        query(resource, payload, item.callback);
      }
      setTimeout(execNext);
      return getQueryStatus;
    }

    // src/index.ts
    function initRedundancy(cfg) {
      const config = {
        ...defaultConfig,
        ...cfg
      };
      let queries = [];
      function cleanup() {
        queries = queries.filter((item) => item().status === "pending");
      }
      function query(payload, queryCallback, doneCallback) {
        const query2 = sendQuery(
          config,
          payload,
          queryCallback,
          (data, error) => {
            cleanup();
            if (doneCallback) {
              doneCallback(data, error);
            }
          }
        );
        queries.push(query2);
        return query2;
      }
      function find(callback) {
        return queries.find((value) => {
          return callback(value);
        }) || null;
      }
      const instance = {
        query,
        find,
        setIndex: (index) => {
          config.index = index;
        },
        getIndex: () => config.index,
        cleanup
      };
      return instance;
    }

    function createAPIConfig(source) {
      let resources;
      if (typeof source.resources === "string") {
        resources = [source.resources];
      } else {
        resources = source.resources;
        if (!(resources instanceof Array) || !resources.length) {
          return null;
        }
      }
      const result = {
        // API hosts
        resources,
        // Root path
        path: source.path || "/",
        // URL length limit
        maxURL: source.maxURL || 500,
        // Timeout before next host is used.
        rotate: source.rotate || 750,
        // Timeout before failing query.
        timeout: source.timeout || 5e3,
        // Randomise default API end point.
        random: source.random === true,
        // Start index
        index: source.index || 0,
        // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
        dataAfterTimeout: source.dataAfterTimeout !== false
      };
      return result;
    }
    const configStorage = /* @__PURE__ */ Object.create(null);
    const fallBackAPISources = [
      "https://api.simplesvg.com",
      "https://api.unisvg.com"
    ];
    const fallBackAPI = [];
    while (fallBackAPISources.length > 0) {
      if (fallBackAPISources.length === 1) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        if (Math.random() > 0.5) {
          fallBackAPI.push(fallBackAPISources.shift());
        } else {
          fallBackAPI.push(fallBackAPISources.pop());
        }
      }
    }
    configStorage[""] = createAPIConfig({
      resources: ["https://api.iconify.design"].concat(fallBackAPI)
    });
    function addAPIProvider$1(provider, customConfig) {
      const config = createAPIConfig(customConfig);
      if (config === null) {
        return false;
      }
      configStorage[provider] = config;
      return true;
    }
    function getAPIConfig(provider) {
      return configStorage[provider];
    }
    function listAPIProviders() {
      return Object.keys(configStorage);
    }

    function emptyCallback$1() {
    }
    const redundancyCache = /* @__PURE__ */ Object.create(null);
    function getRedundancyCache(provider) {
      if (!redundancyCache[provider]) {
        const config = getAPIConfig(provider);
        if (!config) {
          return;
        }
        const redundancy = initRedundancy(config);
        const cachedReundancy = {
          config,
          redundancy
        };
        redundancyCache[provider] = cachedReundancy;
      }
      return redundancyCache[provider];
    }
    function sendAPIQuery(target, query, callback) {
      let redundancy;
      let send;
      if (typeof target === "string") {
        const api = getAPIModule(target);
        if (!api) {
          callback(void 0, 424);
          return emptyCallback$1;
        }
        send = api.send;
        const cached = getRedundancyCache(target);
        if (cached) {
          redundancy = cached.redundancy;
        }
      } else {
        const config = createAPIConfig(target);
        if (config) {
          redundancy = initRedundancy(config);
          const moduleKey = target.resources ? target.resources[0] : "";
          const api = getAPIModule(moduleKey);
          if (api) {
            send = api.send;
          }
        }
      }
      if (!redundancy || !send) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      return redundancy.query(query, send, callback)().abort;
    }

    const browserCacheVersion = "iconify2";
    const browserCachePrefix = "iconify";
    const browserCacheCountKey = browserCachePrefix + "-count";
    const browserCacheVersionKey = browserCachePrefix + "-version";
    const browserStorageHour = 36e5;
    const browserStorageCacheExpiration = 168;

    function getStoredItem(func, key) {
      try {
        return func.getItem(key);
      } catch (err) {
      }
    }
    function setStoredItem(func, key, value) {
      try {
        func.setItem(key, value);
        return true;
      } catch (err) {
      }
    }
    function removeStoredItem(func, key) {
      try {
        func.removeItem(key);
      } catch (err) {
      }
    }

    function setBrowserStorageItemsCount(storage, value) {
      return setStoredItem(storage, browserCacheCountKey, value.toString());
    }
    function getBrowserStorageItemsCount(storage) {
      return parseInt(getStoredItem(storage, browserCacheCountKey)) || 0;
    }

    const browserStorageConfig = {
      local: true,
      session: true
    };
    const browserStorageEmptyItems = {
      local: /* @__PURE__ */ new Set(),
      session: /* @__PURE__ */ new Set()
    };
    let browserStorageStatus = false;
    function setBrowserStorageStatus(status) {
      browserStorageStatus = status;
    }

    let _window = typeof window === "undefined" ? {} : window;
    function getBrowserStorage(key) {
      const attr = key + "Storage";
      try {
        if (_window && _window[attr] && typeof _window[attr].length === "number") {
          return _window[attr];
        }
      } catch (err) {
      }
      browserStorageConfig[key] = false;
    }

    function iterateBrowserStorage(key, callback) {
      const func = getBrowserStorage(key);
      if (!func) {
        return;
      }
      const version = getStoredItem(func, browserCacheVersionKey);
      if (version !== browserCacheVersion) {
        if (version) {
          const total2 = getBrowserStorageItemsCount(func);
          for (let i = 0; i < total2; i++) {
            removeStoredItem(func, browserCachePrefix + i.toString());
          }
        }
        setStoredItem(func, browserCacheVersionKey, browserCacheVersion);
        setBrowserStorageItemsCount(func, 0);
        return;
      }
      const minTime = Math.floor(Date.now() / browserStorageHour) - browserStorageCacheExpiration;
      const parseItem = (index) => {
        const name = browserCachePrefix + index.toString();
        const item = getStoredItem(func, name);
        if (typeof item !== "string") {
          return;
        }
        try {
          const data = JSON.parse(item);
          if (typeof data === "object" && typeof data.cached === "number" && data.cached > minTime && typeof data.provider === "string" && typeof data.data === "object" && typeof data.data.prefix === "string" && // Valid item: run callback
          callback(data, index)) {
            return true;
          }
        } catch (err) {
        }
        removeStoredItem(func, name);
      };
      let total = getBrowserStorageItemsCount(func);
      for (let i = total - 1; i >= 0; i--) {
        if (!parseItem(i)) {
          if (i === total - 1) {
            total--;
            setBrowserStorageItemsCount(func, total);
          } else {
            browserStorageEmptyItems[key].add(i);
          }
        }
      }
    }

    function initBrowserStorage() {
      if (browserStorageStatus) {
        return;
      }
      setBrowserStorageStatus(true);
      for (const key in browserStorageConfig) {
        iterateBrowserStorage(key, (item) => {
          const iconSet = item.data;
          const provider = item.provider;
          const prefix = iconSet.prefix;
          const storage = getStorage(
            provider,
            prefix
          );
          if (!addIconSet(storage, iconSet).length) {
            return false;
          }
          const lastModified = iconSet.lastModified || -1;
          storage.lastModifiedCached = storage.lastModifiedCached ? Math.min(storage.lastModifiedCached, lastModified) : lastModified;
          return true;
        });
      }
    }

    function updateLastModified(storage, lastModified) {
      const lastValue = storage.lastModifiedCached;
      if (
        // Matches or newer
        lastValue && lastValue >= lastModified
      ) {
        return lastValue === lastModified;
      }
      storage.lastModifiedCached = lastModified;
      if (lastValue) {
        for (const key in browserStorageConfig) {
          iterateBrowserStorage(key, (item) => {
            const iconSet = item.data;
            return item.provider !== storage.provider || iconSet.prefix !== storage.prefix || iconSet.lastModified === lastModified;
          });
        }
      }
      return true;
    }
    function storeInBrowserStorage(storage, data) {
      if (!browserStorageStatus) {
        initBrowserStorage();
      }
      function store(key) {
        let func;
        if (!browserStorageConfig[key] || !(func = getBrowserStorage(key))) {
          return;
        }
        const set = browserStorageEmptyItems[key];
        let index;
        if (set.size) {
          set.delete(index = Array.from(set).shift());
        } else {
          index = getBrowserStorageItemsCount(func);
          if (!setBrowserStorageItemsCount(func, index + 1)) {
            return;
          }
        }
        const item = {
          cached: Math.floor(Date.now() / browserStorageHour),
          provider: storage.provider,
          data
        };
        return setStoredItem(
          func,
          browserCachePrefix + index.toString(),
          JSON.stringify(item)
        );
      }
      if (data.lastModified && !updateLastModified(storage, data.lastModified)) {
        return;
      }
      if (!Object.keys(data.icons).length) {
        return;
      }
      if (data.not_found) {
        data = Object.assign({}, data);
        delete data.not_found;
      }
      if (!store("local")) {
        store("session");
      }
    }

    function emptyCallback() {
    }
    function loadedNewIcons(storage) {
      if (!storage.iconsLoaderFlag) {
        storage.iconsLoaderFlag = true;
        setTimeout(() => {
          storage.iconsLoaderFlag = false;
          updateCallbacks(storage);
        });
      }
    }
    function loadNewIcons(storage, icons) {
      if (!storage.iconsToLoad) {
        storage.iconsToLoad = icons;
      } else {
        storage.iconsToLoad = storage.iconsToLoad.concat(icons).sort();
      }
      if (!storage.iconsQueueFlag) {
        storage.iconsQueueFlag = true;
        setTimeout(() => {
          storage.iconsQueueFlag = false;
          const { provider, prefix } = storage;
          const icons2 = storage.iconsToLoad;
          delete storage.iconsToLoad;
          let api;
          if (!icons2 || !(api = getAPIModule(provider))) {
            return;
          }
          const params = api.prepare(provider, prefix, icons2);
          params.forEach((item) => {
            sendAPIQuery(provider, item, (data) => {
              if (typeof data !== "object") {
                item.icons.forEach((name) => {
                  storage.missing.add(name);
                });
              } else {
                try {
                  const parsed = addIconSet(
                    storage,
                    data
                  );
                  if (!parsed.length) {
                    return;
                  }
                  const pending = storage.pendingIcons;
                  if (pending) {
                    parsed.forEach((name) => {
                      pending.delete(name);
                    });
                  }
                  storeInBrowserStorage(storage, data);
                } catch (err) {
                  console.error(err);
                }
              }
              loadedNewIcons(storage);
            });
          });
        });
      }
    }
    const loadIcons$1 = (icons, callback) => {
      const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
      const sortedIcons = sortIcons(cleanedIcons);
      if (!sortedIcons.pending.length) {
        let callCallback = true;
        if (callback) {
          setTimeout(() => {
            if (callCallback) {
              callback(
                sortedIcons.loaded,
                sortedIcons.missing,
                sortedIcons.pending,
                emptyCallback
              );
            }
          });
        }
        return () => {
          callCallback = false;
        };
      }
      const newIcons = /* @__PURE__ */ Object.create(null);
      const sources = [];
      let lastProvider, lastPrefix;
      sortedIcons.pending.forEach((icon) => {
        const { provider, prefix } = icon;
        if (prefix === lastPrefix && provider === lastProvider) {
          return;
        }
        lastProvider = provider;
        lastPrefix = prefix;
        sources.push(getStorage(provider, prefix));
        const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
        if (!providerNewIcons[prefix]) {
          providerNewIcons[prefix] = [];
        }
      });
      sortedIcons.pending.forEach((icon) => {
        const { provider, prefix, name } = icon;
        const storage = getStorage(provider, prefix);
        const pendingQueue = storage.pendingIcons || (storage.pendingIcons = /* @__PURE__ */ new Set());
        if (!pendingQueue.has(name)) {
          pendingQueue.add(name);
          newIcons[provider][prefix].push(name);
        }
      });
      sources.forEach((storage) => {
        const { provider, prefix } = storage;
        if (newIcons[provider][prefix].length) {
          loadNewIcons(storage, newIcons[provider][prefix]);
        }
      });
      return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
    };
    const loadIcon$1 = (icon) => {
      return new Promise((fulfill, reject) => {
        const iconObj = typeof icon === "string" ? stringToIcon(icon, true) : icon;
        if (!iconObj) {
          reject(icon);
          return;
        }
        loadIcons$1([iconObj || icon], (loaded) => {
          if (loaded.length && iconObj) {
            const data = getIconData(iconObj);
            if (data) {
              fulfill({
                ...defaultIconProps,
                ...data
              });
              return;
            }
          }
          reject(icon);
        });
      });
    };

    /**
     * Test icon string
     */
    function testIconObject(value) {
        try {
            const obj = typeof value === 'string' ? JSON.parse(value) : value;
            if (typeof obj.body === 'string') {
                return {
                    ...obj,
                };
            }
        }
        catch (err) {
            //
        }
    }

    /**
     * Parse icon value, load if needed
     */
    function parseIconValue(value, onload) {
        // Check if icon name is valid
        const name = typeof value === 'string' ? stringToIcon(value, true, true) : null;
        if (!name) {
            // Test for serialised object
            const data = testIconObject(value);
            return {
                value,
                data,
            };
        }
        // Valid icon name: check if data is available
        const data = getIconData(name);
        // Icon data exists or icon has no prefix. Do not load icon from API if icon has no prefix
        if (data !== void 0 || !name.prefix) {
            return {
                value,
                name,
                data, // could be 'null' -> icon is missing
            };
        }
        // Load icon
        const loading = loadIcons$1([name], () => onload(value, name, getIconData(name)));
        return {
            value,
            name,
            loading,
        };
    }

    /**
     * Check for inline
     */
    function getInline(node) {
        return node.hasAttribute('inline');
    }

    // Check for Safari
    let isBuggedSafari = false;
    try {
        isBuggedSafari = navigator.vendor.indexOf('Apple') === 0;
    }
    catch (err) {
        //
    }
    /**
     * Get render mode
     */
    function getRenderMode(body, mode) {
        switch (mode) {
            // Force mode
            case 'svg':
            case 'bg':
            case 'mask':
                return mode;
        }
        // Check for animation, use 'style' for animated icons, unless browser is Safari
        // (only <a>, which should be ignored or animations start with '<a')
        if (mode !== 'style' &&
            (isBuggedSafari || body.indexOf('<a') === -1)) {
            // Render <svg>
            return 'svg';
        }
        // Use background or mask
        return body.indexOf('currentColor') === -1 ? 'bg' : 'mask';
    }

    const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
    const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
    function calculateSize$1(size, ratio, precision) {
      if (ratio === 1) {
        return size;
      }
      precision = precision || 100;
      if (typeof size === "number") {
        return Math.ceil(size * ratio * precision) / precision;
      }
      if (typeof size !== "string") {
        return size;
      }
      const oldParts = size.split(unitsSplit);
      if (oldParts === null || !oldParts.length) {
        return size;
      }
      const newParts = [];
      let code = oldParts.shift();
      let isNumber = unitsTest.test(code);
      while (true) {
        if (isNumber) {
          const num = parseFloat(code);
          if (isNaN(num)) {
            newParts.push(code);
          } else {
            newParts.push(Math.ceil(num * ratio * precision) / precision);
          }
        } else {
          newParts.push(code);
        }
        code = oldParts.shift();
        if (code === void 0) {
          return newParts.join("");
        }
        isNumber = !isNumber;
      }
    }

    const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
    function iconToSVG(icon, customisations) {
      const fullIcon = {
        ...defaultIconProps,
        ...icon
      };
      const fullCustomisations = {
        ...defaultIconCustomisations,
        ...customisations
      };
      const box = {
        left: fullIcon.left,
        top: fullIcon.top,
        width: fullIcon.width,
        height: fullIcon.height
      };
      let body = fullIcon.body;
      [fullIcon, fullCustomisations].forEach((props) => {
        const transformations = [];
        const hFlip = props.hFlip;
        const vFlip = props.vFlip;
        let rotation = props.rotate;
        if (hFlip) {
          if (vFlip) {
            rotation += 2;
          } else {
            transformations.push(
              "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
            );
            transformations.push("scale(-1 1)");
            box.top = box.left = 0;
          }
        } else if (vFlip) {
          transformations.push(
            "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
          );
          transformations.push("scale(1 -1)");
          box.top = box.left = 0;
        }
        let tempValue;
        if (rotation < 0) {
          rotation -= Math.floor(rotation / 4) * 4;
        }
        rotation = rotation % 4;
        switch (rotation) {
          case 1:
            tempValue = box.height / 2 + box.top;
            transformations.unshift(
              "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
            );
            break;
          case 2:
            transformations.unshift(
              "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
            );
            break;
          case 3:
            tempValue = box.width / 2 + box.left;
            transformations.unshift(
              "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
            );
            break;
        }
        if (rotation % 2 === 1) {
          if (box.left !== box.top) {
            tempValue = box.left;
            box.left = box.top;
            box.top = tempValue;
          }
          if (box.width !== box.height) {
            tempValue = box.width;
            box.width = box.height;
            box.height = tempValue;
          }
        }
        if (transformations.length) {
          body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
        }
      });
      const customisationsWidth = fullCustomisations.width;
      const customisationsHeight = fullCustomisations.height;
      const boxWidth = box.width;
      const boxHeight = box.height;
      let width;
      let height;
      if (customisationsWidth === null) {
        height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
        width = calculateSize$1(height, boxWidth / boxHeight);
      } else {
        width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
        height = customisationsHeight === null ? calculateSize$1(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      }
      const attributes = {};
      const setAttr = (prop, value) => {
        if (!isUnsetKeyword(value)) {
          attributes[prop] = value.toString();
        }
      };
      setAttr("width", width);
      setAttr("height", height);
      attributes.viewBox = box.left.toString() + " " + box.top.toString() + " " + boxWidth.toString() + " " + boxHeight.toString();
      return {
        attributes,
        body
      };
    }

    const detectFetch = () => {
      let callback;
      try {
        callback = fetch;
        if (typeof callback === "function") {
          return callback;
        }
      } catch (err) {
      }
    };
    let fetchModule = detectFetch();
    function setFetch(fetch2) {
      fetchModule = fetch2;
    }
    function getFetch() {
      return fetchModule;
    }
    function calculateMaxLength(provider, prefix) {
      const config = getAPIConfig(provider);
      if (!config) {
        return 0;
      }
      let result;
      if (!config.maxURL) {
        result = 0;
      } else {
        let maxHostLength = 0;
        config.resources.forEach((item) => {
          const host = item;
          maxHostLength = Math.max(maxHostLength, host.length);
        });
        const url = prefix + ".json?icons=";
        result = config.maxURL - maxHostLength - config.path.length - url.length;
      }
      return result;
    }
    function shouldAbort(status) {
      return status === 404;
    }
    const prepare = (provider, prefix, icons) => {
      const results = [];
      const maxLength = calculateMaxLength(provider, prefix);
      const type = "icons";
      let item = {
        type,
        provider,
        prefix,
        icons: []
      };
      let length = 0;
      icons.forEach((name, index) => {
        length += name.length + 1;
        if (length >= maxLength && index > 0) {
          results.push(item);
          item = {
            type,
            provider,
            prefix,
            icons: []
          };
          length = name.length;
        }
        item.icons.push(name);
      });
      results.push(item);
      return results;
    };
    function getPath(provider) {
      if (typeof provider === "string") {
        const config = getAPIConfig(provider);
        if (config) {
          return config.path;
        }
      }
      return "/";
    }
    const send = (host, params, callback) => {
      if (!fetchModule) {
        callback("abort", 424);
        return;
      }
      let path = getPath(params.provider);
      switch (params.type) {
        case "icons": {
          const prefix = params.prefix;
          const icons = params.icons;
          const iconsList = icons.join(",");
          const urlParams = new URLSearchParams({
            icons: iconsList
          });
          path += prefix + ".json?" + urlParams.toString();
          break;
        }
        case "custom": {
          const uri = params.uri;
          path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
          break;
        }
        default:
          callback("abort", 400);
          return;
      }
      let defaultError = 503;
      fetchModule(host + path).then((response) => {
        const status = response.status;
        if (status !== 200) {
          setTimeout(() => {
            callback(shouldAbort(status) ? "abort" : "next", status);
          });
          return;
        }
        defaultError = 501;
        return response.json();
      }).then((data) => {
        if (typeof data !== "object" || data === null) {
          setTimeout(() => {
            if (data === 404) {
              callback("abort", data);
            } else {
              callback("next", defaultError);
            }
          });
          return;
        }
        setTimeout(() => {
          callback("success", data);
        });
      }).catch(() => {
        callback("next", defaultError);
      });
    };
    const fetchAPIModule = {
      prepare,
      send
    };

    function toggleBrowserCache(storage, value) {
      switch (storage) {
        case "local":
        case "session":
          browserStorageConfig[storage] = value;
          break;
        case "all":
          for (const key in browserStorageConfig) {
            browserStorageConfig[key] = value;
          }
          break;
      }
    }

    /**
     * Attribute to add
     */
    const nodeAttr = 'data-style';
    /**
     * Custom style to add to each node
     */
    let customStyle = '';
    /**
     * Set custom style to add to all components
     *
     * Affects only components rendered after function call
     */
    function appendCustomStyle(style) {
        customStyle = style;
    }
    /**
     * Add/update style node
     */
    function updateStyle(parent, inline) {
        // Get node, create if needed
        let styleNode = Array.from(parent.childNodes).find((node) => node.hasAttribute &&
            node.hasAttribute(nodeAttr));
        if (!styleNode) {
            styleNode = document.createElement('style');
            styleNode.setAttribute(nodeAttr, nodeAttr);
            parent.appendChild(styleNode);
        }
        // Update content
        styleNode.textContent =
            ':host{display:inline-block;vertical-align:' +
                (inline ? '-0.125em' : '0') +
                '}span,svg{display:block}' +
                customStyle;
    }

    // Core
    /**
     * Get functions and initialise stuff
     */
    function exportFunctions() {
        /**
         * Initialise stuff
         */
        // Set API module
        setAPIModule('', fetchAPIModule);
        // Allow simple icon names
        allowSimpleNames(true);
        let _window;
        try {
            _window = window;
        }
        catch (err) {
            //
        }
        if (_window) {
            // Set cache and load existing cache
            initBrowserStorage();
            // Load icons from global "IconifyPreload"
            if (_window.IconifyPreload !== void 0) {
                const preload = _window.IconifyPreload;
                const err = 'Invalid IconifyPreload syntax.';
                if (typeof preload === 'object' && preload !== null) {
                    (preload instanceof Array ? preload : [preload]).forEach((item) => {
                        try {
                            if (
                            // Check if item is an object and not null/array
                            typeof item !== 'object' ||
                                item === null ||
                                item instanceof Array ||
                                // Check for 'icons' and 'prefix'
                                typeof item.icons !== 'object' ||
                                typeof item.prefix !== 'string' ||
                                // Add icon set
                                !addCollection$1(item)) {
                                console.error(err);
                            }
                        }
                        catch (e) {
                            console.error(err);
                        }
                    });
                }
            }
            // Set API from global "IconifyProviders"
            if (_window.IconifyProviders !== void 0) {
                const providers = _window.IconifyProviders;
                if (typeof providers === 'object' && providers !== null) {
                    for (const key in providers) {
                        const err = 'IconifyProviders[' + key + '] is invalid.';
                        try {
                            const value = providers[key];
                            if (typeof value !== 'object' ||
                                !value ||
                                value.resources === void 0) {
                                continue;
                            }
                            if (!addAPIProvider$1(key, value)) {
                                console.error(err);
                            }
                        }
                        catch (e) {
                            console.error(err);
                        }
                    }
                }
            }
        }
        const _api = {
            getAPIConfig,
            setAPIModule,
            sendAPIQuery,
            setFetch,
            getFetch,
            listAPIProviders,
        };
        return {
            enableCache: (storage) => toggleBrowserCache(storage, true),
            disableCache: (storage) => toggleBrowserCache(storage, false),
            iconExists: iconExists$1,
            getIcon: getIcon$1,
            listIcons: listIcons$1,
            addIcon: addIcon$1,
            addCollection: addCollection$1,
            calculateSize: calculateSize$1,
            buildIcon: iconToSVG,
            loadIcons: loadIcons$1,
            loadIcon: loadIcon$1,
            addAPIProvider: addAPIProvider$1,
            appendCustomStyle,
            _api,
        };
    }

    function iconToHTML(body, attributes) {
      let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
      for (const attr in attributes) {
        renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
      }
      return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
    }

    function encodeSVGforURL(svg) {
      return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
    }
    function svgToData(svg) {
      return "data:image/svg+xml," + encodeSVGforURL(svg);
    }
    function svgToURL(svg) {
      return 'url("' + svgToData(svg) + '")';
    }

    // List of properties to apply
    const monotoneProps = {
        'background-color': 'currentColor',
    };
    const coloredProps = {
        'background-color': 'transparent',
    };
    // Dynamically add common props to variables above
    const propsToAdd = {
        image: 'var(--svg)',
        repeat: 'no-repeat',
        size: '100% 100%',
    };
    const propsToAddTo = {
        '-webkit-mask': monotoneProps,
        'mask': monotoneProps,
        'background': coloredProps,
    };
    for (const prefix in propsToAddTo) {
        const list = propsToAddTo[prefix];
        for (const prop in propsToAdd) {
            list[prefix + '-' + prop] = propsToAdd[prop];
        }
    }
    /**
     * Fix size: add 'px' to numbers
     */
    function fixSize(value) {
        return value ? value + (value.match(/^[-0-9.]+$/) ? 'px' : '') : 'inherit';
    }
    /**
     * Render node as <span>
     */
    function renderSPAN(data, icon, useMask) {
        const node = document.createElement('span');
        // Body
        let body = data.body;
        if (body.indexOf('<a') !== -1) {
            // Animated SVG: add something to fix timing bug
            body += '<!-- ' + Date.now() + ' -->';
        }
        // Generate SVG as URL
        const renderAttribs = data.attributes;
        const html = iconToHTML(body, {
            ...renderAttribs,
            width: icon.width + '',
            height: icon.height + '',
        });
        const url = svgToURL(html);
        // Generate style
        const svgStyle = node.style;
        const styles = {
            '--svg': url,
            'width': fixSize(renderAttribs.width),
            'height': fixSize(renderAttribs.height),
            ...(useMask ? monotoneProps : coloredProps),
        };
        // Apply style
        for (const prop in styles) {
            svgStyle.setProperty(prop, styles[prop]);
        }
        return node;
    }

    let policy;
    function createPolicy() {
      try {
        policy = window.trustedTypes.createPolicy("iconify", {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          createHTML: (s) => s
        });
      } catch (err) {
        policy = null;
      }
    }
    function cleanUpInnerHTML(html) {
      if (policy === void 0) {
        createPolicy();
      }
      return policy ? policy.createHTML(html) : html;
    }

    /**
     * Render node as <svg>
     */
    function renderSVG(data) {
        const node = document.createElement('span');
        // Add style if needed
        const attr = data.attributes;
        let style = '';
        if (!attr.width) {
            style = 'width: inherit;';
        }
        if (!attr.height) {
            style += 'height: inherit;';
        }
        if (style) {
            attr.style = style;
        }
        // Generate SVG
        const html = iconToHTML(data.body, attr);
        node.innerHTML = cleanUpInnerHTML(html);
        return node.firstChild;
    }

    /**
     * Render icon
     */
    function renderIcon(parent, state) {
        const iconData = state.icon.data;
        const customisations = state.customisations;
        // Render icon
        const renderData = iconToSVG(iconData, customisations);
        if (customisations.preserveAspectRatio) {
            renderData.attributes['preserveAspectRatio'] =
                customisations.preserveAspectRatio;
        }
        const mode = state.renderedMode;
        let node;
        switch (mode) {
            case 'svg':
                node = renderSVG(renderData);
                break;
            default:
                node = renderSPAN(renderData, {
                    ...defaultIconProps,
                    ...iconData,
                }, mode === 'mask');
        }
        // Set element
        const oldNode = Array.from(parent.childNodes).find((node) => {
            const tag = node.tagName &&
                node.tagName.toUpperCase();
            return tag === 'SPAN' || tag === 'SVG';
        });
        if (oldNode) {
            // Replace old element
            if (node.tagName === 'SPAN' && oldNode.tagName === node.tagName) {
                // Swap style instead of whole node
                oldNode.setAttribute('style', node.getAttribute('style'));
            }
            else {
                parent.replaceChild(node, oldNode);
            }
        }
        else {
            // Add new element
            parent.appendChild(node);
        }
    }

    /**
     * Set state to PendingState
     */
    function setPendingState(icon, inline, lastState) {
        const lastRender = lastState &&
            (lastState.rendered
                ? lastState
                : lastState.lastRender);
        return {
            rendered: false,
            inline,
            icon,
            lastRender,
        };
    }

    /**
     * Register 'iconify-icon' component, if it does not exist
     */
    function defineIconifyIcon(name = 'iconify-icon') {
        // Check for custom elements registry and HTMLElement
        let customElements;
        let ParentClass;
        try {
            customElements = window.customElements;
            ParentClass = window.HTMLElement;
        }
        catch (err) {
            return;
        }
        // Make sure registry and HTMLElement exist
        if (!customElements || !ParentClass) {
            return;
        }
        // Check for duplicate
        const ConflictingClass = customElements.get(name);
        if (ConflictingClass) {
            return ConflictingClass;
        }
        // All attributes
        const attributes = [
            // Icon
            'icon',
            // Mode
            'mode',
            'inline',
            // Customisations
            'width',
            'height',
            'rotate',
            'flip',
        ];
        /**
         * Component class
         */
        const IconifyIcon = class extends ParentClass {
            // Root
            _shadowRoot;
            // State
            _state;
            // Attributes check queued
            _checkQueued = false;
            /**
             * Constructor
             */
            constructor() {
                super();
                // Attach shadow DOM
                const root = (this._shadowRoot = this.attachShadow({
                    mode: 'open',
                }));
                // Add style
                const inline = getInline(this);
                updateStyle(root, inline);
                // Create empty state
                this._state = setPendingState({
                    value: '',
                }, inline);
                // Queue icon render
                this._queueCheck();
            }
            /**
             * Observed attributes
             */
            static get observedAttributes() {
                return attributes.slice(0);
            }
            /**
             * Observed properties that are different from attributes
             *
             * Experimental! Need to test with various frameworks that support it
             */
            /*
            static get properties() {
                return {
                    inline: {
                        type: Boolean,
                        reflect: true,
                    },
                    // Not listing other attributes because they are strings or combination
                    // of string and another type. Cannot have multiple types
                };
            }
            */
            /**
             * Attribute has changed
             */
            attributeChangedCallback(name) {
                if (name === 'inline') {
                    // Update immediately: not affected by other attributes
                    const newInline = getInline(this);
                    const state = this._state;
                    if (newInline !== state.inline) {
                        // Update style if inline mode changed
                        state.inline = newInline;
                        updateStyle(this._shadowRoot, newInline);
                    }
                }
                else {
                    // Queue check for other attributes
                    this._queueCheck();
                }
            }
            /**
             * Get/set icon
             */
            get icon() {
                const value = this.getAttribute('icon');
                if (value && value.slice(0, 1) === '{') {
                    try {
                        return JSON.parse(value);
                    }
                    catch (err) {
                        //
                    }
                }
                return value;
            }
            set icon(value) {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                this.setAttribute('icon', value);
            }
            /**
             * Get/set inline
             */
            get inline() {
                return getInline(this);
            }
            set inline(value) {
                if (value) {
                    this.setAttribute('inline', 'true');
                }
                else {
                    this.removeAttribute('inline');
                }
            }
            /**
             * Restart animation
             */
            restartAnimation() {
                const state = this._state;
                if (state.rendered) {
                    const root = this._shadowRoot;
                    if (state.renderedMode === 'svg') {
                        // Update root node
                        try {
                            root.lastChild.setCurrentTime(0);
                            return;
                        }
                        catch (err) {
                            // Failed: setCurrentTime() is not supported
                        }
                    }
                    renderIcon(root, state);
                }
            }
            /**
             * Get status
             */
            get status() {
                const state = this._state;
                return state.rendered
                    ? 'rendered'
                    : state.icon.data === null
                        ? 'failed'
                        : 'loading';
            }
            /**
             * Queue attributes re-check
             */
            _queueCheck() {
                if (!this._checkQueued) {
                    this._checkQueued = true;
                    setTimeout(() => {
                        this._check();
                    });
                }
            }
            /**
             * Check for changes
             */
            _check() {
                if (!this._checkQueued) {
                    return;
                }
                this._checkQueued = false;
                const state = this._state;
                // Get icon
                const newIcon = this.getAttribute('icon');
                if (newIcon !== state.icon.value) {
                    this._iconChanged(newIcon);
                    return;
                }
                // Ignore other attributes if icon is not rendered
                if (!state.rendered) {
                    return;
                }
                // Check for mode and attribute changes
                const mode = this.getAttribute('mode');
                const customisations = getCustomisations(this);
                if (state.attrMode !== mode ||
                    haveCustomisationsChanged(state.customisations, customisations)) {
                    this._renderIcon(state.icon, customisations, mode);
                }
            }
            /**
             * Icon value has changed
             */
            _iconChanged(newValue) {
                const icon = parseIconValue(newValue, (value, name, data) => {
                    // Asynchronous callback: re-check values to make sure stuff wasn't changed
                    const state = this._state;
                    if (state.rendered || this.getAttribute('icon') !== value) {
                        // Icon data is already available or icon attribute was changed
                        return;
                    }
                    // Change icon
                    const icon = {
                        value,
                        name,
                        data,
                    };
                    if (icon.data) {
                        // Render icon
                        this._gotIconData(icon);
                    }
                    else {
                        // Nothing to render: update icon in state
                        state.icon = icon;
                    }
                });
                if (icon.data) {
                    // Icon is ready to render
                    this._gotIconData(icon);
                }
                else {
                    // Pending icon
                    this._state = setPendingState(icon, this._state.inline, this._state);
                }
            }
            /**
             * Got new icon data, icon is ready to (re)render
             */
            _gotIconData(icon) {
                this._checkQueued = false;
                this._renderIcon(icon, getCustomisations(this), this.getAttribute('mode'));
            }
            /**
             * Re-render based on icon data
             */
            _renderIcon(icon, customisations, attrMode) {
                // Get mode
                const renderedMode = getRenderMode(icon.data.body, attrMode);
                // Inline was not changed
                const inline = this._state.inline;
                // Set state and render
                renderIcon(this._shadowRoot, (this._state = {
                    rendered: true,
                    icon,
                    inline,
                    customisations,
                    attrMode,
                    renderedMode,
                }));
            }
        };
        // Add getters and setters
        attributes.forEach((attr) => {
            if (!(attr in IconifyIcon.prototype)) {
                Object.defineProperty(IconifyIcon.prototype, attr, {
                    get: function () {
                        return this.getAttribute(attr);
                    },
                    set: function (value) {
                        if (value !== null) {
                            this.setAttribute(attr, value);
                        }
                        else {
                            this.removeAttribute(attr);
                        }
                    },
                });
            }
        });
        // Add exported functions: both as static and instance methods
        const functions = exportFunctions();
        for (const key in functions) {
            IconifyIcon[key] = IconifyIcon.prototype[key] = functions[key];
        }
        // Define new component
        customElements.define(name, IconifyIcon);
        return IconifyIcon;
    }

    /**
     * Create exported data: either component instance or functions
     */
    defineIconifyIcon() || exportFunctions();

    /* src/lib/components/organisms/+card.svelte generated by Svelte v3.59.2 */
    const file$3 = "src/lib/components/organisms/+card.svelte";

    // (22:4) {#if selected}
    function create_if_block$1(ctx) {
    	let div;
    	let iconify_icon;

    	const block = {
    		c: function create() {
    			div = element("div");
    			iconify_icon = element("iconify-icon");
    			set_custom_element_data(iconify_icon, "icon", "subway:tick");
    			add_location(iconify_icon, file$3, 22, 46, 681);
    			attr_dev(div, "class", "card__selected-indicator svelte-180im6k");
    			add_location(div, file$3, 22, 8, 643);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, iconify_icon);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(22:4) {#if selected}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let span;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let t3_value = (/*dob*/ ctx[2] ?? "") + "";
    	let t3;
    	let t4;
    	let div1;
    	let t5;
    	let t6_value = (/*patientId*/ ctx[1] ?? "") + "";
    	let t6;
    	let t7;
    	let p;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let if_block = /*selected*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			span = element("span");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			div0 = element("div");
    			t2 = text("DOB: ");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			t5 = text("patientId: ");
    			t6 = text(t6_value);
    			t7 = space();
    			p = element("p");
    			if (default_slot) default_slot.c();
    			t8 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "card__name svelte-180im6k");
    			add_location(span, file$3, 17, 4, 406);
    			attr_dev(div0, "class", "card__text svelte-180im6k");
    			add_location(div0, file$3, 18, 4, 451);
    			attr_dev(div1, "class", "card__text svelte-180im6k");
    			add_location(div1, file$3, 19, 4, 504);
    			attr_dev(p, "class", "card__description svelte-180im6k");
    			add_location(p, file$3, 20, 4, 569);
    			attr_dev(div2, "class", "card cursor-pointer position-relative svelte-180im6k");
    			add_location(div2, file$3, 16, 0, 319);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span);
    			append_dev(span, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div2, t7);
    			append_dev(div2, p);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			append_dev(div2, t8);
    			if (if_block) if_block.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*click_handler*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			if ((!current || dirty & /*dob*/ 4) && t3_value !== (t3_value = (/*dob*/ ctx[2] ?? "") + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*patientId*/ 2) && t6_value !== (t6_value = (/*patientId*/ ctx[1] ?? "") + "")) set_data_dev(t6, t6_value);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*selected*/ ctx[3]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	let { name } = $$props;
    	let { gender } = $$props;
    	let { patientId } = $$props;
    	let { dob } = $$props;
    	let { selected = false } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleClick(event) {
    		dispatch('click', event);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Card> was created without expected prop 'name'");
    		}

    		if (gender === undefined && !('gender' in $$props || $$self.$$.bound[$$self.$$.props['gender']])) {
    			console.warn("<Card> was created without expected prop 'gender'");
    		}

    		if (patientId === undefined && !('patientId' in $$props || $$self.$$.bound[$$self.$$.props['patientId']])) {
    			console.warn("<Card> was created without expected prop 'patientId'");
    		}

    		if (dob === undefined && !('dob' in $$props || $$self.$$.bound[$$self.$$.props['dob']])) {
    			console.warn("<Card> was created without expected prop 'dob'");
    		}
    	});

    	const writable_props = ['name', 'gender', 'patientId', 'dob', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleClick();

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('gender' in $$props) $$invalidate(5, gender = $$props.gender);
    		if ('patientId' in $$props) $$invalidate(1, patientId = $$props.patientId);
    		if ('dob' in $$props) $$invalidate(2, dob = $$props.dob);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		name,
    		gender,
    		patientId,
    		dob,
    		selected,
    		dispatch,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('gender' in $$props) $$invalidate(5, gender = $$props.gender);
    		if ('patientId' in $$props) $$invalidate(1, patientId = $$props.patientId);
    		if ('dob' in $$props) $$invalidate(2, dob = $$props.dob);
    		if ('selected' in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		name,
    		patientId,
    		dob,
    		selected,
    		handleClick,
    		gender,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			name: 0,
    			gender: 5,
    			patientId: 1,
    			dob: 2,
    			selected: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get name() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gender() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gender(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get patientId() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set patientId(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dob() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dob(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/+Home.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$2 = "src/routes/+Home.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].name;
    	child_ctx[10] = list[i].patientId;
    	child_ctx[11] = list[i].dob;
    	return child_ctx;
    }

    // (230:12) {#if firstLetterMap[getFirstLetter(name)] === patientId}
    function create_if_block(ctx) {
    	let div;
    	let t_value = /*getFirstLetter*/ ctx[5](/*name*/ ctx[0]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "sticky-letter-header svelte-11r9rhs");
    			add_location(div, file$2, 230, 16, 6199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sortedAndFilteredPatients*/ 8 && t_value !== (t_value = /*getFirstLetter*/ ctx[5](/*name*/ ctx[0]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(230:12) {#if firstLetterMap[getFirstLetter(name)] === patientId}",
    		ctx
    	});

    	return block;
    }

    // (233:12) <Card selected={patientId === currentlySelectedPatient} name={name} patientId={patientId} dob={dob} on:click={(e) => currentlySelectedPatient = patientId}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Aliquam erat volutpat. Nunc eleifend leo vitae magna.\n            ");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(233:12) <Card selected={patientId === currentlySelectedPatient} name={name} patientId={patientId} dob={dob} on:click={(e) => currentlySelectedPatient = patientId}>",
    		ctx
    	});

    	return block;
    }

    // (229:8) {#each sortedAndFilteredPatients as {name, patientId, dob}
    function create_each_block(key_1, ctx) {
    	let first;
    	let show_if = /*firstLetterMap*/ ctx[4][/*getFirstLetter*/ ctx[5](/*name*/ ctx[0])] === /*patientId*/ ctx[10];
    	let t;
    	let card;
    	let current;
    	let if_block = show_if && create_if_block(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[7](/*patientId*/ ctx[10], ...args);
    	}

    	card = new Card({
    			props: {
    				selected: /*patientId*/ ctx[10] === /*currentlySelectedPatient*/ ctx[2],
    				name: /*name*/ ctx[0],
    				patientId: /*patientId*/ ctx[10],
    				dob: /*dob*/ ctx[11],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	card.$on("click", click_handler);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			t = space();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*firstLetterMap, sortedAndFilteredPatients*/ 24) show_if = /*firstLetterMap*/ ctx[4][/*getFirstLetter*/ ctx[5](/*name*/ ctx[0])] === /*patientId*/ ctx[10];

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const card_changes = {};
    			if (dirty & /*sortedAndFilteredPatients, currentlySelectedPatient*/ 12) card_changes.selected = /*patientId*/ ctx[10] === /*currentlySelectedPatient*/ ctx[2];
    			if (dirty & /*sortedAndFilteredPatients*/ 8) card_changes.name = /*name*/ ctx[0];
    			if (dirty & /*sortedAndFilteredPatients*/ 8) card_changes.patientId = /*patientId*/ ctx[10];
    			if (dirty & /*sortedAndFilteredPatients*/ 8) card_changes.dob = /*dob*/ ctx[11];

    			if (dirty & /*$$scope*/ 16384) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(229:8) {#each sortedAndFilteredPatients as {name, patientId, dob}",
    		ctx
    	});

    	return block;
    }

    // (226:4) <LeftPanel>
    function create_default_slot_1(ctx) {
    	let h3;
    	let t1;
    	let input;
    	let t2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*sortedAndFilteredPatients*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*patientId*/ ctx[10];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "Select Patient";
    			t1 = space();
    			input = element("input");
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(h3, file$2, 226, 8, 5902);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "class", "svelte-11r9rhs");
    			add_location(input, file$2, 227, 8, 5934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sortedAndFilteredPatients, currentlySelectedPatient, getFirstLetter, firstLetterMap*/ 60) {
    				each_value = /*sortedAndFilteredPatients*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(226:4) <LeftPanel>",
    		ctx
    	});

    	return block;
    }

    // (240:8) <LargeRoundButton>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start Recording");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(240:8) <LargeRoundButton>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let body;
    	let leftpanel;
    	let t;
    	let section;
    	let largeroundbutton;
    	let current;

    	leftpanel = new Left_panel({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	largeroundbutton = new Large_round_button({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(leftpanel.$$.fragment);
    			t = space();
    			section = element("section");
    			create_component(largeroundbutton.$$.fragment);
    			attr_dev(section, "class", "content flex justify-center svelte-11r9rhs");
    			add_location(section, file$2, 238, 4, 6576);
    			attr_dev(body, "class", "flex flex-row");
    			add_location(body, file$2, 224, 0, 5849);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(leftpanel, body, null);
    			append_dev(body, t);
    			append_dev(body, section);
    			mount_component(largeroundbutton, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const leftpanel_changes = {};

    			if (dirty & /*$$scope, sortedAndFilteredPatients, currentlySelectedPatient, firstLetterMap, currentSearchString*/ 16414) {
    				leftpanel_changes.$$scope = { dirty, ctx };
    			}

    			leftpanel.$set(leftpanel_changes);
    			const largeroundbutton_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				largeroundbutton_changes.$$scope = { dirty, ctx };
    			}

    			largeroundbutton.$set(largeroundbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftpanel.$$.fragment, local);
    			transition_in(largeroundbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftpanel.$$.fragment, local);
    			transition_out(largeroundbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(leftpanel);
    			destroy_component(largeroundbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let sortedAndFilteredPatients;
    	let firstLetterMap;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let { name } = $$props;
    	let currentSelectPatient;
    	let currentSearchString = "";

    	const patients = [
    		{
    			"patientId": "33256246",
    			"name": "Jane Smith",
    			"dob": "22-01-1960",
    			"description": "Randomly generated patient data.",
    			"conditions": ["arthritis"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "17630222",
    			"name": "Messica Taylor",
    			"dob": "06-08-1959",
    			"description": "Randomly generated patient data.",
    			"conditions": ["diabetes"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "51541971",
    			"name": "Marah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "1234",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "12345",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "123456",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "1234567",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "12345678",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "123456789",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "123410",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "123411",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "123412",
    			"name": "Zarah Davis",
    			"dob": "04-03-1984",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "78347373",
    			"name": "James Wilson",
    			"dob": "28-12-1970",
    			"description": "Randomly generated patient data.",
    			"conditions": ["asthma"],
    			"gender": "Female"
    		},
    		{
    			"patientId": "62893249",
    			"name": "John Doe",
    			"dob": "19-04-1959",
    			"description": "Randomly generated patient data.",
    			"conditions": ["anemia"],
    			"gender": "Female"
    		},
    		{
    			"patientId": "97346510",
    			"name": "John Doe",
    			"dob": "09-05-1989",
    			"description": "Randomly generated patient data.",
    			"conditions": ["depression"],
    			"gender": "Female"
    		},
    		{
    			"patientId": "62394872",
    			"name": "Robert Miller",
    			"dob": "10-10-1956",
    			"description": "Randomly generated patient data.",
    			"conditions": ["heart disease"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "83997215",
    			"name": "Jessica Taylor",
    			"dob": "06-06-1948",
    			"description": "Randomly generated patient data.",
    			"conditions": ["malaria"],
    			"gender": "Male"
    		},
    		{
    			"patientId": "34695566",
    			"name": "James Wilson",
    			"dob": "03-06-2003",
    			"description": "Randomly generated patient data.",
    			"conditions": ["COPD"],
    			"gender": "Female"
    		},
    		{
    			"patientId": "65702472",
    			"name": "Michael Brown",
    			"dob": "22-06-1997",
    			"description": "Randomly generated patient data.",
    			"conditions": ["chronic kidney disease"],
    			"gender": "Female"
    		}
    	];

    	const getFirstLetter = name => name[0].toUpperCase();
    	let currentlySelectedPatient;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console_1.warn("<Home> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => {
    		$$invalidate(1, currentSearchString = e.target.value);
    	};

    	const click_handler = (patientId, e) => $$invalidate(2, currentlySelectedPatient = patientId);

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		LargeRoundButton: Large_round_button,
    		LeftPanel: Left_panel,
    		Card,
    		currentSelectPatient,
    		currentSearchString,
    		patients,
    		getFirstLetter,
    		currentlySelectedPatient,
    		sortedAndFilteredPatients,
    		firstLetterMap
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('currentSelectPatient' in $$props) currentSelectPatient = $$props.currentSelectPatient;
    		if ('currentSearchString' in $$props) $$invalidate(1, currentSearchString = $$props.currentSearchString);
    		if ('currentlySelectedPatient' in $$props) $$invalidate(2, currentlySelectedPatient = $$props.currentlySelectedPatient);
    		if ('sortedAndFilteredPatients' in $$props) $$invalidate(3, sortedAndFilteredPatients = $$props.sortedAndFilteredPatients);
    		if ('firstLetterMap' in $$props) $$invalidate(4, firstLetterMap = $$props.firstLetterMap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentSearchString*/ 2) {
    			$$invalidate(3, sortedAndFilteredPatients = patients.sort((a, b) => a.name.localeCompare(b.name)).filter(patient => patient.name.toLowerCase().includes(currentSearchString.toLowerCase())));
    		}

    		if ($$self.$$.dirty & /*currentlySelectedPatient*/ 4) {
    			if (currentlySelectedPatient) {
    				console.log(currentlySelectedPatient);
    			}
    		}

    		if ($$self.$$.dirty & /*sortedAndFilteredPatients*/ 8) {
    			$$invalidate(4, firstLetterMap = sortedAndFilteredPatients.reduce(
    				(map, patient) => {
    					const firstLetter = getFirstLetter(patient.name);

    					if (!map[firstLetter]) {
    						map[firstLetter] = patient.patientId;
    					}

    					return map;
    				},
    				{}
    			));
    		}
    	};

    	return [
    		name,
    		currentSearchString,
    		currentlySelectedPatient,
    		sortedAndFilteredPatients,
    		firstLetterMap,
    		getFirstLetter,
    		input_handler,
    		click_handler
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get name() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/+About.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/routes/+About.svelte";

    // (9:2) <LargeRoundButton>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Start Recording");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(9:2) <LargeRoundButton>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let leftpanel;
    	let t;
    	let largeroundbutton;
    	let current;
    	leftpanel = new Left_panel({ $$inline: true });

    	largeroundbutton = new Large_round_button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(leftpanel.$$.fragment);
    			t = space();
    			create_component(largeroundbutton.$$.fragment);
    			attr_dev(main, "class", "flex justify-center svelte-1k44510");
    			add_location(main, file$1, 6, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(leftpanel, main, null);
    			append_dev(main, t);
    			mount_component(largeroundbutton, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const largeroundbutton_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				largeroundbutton_changes.$$scope = { dirty, ctx };
    			}

    			largeroundbutton.$set(largeroundbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftpanel.$$.fragment, local);
    			transition_in(largeroundbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftpanel.$$.fragment, local);
    			transition_out(largeroundbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(leftpanel);
    			destroy_component(largeroundbutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let { name } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<About> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name, LargeRoundButton: Large_round_button, LeftPanel: Left_panel });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get name() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file, 12, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const routes = { '/': Home, '/about': About };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, Home, About, routes });
    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
