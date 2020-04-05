
const setProp = (state, { key, value })=> state[key] = value


const setProps = (state, pairList)=> pairList.forEach(pair => setProp(state, pair))


const mergeProp = (state, { key, value })=> state[key] = { ...state[key], ...value}


const mergeProps = (state, pairList)=> pairList.forEach(pair => mergeProp(state, pair))


const mapProp = (state, { key, value })=> state[key] = value(state, key)


export const mutations = {
    setProp,
    setProps,
    mergeProp,
    mergeProps,
    mapProp
}

export default mutations
