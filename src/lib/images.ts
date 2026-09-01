type ImageModule = { default: ImageMetadata };

function toMap(glob: Record<string, ImageModule>) {
  const map = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(glob)) {
    const filename = path.split('/').pop()!;
    map.set(filename, mod.default);
  }
  return map;
}

const skillImages = import.meta.glob<ImageModule>('/src/assets/images/skills/*', { eager: true });
const projectImages = import.meta.glob<ImageModule>('/src/assets/images/sections/projects/*', { eager: true });
const authorImages = import.meta.glob<ImageModule>('/src/assets/images/author/*', { eager: true });

export const skillIcons = toMap(skillImages);
export const projectLogos = toMap(projectImages);
export const authorPhotos = toMap(authorImages);
