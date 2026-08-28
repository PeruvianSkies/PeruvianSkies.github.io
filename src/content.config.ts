import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sectionMeta = z.object({
  name: z.string(),
  id: z.string(),
  enable: z.boolean(),
  weight: z.number(),
  showOnNavbar: z.boolean()
});

const author = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/author' }),
  schema: z.object({
    name: z.string(),
    nickname: z.string(),
    greeting: z.string(),
    image: z.string(),
    contactInfo: z.object({
      email: z.string(),
      phone: z.string()
    }),
    summary: z.array(z.string())
  })
});

const about = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/about' }),
  schema: z.object({
    section: sectionMeta,
    designation: z.string(),
    company: z.object({
      name: z.string(),
      url: z.string()
    }),
    resume: z.string(),
    summary: z.string(),
    socialLinks: z.array(
      z.object({
        name: z.string(),
        icon: z.string(),
        url: z.string()
      })
    ),
    softSkills: z.array(
      z.object({
        name: z.string(),
        percentage: z.number(),
        color: z.string()
      })
    )
  })
});

const skills = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/skills' }),
  schema: z.object({
    section: sectionMeta,
    skills: z.array(
      z.object({
        name: z.string(),
        icon: z.string(),
        summary: z.string(),
        url: z.string()
      })
    )
  })
});

const experiences = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/experiences' }),
  schema: z.object({
    section: sectionMeta,
    experiences: z.array(
      z.object({
        company: z.object({
          name: z.string(),
          url: z.string(),
          location: z.string()
        }),
        positions: z.array(
          z.object({
            designation: z.string(),
            start: z.string(),
            end: z.string().nullable().optional(),
            responsibilities: z.array(z.string())
          })
        )
      })
    )
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    section: sectionMeta,
    buttons: z.array(
      z.object({
        name: z.string(),
        filter: z.string()
      })
    ),
    projects: z.array(
      z.object({
        name: z.string(),
        logo: z.string().optional(),
        role: z.string(),
        timeline: z.string().nullable().optional(),
        repo: z.string(),
        summary: z.string(),
        tags: z.array(z.string())
      })
    )
  })
});

const site = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/site' }),
  schema: z.object({
    copyright: z.string(),
    description: z.string()
  })
});

export const collections = { author, about, skills, experiences, projects, site };
