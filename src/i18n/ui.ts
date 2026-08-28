export const languages = {
  en: 'English',
  id: 'Indonesia'
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.about': './about',
    'nav.skills': './skills',
    'nav.experiences': './experience',
    'nav.projects': './projects',
    'about.downloadResume': 'Download Resume',
    'about.contactMe': 'Contact Me',
    'projects.viewRepo': 'View Repo',
    'theme.toggle': 'Toggle dark / light theme',
    'lang.switchTo': 'Bahasa Indonesia'
  },
  id: {
    'nav.about': './tentang',
    'nav.skills': './keahlian',
    'nav.experiences': './pengalaman',
    'nav.projects': './proyek',
    'about.downloadResume': 'Unduh Resume',
    'about.contactMe': 'Hubungi Saya',
    'projects.viewRepo': 'Lihat Repo',
    'theme.toggle': 'Ganti tema gelap / terang',
    'lang.switchTo': 'English'
  }
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
