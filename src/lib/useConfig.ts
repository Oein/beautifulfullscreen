import { addChangeListener, get, type __defaultConfig__ } from "./config";

/**
 * React hook that subscribes to a config key and returns its current value.
 * Automatically re-renders when the config value changes.
 */
export function useConfig<K extends keyof typeof __defaultConfig__>(
    key: K
): (typeof __defaultConfig__)[K] {
    const { useState, useEffect } = Spicetify.React;
    const [value, setValue] = useState(get(key));

    useEffect(() => {
        return addChangeListener(key, () => setValue(get(key)));
    }, [key]);

    return value;
}

/**
 * Subscribe to multiple config keys at once.
 * Returns an object with the current value for each key.
 */
export function useConfigs<K extends keyof typeof __defaultConfig__>(
    keys: readonly K[]
): Pick<typeof __defaultConfig__, K> {
    const { useState, useEffect } = Spicetify.React;

    const getValues = () => {
        const result: Partial<typeof __defaultConfig__> = {};
        for (const key of keys) {
            result[key] = get(key);
        }
        return result as Pick<typeof __defaultConfig__, K>;
    };

    const [values, setValues] = useState(getValues);

    useEffect(() => {
        const unsubscribers = keys.map((key) =>
            addChangeListener(key, () => {
                setValues((prev: Pick<typeof __defaultConfig__, K>) => ({
                    ...prev,
                    [key]: get(key),
                }));
            })
        );
        return () => unsubscribers.forEach((unsub) => unsub());
    }, [keys.join(",")]);

    return values;
}
