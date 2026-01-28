import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpHeaders } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      
      // Create auth link to add JWT token to requests
      const authLink = setContext((_, context) => {
        const token = localStorage.getItem('rmrts_token');
        const headersFromContext = context.headers;
        const existingHeaders = headersFromContext instanceof HttpHeaders
          ? headersFromContext
          : new HttpHeaders((headersFromContext ?? {}) as unknown as Record<string, string>);

        return {
          headers: token
            ? existingHeaders.set('Authorization', `Bearer ${token}`)
            : existingHeaders
        };
      });

      return {
        link: ApolloLink.from([authLink, httpLink.create({ uri: environment.graphqlUrl })]),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
          query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
        },
      };
    })
  ]
};
