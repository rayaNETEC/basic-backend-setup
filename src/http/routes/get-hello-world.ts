import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

/**
 * Registers the "/hello-world" GET route on the provided Fastify instance.
 *
 * @param app - The Fastify instance to register the route on.
 * @remarks
 * Responds with a 201 status and a JSON message.
 */
export async function getHelloWorld(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/hello-world",
    {
      schema: {
        tags: ["wello-world"],
        summary: "Simple route",
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(201).send({ message: "Hello World" });
    },
  );
}
