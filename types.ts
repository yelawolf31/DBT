
export interface Reading {
  id: string;
  value: number;
  timestamp: string;
}

export enum ReadingStatus {
  Normal = 'Normal',
  SlightlyHigh = 'SlightlyHigh',
  High = 'High',
  SlightlyLow = 'SlightlyLow',
  Low = 'Low',
  DangerousLow = 'DangerousLow',
  DangerousHigh = 'DangerousHigh',
}

export enum Screen {
  Home = 'Home',
  NewReading = 'NewReading',
  More = 'More',
  History = 'History',
}

export interface Settings {
    fontSize: number;
    isDarkMode: boolean;
    reminders: {
        morning: boolean;
        noon: boolean;
        evening: boolean;
    }
}
