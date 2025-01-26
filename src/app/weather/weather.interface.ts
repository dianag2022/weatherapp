export interface WeatherData {
  current: any;
  name: string;
  location: {
    name: string;
    localtime: string;
  };
}
