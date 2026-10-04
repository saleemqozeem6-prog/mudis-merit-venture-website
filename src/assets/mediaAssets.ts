import heroFurnitureFoam from './images/hero_furniture_foam_1791093541655.jpg';
import customSofaLiving from './images/custom_sofa_living_1791093566797.jpg';
import foamMattressCraft from './images/foam_mattress_craft_1791093554667.jpg';
import workshopCarpentry from './images/workshop_carpentry_cutting_1791093578434.jpg';

export const MEDIA_ASSETS = {
  hero: heroFurnitureFoam,
  sofa: customSofaLiving,
  foam: foamMattressCraft,
  workshop: workshopCarpentry,
};

export const resolveImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') return '';
  if (url.includes('hero_furniture_foam')) return heroFurnitureFoam;
  if (url.includes('custom_sofa_living')) return customSofaLiving;
  if (url.includes('foam_mattress_craft')) return foamMattressCraft;
  if (url.includes('workshop_carpentry')) return workshopCarpentry;
  return url;
};
