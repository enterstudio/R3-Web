import axios from 'http'
import bus from 'eventBus'

import Infantry from './infantry'
import Vehicles from './vehicles'

class Playback {

    constructor () {

        this.missionId = 0
        this.highlightUnit = 0
        this.trackingHighlightedUnit = false
        this.centeredOnFirstPlayer = false
    }

    load (missionId) {

        this.missionId = missionId

        return new Promise((resolve, reject) => {

            axios.get(`/missions/${this.missionId}`)
                .then(response => {

                    console.log('Playback: Got mission info', response.data)

                    this.missionInfo = response.data

                    resolve(response.data)
                })
                .catch(error => {
                    console.error('Error fetching mission info', error)

                    reject(error)
                })
        })
    }

    findEntity (entityId, checkMap = false) {

        if (Infantry.entities.hasOwnProperty(entityId)) {

            if (!checkMap)
                return Infantry.entities[entityId]

            if (
                Infantry.entities[entityId].hasOwnProperty('layer') &&
                Infantry.layer.hasLayer(Infantry.entities[entityId].layer)
            )
                return Infantry.entities[entityId]
            else
                return false
        }

        if (Vehicles.entities.hasOwnProperty(entityId)) {

            if (!checkMap)
                return Vehicles.entities[entityId]

            if (
                Vehicles.entities[entityId].hasOwnProperty('layer') &&
                Vehicles.layer.hasLayer(Vehicles.entities[entityId].layer)
            )
                return Vehicles.entities[entityId]
            else
                return false
        }

        return false
    }

    startHighlightingUnit (entityId) {

        this.highlightUnit = entityId
        this.trackingHighlightedUnit = true
    }

    stopTrackingHighlightedUnit () {

        this.trackingHighlightedUnit = false
    }
}

export default new Playback