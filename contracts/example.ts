import { oc, ORPCError } from '@orpc/contract'
import { implement } from '@orpc/server'   
import { z } from 'zod/v4'
import { IncomingHttpHeaders } from 'http'

export const PlanetSchema = z.object({
    id: z.number().int().min(1),
    name: z.string(),
    description: z.string().optional(),
  })
  
  export const listPlanetContract = oc
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).optional(),
        cursor: z.number().int().min(0).default(0),
      }),
    )
    .output(z.array(PlanetSchema))
  
  export const findPlanetContract = oc
    .input(PlanetSchema.pick({ id: true }))
    .output(PlanetSchema)
  
  export const createPlanetContract = oc
    .input(PlanetSchema.omit({ id: true }))
    .output(PlanetSchema)
  
  export const exampleContract = {
    planet: {
      list: listPlanetContract,
      find: findPlanetContract,
      create: createPlanetContract,
    }
  }

  const os = implement(exampleContract)
  
  export const listPlanet = os.planet.list.handler(({ input }) => {
    return [{ id: 1, name: 'name' }]
  })

  export const findPlanet = os.planet.find.handler(({ input }) => {
    return { id: 1, name: 'name' }
  })

  export const createPlanet = os.planet.create.handler(({ input }) => {
    return { id: 1, name: 'name' }
  })

  export const router = os.router({
    planet: {
      list: listPlanet,
      find: findPlanet,
      create: createPlanet
    }
  }

  )
    // .route({ method: 'GET', path: '/planets' })
    // .input(z.object({
    //   limit: z.number().int().min(1).max(100).optional(),
    //   cursor: z.number().int().min(0).default(0),
    // }))
    // .output(z.array(PlanetSchema))
    // .handler(async ({ input }) => {
    //   // your list code here
    //   return [{ id: 1, name: 'name' }]
    // })
  
//   export const findPlanet = os
//     .route({ method: 'GET', path: '/planets/{id}' })
//     .input(z.object({ id: z.coerce.number().int().min(1) }))
//     .output(PlanetSchema)
//     .handler(async ({ input }) => {
//       // your find code here
//       return { id: 1, name: 'name' }
//     })
  
//   export const createPlanet = os
//     .$context<{ headers: IncomingHttpHeaders }>()
//     .use(({ context, next }) => {
//       const user = parseJWT(context.headers.authorization?.split(' ')[1])
  
//       if (user) {
//         return next({ context: { user } })
//       }
  
//       throw new ORPCError('UNAUTHORIZED')
//     })
//     .route({ method: 'POST', path: '/planets' })
//     .input(PlanetSchema.omit({ id: true }))
//     .output(PlanetSchema)
//     .handler(async ({ input, context }) => {
//       // your create code here
//       return { id: 1, name: 'name' }
//     })
