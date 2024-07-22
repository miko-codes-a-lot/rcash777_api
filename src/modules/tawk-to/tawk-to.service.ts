import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class TawkToService {
  private tawkToApi: AxiosInstance;

  constructor(private httpService: HttpService) {
    const apiBaseUrl = 'https://api.tawk.to/v1';
    const apiKey = 'ak00f69408141a884f069c66ba900e742cc5';

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
