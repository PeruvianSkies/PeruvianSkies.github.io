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

const skillItem = z.object({
  name: z.string(),
  icon: z.string().optional(),
  summary: z.string(),
  url: z.string()
});

// Used as a fallback icon for skills without a bundled logo file (src/assets/images/skills/) --
// see CategoryIcon.astro for the actual SVG per key.
const genericIconKey = z.enum(['cloud', 'containers', 'cicd', 'security', 'finops', 'observability', 'systems', 'data']);

const skills = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/skills' }),
  schema: z.object({
    section: sectionMeta,
    categories: z.array(
      z.object({
        name: z.string(),
        genericIcon: genericIconKey,
        skills: z.array(skillItem)
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
            responsibilities: z.array(z.string()),
            achievements: z.array(z.string()).optional()
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
    projects: z.array(
      z.object({
        name: z.string(),
        logo: z.string().optional(),
        role: z.string(),
        timeline: z.string().nullable().optional(),
        repo: z.string().optional(),
        summary: z.string(),
        skills: z.array(z.string()),
        skillsNote: z.string().optional()
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
