
//

const groupByKey = <K, V>(items: V[], keyFn: (item: V) => K): Map<K, V[]> => {
    const map = new Map<K, V[]>()
    for (const item of items) {
        const key = keyFn(item)
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(item)
    }
    return map
}

//

export { groupByKey }
