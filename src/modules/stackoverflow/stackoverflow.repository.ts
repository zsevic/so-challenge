import { BadRequestException, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { parse } from 'url';

export class StackoverflowRepository {
  private readonly logger = new Logger(StackoverflowRepository.name);

  async getData(
    apiCalls: Promise<AxiosResponse<any>>[],
    data = [],
  ): Promise<any> {
    const newApiCalls = [];
    try {
      const responses = await Promise.all(apiCalls);
      const result = responses.map(response => {
        const { url } = response.config;
        const urlPath = url.split('?')[0];
        if (response.data.has_more) {
          const { query } = parse(url, true);
          const page = +query.page + 1 + '';
          const queryParameters = new URLSearchParams({
            ...query,
            page,
          });
          const apiUrl = urlPath + '?' + queryParameters.toString();

          newApiCalls.push(axios.get(apiUrl));
        }
        const resource =
          urlPath.split('/').slice(-1)[0] === 'answers'
            ? 'answers'
            : 'questions';
        this.logger.debug(
          `get ${resource}, length: ${response.data.items.length}, has more: ${response.data.has_more},
        remaining requests: ${response.data.quota_remaining}`,
        );
        return response.data.items;
      });
      const newData = data.concat(...result);

      return newApiCalls.length > 0
        ? this.getData(newApiCalls, newData)
        : newData;
    } catch (err) {
      this.logger.error(`get data error: ${err}`);
      throw new BadRequestException(err);
    }
  }

  async getUsers(usersUrl: string): Promise<any> {
    return axios
      .get(usersUrl)
      .then(response => {
        this.logger.debug(
          `get users, remaining requests: ${response.data.quota_remaining}`,
        );
        return response.data.items;
      })
      .catch(err => {
        this.logger.error(`get users error: ${err}`);
        throw new BadRequestException(err);
      });
  }
}
