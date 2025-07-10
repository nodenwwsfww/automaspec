import { oc } from "@orpc/contract";
import { implement } from "@orpc/server";
import * as z from "zod";

const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

const listPlanetContract = oc
  .route({ method: "GET", path: "/planets" })
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    })
  )
  .output(z.array(PlanetSchema));

const findPlanetContract = oc
  .route({ method: "GET", path: "/planets/{id}" })
  .input(PlanetSchema.pick({ id: true }))
  .output(PlanetSchema);

const createPlanetContract = oc
  .route({ method: "POST", path: "/planets" })
  .input(PlanetSchema.omit({ id: true }))
  .output(PlanetSchema);

export const exampleContract = {
  planet: {
    list: listPlanetContract,
    find: findPlanetContract,
    create: createPlanetContract,
  },
};

const os = implement(exampleContract);

const listPlanet = os.planet.list.handler(({ input }) => {
  return [{ id: 1, name: "name" }];
});

const findPlanet = os.planet.find.handler(({ input }) => {
  return { id: 1, name: "name" };
});

const createPlanet = os.planet.create.handler(({ input }) => {
  return { id: 1, name: "name" };
});

export const router = os.router({
  planet: {
    list: listPlanet,
    find: findPlanet,
    create: createPlanet,
  },
});
