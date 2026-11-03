export type LiveClassStatus = 'SOON' | 'IN_LIVE';

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  duration: string;
  timeLife: string;
  status: LiveClassStatus;
  transmitionLink: string;
}