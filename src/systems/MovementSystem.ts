import {
    defineSystem,
    defineQuery
} from 'bitecs'

import { Position } from '../components/Position'
import { Velocity } from '../components/Velocity'
import { Rotation } from '../components/Rotation'
import { Input } from '../components/Input'

export default function createMovementSystem(spd = 1)
{   
    // any entities have position and velocity
    const query = defineQuery([Position, Velocity, Rotation, Input])
    return defineSystem(world => {
        const entities = query(world)
        entities.forEach((id) => {

            // set direction
            Position.x[id] += Velocity.x[id]
            Position.y[id] += Velocity.y[id]
        })

        return world
    })
}