import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosInstance } from 'axios';
import config from 'src/config/config';

@Injectable()
export class TawkToService {
  private tawkToApi: AxiosInstance;

  constructor(private httpService: HttpService) {
    const apiBaseUrl = config.tawkto.baseUrl;
    const apiKey = config.tawkto.apiKey;

    this.tawkToApi = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: apiKey,
        password: '',
      },
    });
  }

  async getProperties() {
    try {
      const { data: propertiesData } = await this.tawkToApi.post('/property.list', {});
      return propertiesData.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch properties');
    }
  }

  async getProperty(propertyId: string) {
    try {
      const { data: propertyData } = await this.tawkToApi.post('/property.info', {
        propertyId,
        fields: { widgets: true },
      });
      return propertyData.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch property');
    }
  }
  
}
