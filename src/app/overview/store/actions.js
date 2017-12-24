import { updateSettings } from '@/api/settings'

export const updateFilter = ({ state, commit }, data) => {
  const config = { ...state.settings, ...data }
  return updateSettings(config)
    .then(() => commit('UPDATE_FILTER', data))
}

export const updatePlantCategory = ({ state, commit }, data) => {
  // return updatePlant(config)
  // .then(() => commit('UPDATE_PLANT_CATEGORY', { item: data }))
  commit('UPDATE_PLANT_CATEGORY', { item: data })
}

export const updatePlantsList = ({ state, commit }, data) => {
  return Promise.resolve()
    .then(() => commit('UPDATE_PLANT_OVERVIEW', { item: data }))
}
