import { z } from 'zod';
import {
  insertAppointmentSchema,
  updateAppointmentSchema,
  appointments,
  insertResourceSchema,
  resources,
  insertPostSchema,
  posts,
  insertReplySchema,
  replies,
  insertMoodEntrySchema,
  moodEntries
} from './schema';
import { users } from './models/auth';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  appointments: {
    list: {
      method: 'GET' as const,
      path: '/api/appointments',
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id',
      input: updateAppointmentSchema,
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  resources: {
    list: {
      method: 'GET' as const,
      path: '/api/resources',
      responses: {
        200: z.array(z.custom<typeof resources.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/resources',
      input: insertResourceSchema,
      responses: {
        201: z.custom<typeof resources.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts',
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect & { author: { username: string | null } | null }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/posts/:id',
      responses: {
        200: z.custom<typeof posts.$inferSelect & { replies: (typeof replies.$inferSelect & { author: { username: string | null } | null })[], author: { username: string | null } | null }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts',
      input: insertPostSchema,
      responses: {
        201: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  replies: {
    create: {
      method: 'POST' as const,
      path: '/api/posts/:postId/replies',
      input: insertReplySchema.omit({ postId: true }),
      responses: {
        201: z.custom<typeof replies.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  mood: {
    list: {
      method: 'GET' as const,
      path: '/api/mood',
      responses: {
        200: z.array(z.custom<typeof moodEntries.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/mood',
      input: insertMoodEntrySchema,
      responses: {
        201: z.custom<typeof moodEntries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  admin: {
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats',
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type AppointmentInput = z.infer<typeof api.appointments.create.input>;
export type ResourceInput = z.infer<typeof api.resources.create.input>;
export type PostInput = z.infer<typeof api.posts.create.input>;
export type ReplyInput = z.infer<typeof api.replies.create.input>;
export type MoodInput = z.infer<typeof api.mood.create.input>;
